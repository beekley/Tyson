// Omnibox event handling and functionality

const verbose = false;

// Navigate to URL
function nav(url, disposition){
  switch(disposition){
      
    case "newForegroundTab":
      chrome.tabs.create({
          'url': url
      });
      break;
      
    case "newBackgroundTab":
      chrome.tabs.create({
          'url': url,
          'active': false
      });
      break;
      
    case "currentTab":
    default:
      chrome.tabs.update({
          'url': url
      });
  }
}

// Escape XML
function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}


// Omnibox text entered/updated 
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  const start = new Date()
  
  // queue of search terms
  const searchQueue = [];
  
  // Check for plain search before custom searches
  if (text.indexOf(":") !== 0) {
    const search = text.slice(0, text.indexOf(":") - 1 > 0 ? text.indexOf(":") - 1 : undefined)
    
    if (verbose) console.log('Plain Search: ' + search);
    searchQueue.push({
      type: 'plain',
      term: search.trim()
    })
  }
  
  // Check for meta search term
  if (text.indexOf(":meta") >= 0) {
    // meta search string
    const sliceStart = text.indexOf(":meta") + 6;
    const sliceEnd = text.indexOf(':', text.indexOf(":meta") + 1);
    const search = text.slice(sliceStart, sliceEnd === -1 ? undefined : sliceEnd) 
    
    if (verbose) console.log('Meta Search: ' + search);
    searchQueue.push({
      type: 'meta',
      term: search.trim()
    })
  }
  
  // Check for content search term
  if (text.indexOf(":content") >= 0) {
    // meta search string
    const sliceStart = text.indexOf(":content") + 9;
    const sliceEnd = text.indexOf(':', text.indexOf(":content") + 1);
    const search = text.slice(sliceStart, sliceEnd === -1 ? undefined : sliceEnd) 
    
    if (verbose) console.log('Content Search: ' + search);
    searchQueue.push({
      type: 'content',
      term: search.trim()
    })
  }
  
  
  if (verbose) console.log(searchQueue);
  
  // Update default search tooltip
  let status = 'Searching '
  searchQueue.forEach((search) => {
    status += '<url>' + search.type + ':</url> ' + '\'<match>' + search.term + '</match>\' '
  })
  chrome.omnibox.setDefaultSuggestion({description:status});
  
  
  // Run searches
  if (searchQueue[0]) runSearch(searchQueue[0].type, searchQueue[0].term, [], (results) => {
    if (searchQueue[1]) runSearch(searchQueue[1].type, searchQueue[1].term, results, (results) => {
      if (searchQueue[2]) runSearch(searchQueue[2].type, searchQueue[2].term, results, (results) => {
        // return results into omnibox
        suggest(results);
      });
      else suggest(results);
    });
    else suggest(results);
  })
});

// Runs a search with the given term and type on the given current results
// If no current results, searches all bookmarks
// Runs a callback with parameter that is an array of suggestions {description, content}
function runSearch (type, term, currentResults, callback) {
  
  
  
  // If given some current results
  if (currentResults && currentResults.length > 0) {
    if (type === 'content') {
      
      currentResults = currentResults.filter((res) => {
        console.log(res.content);
        let found = false;
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            console.log(res.content, this.responseText.indexOf(term))
            if (this.responseText.indexOf(term) >= 0) found = true;
          }
        };
        xhttp.open("GET", res.content, true);
        xhttp.send();
        return found;
      })
      callback(currentResults);
    }
    
  }
  
  // Plain should only appear as first term, though first term will not always be plain
  else {
    if (type === 'plain') {
      chrome.bookmarks.search(term, (results) => {
        results = results.filter((res) => {
          return !!res.url;
        }).map((res) => {
          let desc = escapeXml(res.title);
          //console.log(res);
          return {content: res.url, description: desc};
        })
        callback(results);
      })
    }
  }
}

// Option selected
chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  
  nav(text, disposition);
  
})


