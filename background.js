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
    return tab.url.match(text) || tab.title.match(text);
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


