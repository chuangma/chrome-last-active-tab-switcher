// Promisified storage helpers
const storage = {
  get: (keys) =>
    new Promise((resolve) => chrome.storage.local.get(keys, (result) => resolve(result))),
  set: (obj) =>
    new Promise((resolve) => chrome.storage.local.set(obj, resolve)),
  remove: (keys) =>
    new Promise((resolve) => chrome.storage.local.remove(keys, resolve)),
};

// On extension start, store current active tab
chrome.runtime.onStartup.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    if (tabs[0]) {
      await storage.set({ currentTabId: tabs[0].id });
    }
  });
});

// Switch when click on extension icon
chrome.action.onClicked.addListener(() => {
  switchTab();
});

// Tab activation listener
chrome.tabs.onActivated.addListener(async (info) => {
  const { currentTabId } = await storage.get(["currentTabId"]);

  if (currentTabId && info.tabId !== currentTabId) {
    await storage.set({ lastTabId: currentTabId });
  }
  await storage.set({ currentTabId: info.tabId });
});

// Tab removal listener
chrome.tabs.onRemoved.addListener(async (tabId) => {
  const { favoriteTabId, lastTabId } = await storage.get(["favoriteTabId", "lastTabId"]);

  if (tabId === favoriteTabId) {
    await storage.remove("favoriteTabId");
    console.log("Favorite tab closed, removed from storage.");
  }

  if (tabId === lastTabId) {
    await storage.remove("lastTabId");
    console.log("Last tab closed, removed from storage.");
  }
});

// Handle commands and messages
chrome.commands.onCommand.addListener((cmd) => {
  if (cmd === "switch-tab") switchTab();
  if (cmd === "toggle-favorite") toggleFavorite();
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "switch-tab") switchTab();
  if (msg.action === "toggle-favorite") toggleFavorite();
});

// Switch to favorite or last tab
async function switchTab() {
  const { favoriteTabId, currentTabId, lastTabId } = await storage.get(["favoriteTabId", "currentTabId", "lastTabId" ]);

  const trySwitch = async (tabId, label) => {
    if (!tabId || tabId === currentTabId) return false;
    try {
      await chrome.tabs.get(tabId); // check if exists
      await chrome.tabs.update(tabId, { active: true });
      return true;
    } catch {
      console.warn(`${label} tabId ${tabId} no longer exists. Removing.`);
      await storage.remove(label === "favorite" ? "favoriteTabId" : "lastTabId");
      return false;
    }
  };

  if (await trySwitch(favoriteTabId, "favorite")) return;
  if (await trySwitch(lastTabId, "last")) return;

  console.log("No valid tab to switch to.");
}

// Toggle favorite tab
async function toggleFavorite() {
  const { favoriteTabId, currentTabId } = await storage.get(["favoriteTabId", "currentTabId"]);

  // If the current tab is already the favorite, unmark and remove it
  if (favoriteTabId === currentTabId) {
    try {
      await sendMessageToTab(currentTabId, { action: "unmark-favorite" });
    } catch {
      console.warn("Favorite tab no longer exists.");
    }
    await storage.remove("favoriteTabId");
    return;
  }

  // Try to unmark the previous favorite if it's different
  if (favoriteTabId && favoriteTabId !== currentTabId) {
    try {
      await sendMessageToTab(favoriteTabId, { action: "unmark-favorite" });
    } catch {
      console.warn("Previous favorite tab no longer exists. Cleaning up.");
      await storage.remove("favoriteTabId");
    }
  }

  // Mark current tab as new favorite
  await sendMessageToTab(currentTabId, { action: "mark-favorite" });
  await storage.set({ favoriteTabId: currentTabId });
}

// Send message to tab and handle errors
function sendMessageToTab(tabId, msg) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, msg, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(response);
      }
    });
  });
}

// Show toast in content script
function showToast(tabId, message) {
  chrome.scripting.executeScript({
    target: { tabId },
    func: (msg) => {
      const existing = document.getElementById("__toast_msg");
      if (existing) existing.remove();

      const toast = document.createElement("div");
      toast.id = "__toast_msg";
      toast.textContent = msg;
      toast.style.position = "fixed";
      toast.style.bottom = "20px";
      toast.style.left = "50%";
      toast.style.transform = "translateX(-50%)";
      toast.style.background = "#333";
      toast.style.color = "#fff";
      toast.style.padding = "10px 20px";
      toast.style.borderRadius = "6px";
      toast.style.zIndex = 99999;
      toast.style.fontSize = "14px";
      toast.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);
    },
    args: [message]
  });
}