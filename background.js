let lastTabId = null;
let currentTabId = null;

// Track tab activation
chrome.tabs.onActivated.addListener(info => {
  if (currentTabId && info.tabId !== currentTabId) lastTabId = currentTabId;
  currentTabId = info.tabId;
  updateBadge();
});

// Context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "toggleFavorite",
    title: "Mark/Unmark as Favorite",
    contexts: ["page"]
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(info => {
  if (info.menuItemId === "toggleFavorite") toggleFavorite(currentTabId);
});

// Handle popup buttons
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "switch-tab") switchTab();
  if (msg.action === "toggle-favorite") toggleFavorite(currentTabId);
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(cmd => {
  if (cmd === "switch-tab") switchTab();
  if (cmd === "toggle-favorite") toggleFavorite(currentTabId);
});

function switchTab() {
  chrome.storage.local.get("favoriteTabId", data => {
    const favoriteId = data.favoriteTabId;

    if (favoriteId && currentTabId !== favoriteId) {
      // Favorite tab is set and we are NOT on it => switch to favorite
      chrome.tabs.update(favoriteId, { active: true });
    } else if (lastTabId) {
      // If we are already on favorite, switch to last tab
      chrome.tabs.update(lastTabId, { active: true });
    } else {
      console.log("No last tab to switch to.");
    }
  });
}


function toggleFavorite(tabId) {
  chrome.storage.local.get("favoriteTabId", data => {
    if (data.favoriteTabId === tabId) {
      chrome.storage.local.remove("favoriteTabId", updateBadge);
    } else {
      chrome.storage.local.set({ favoriteTabId: tabId }, updateBadge);
    }
  });
}
function updateBadge() {
  chrome.storage.local.get("favoriteTabId", data => {
    chrome.action.setBadgeText({ text: data.favoriteTabId ? "★" : "" });
  });
}

