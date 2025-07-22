# Last Active Tab Switcher
This Chrome Extension lets you quickly switch back to the **previously active tab** in your chrome (It's not currently supported origianlly, so I made this).

---

## Features

- Switch to your **favorite tab** if set — otherwise switch to your **last active tab**
- Mark/unmark any tab as your **favorite** (via right-click, popup, or shortcut)
- Favorite tab is shown with a ★ badge on the extension icon
- Customizable keyboard shortcuts
- Works in the **current Chrome window only**

## How to Install

1. **Download or clone** this repo.  
2. Open Chrome and go to `chrome://extensions`.  
3. Enable **Developer Mode**.  
4. Click **Load unpacked**.  
5. Select the folder containing the extension files.

## Shortcuts

To change the default shortcut:  
- Visit `chrome://extensions/shortcuts`  
- Find **Last Active Tab Switcher**  
- Set your preferred shortcuts (default: `Command+Z` for switching, `Command+Shift+Z` for favorite)

## ⚡️ How to Use

* Switch Tab:

  * Use your shortcut (e.g., `Command+Z`) or click the extension icon —
  * If a favorite tab is set and you’re not on it, you’ll switch to it.
  * If you’re already on the favorite, you’ll switch to your last active tab.
  * If no favorite is set, it switches to your last active tab.

* Mark/Unmark Favorite:

  * Right-click on a page and select **Mark/Unmark as Favorite**
  * Or click the **Mark/Unmark Favorite** button in the popup
  * Or use the shortcut (e.g., `Command+Shift+Z`)

---

## ⭐️ Notes

* The extension shows a ★ badge when you have a favorite tab saved.
* The extension works **per window** — the last active tab is tracked within the same Chrome window.
