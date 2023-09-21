chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    "id": "openChatWidget",
    "title": "デンシバくんに質問する",
    "contexts": ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "openChatWidget") {
    const selectedText = info.selectionText;
    question = `${selectedText}について教えて！`;
    chrome.tabs.sendMessage(tab.id, { action: "ask_question", question: question });
  }
  if (info.menuItemId === "dynamicContextMenu") {
    const question = `${currentSelectedText}について教えて！`;
    chrome.tabs.sendMessage(tab.id, { action: "ask_question", question });
  }
});

let currentSelectedText = "";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "text_selected") {
    currentSelectedText = message.selectedText;
    const truncatedText = currentSelectedText.length > 21 ? currentSelectedText.substring(0, 20) + '...' : currentSelectedText;
    
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        "id": "dynamicContextMenu",
        "title": `${truncatedText}について質問する`,
        "contexts": ["selection"]
      });
    });
  }
});

