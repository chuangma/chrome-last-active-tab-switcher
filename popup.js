document.getElementById("switchTab").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "switch-tab" });
  });
  
  document.getElementById("toggleFavorite").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "toggle-favorite" });
  });
  