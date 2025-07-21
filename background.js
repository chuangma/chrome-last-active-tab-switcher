let lastTabId = null;
let currentTabId = null;

chrome.tabs.onActivated.addListener(activeInfo => {
  if (currentTabId !== null && activeInfo.tabId !== currentTabId) {
    lastTabId = currentTabId;
  }
  currentTabId = activeInfo.tabId;
});

chrome.action.onClicked.addListener(() => {
  if (lastTabId !== null) {
    chrome.tabs.update(lastTabId, { active: true });
  }
});

chrome.commands.onCommand.addListener(command => {
  if (command === "_execute_action" && lastTabId !== null) {
    chrome.tabs.update(lastTabId, { active: true });
  }
});