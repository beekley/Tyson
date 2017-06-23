// Omnibox event handling and functionality

const verbose = false;
let tabs = [];

// Load tab data
chrome.omnibox.onInputStarted.addListener(() => {
  chrome.tabs.query({}, (Tabs) => {
    tabs = Tabs;
  });
});

// Omnibox text entered/updated 
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  
  const filteredTabs = tabs.filter((tab) => {
    const exp = new RegExp(text, 'i');
    if (verbose) console.log(exp);
    return tab.url.match(exp) || tab.title.match(exp);
  });

  suggest(filteredTabs.map((tab) => {
    return {content: tab.index.toString(), description: tab.title}
  }));

});


// Option selected
chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  
  // Check for tab
  let num = parseInt(text)
  if (isFinite(num)) {
    chrome.tabs.highlight({tabs: num});
  }
  
});


