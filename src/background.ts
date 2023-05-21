chrome.browserAction.onClicked.addListener((tab: chrome.tabs.Tab) => {
    chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
});
