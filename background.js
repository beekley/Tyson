//omnibox event handling and functionality

// background page
//const bkg = chrome.extension.getBackgroundPage();
//
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  const start = new Date()
  chrome.bookmarks.search(text, (results) => {
    const stars = results
      .filter(result => {
        return !!result.url
      })
      .map(result => {
        return {
          content: result.url,
          description: 'test'
        }
      });
    suggest(stars);
    //console.log(stars);
    
    const end = new Date();
    console.log("Time to print results:", (end - start));
  })
});

chrome.omnibox.onInputEntered.addListener((text) => {
  alert('inputEntered: ' + text);
})
