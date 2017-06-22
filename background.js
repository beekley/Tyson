// Omnibox event handling and functionality

// Return to default 

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

// Omnibox text entered/updated 
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  const start = new Date()
  
  // queue of search terms
  const searchQueue = [];
  
  /*if (text.indexOf(":content") === 0) {
    console.log('Content Search');
    chrome.omnibox.setDefaultSuggestion({description:'Searching through <match>page contents</match>'});
  }*/
  
  // Check for content search term
  if (text.indexOf(":content") >= 0) {
    // meta search string
    const sliceStart = text.indexOf(":content") + 9;
    const sliceEnd = text.indexOf(':', text.indexOf(":content") + 1);
    const search = text.slice(sliceStart, sliceEnd === -1 ? undefined : sliceEnd) 
    //console.log(sliceStart, sliceEnd === -1 ? undefined : sliceEnd)
    
    console.log('Content Search: ' + search);
    searchQueue.push({
      type: 'content',
      term: search.trim()
    })
  }
  
  // Check for meta search term
  if (text.indexOf(":meta") >= 0) {
    // meta search string
    const sliceStart = text.indexOf(":meta") + 6;
    const sliceEnd = text.indexOf(':', text.indexOf(":meta") + 1);
    const search = text.slice(sliceStart, sliceEnd === -1 ? undefined : sliceEnd) 
    //console.log(sliceStart, sliceEnd === -1 ? undefined : sliceEnd)
    
    console.log('Meta Search: ' + search);
    searchQueue.push({
      type: 'meta',
      term: search.trim()
    })
    
    //chrome.omnibox.setDefaultSuggestion({description:'Searching through <match>page metadata</match> <dim>(Not all pages may have metadata)</dim>'});
    
    // Create array of 
    
  }
  
  // Check for plain search before custom searches
  if (text.indexOf(":") !== 0) {
    const search = text.slice(0, text.indexOf(":") - 1 > 0 ? text.indexOf(":") - 1 : undefined)
    
    console.log('Plain Search: ' + search);
    searchQueue.push({
      type: 'plain',
      term: search.trim()
    })
    
//    // Plain search bookmarks
//    chrome.bookmarks.search(text, (results) => {
//      
//      // Get search results
//      const stars = results
//        .filter(result => {
//          return !!result.url
//        })
//        .map(result => {
//          return {
//            content: result.url,
//            description: 'test'
//          }
//        });
//      
//      // Default to first result
//      chrome.omnibox.setDefaultSuggestion({description:"Searching by <match>bookmark</match>"});
//      
//      // Shift stars since we suggested the first one
//      suggest(stars);
//
//      const end = new Date();
//      console.log("Time to print results:", (end - start));
//    })
  }
  
  console.log(searchQueue);
  
  // Update default search
  let status = 'Searching '
  searchQueue.forEach((search) => {
    status += '<url>' + search.type + ':</url> ' + '\'<match>' + search.term + '</match>\' '
  })
  chrome.omnibox.setDefaultSuggestion({description:status});
});

// Option selected
chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  
  //nav(text, disposition);
  
})
