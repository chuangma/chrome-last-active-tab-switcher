function markFavorite() {
  if (!document.title.startsWith("★")) {
    document.title = "★ " + document.title;
  }
}

function unmarkFavorite() {
  if (document.title.startsWith("★")) {
    document.title = document.title.replace(/^★\s*/, "");
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  try {
    if (msg.action === "mark-favorite") {
      markFavorite();
      sendResponse({ success: true });
    }

    if (msg.action === "unmark-favorite") {
      unmarkFavorite();
      sendResponse({ success: true });
    }
  } catch (e) {
    console.error("Error in content script:", e);
    sendResponse({ success: false, error: e.message });
  }

  // Return false because you're not using async response
  return false;
});