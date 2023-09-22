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

const getArticleKeywords = async (articleId) => {
  try {
      const response = await fetch(`https://us-central1-nk-intern.cloudfunctions.net/llama2-api?kiji_id=${articleId}`);
      let data = await response.json();
      let words = [...data.topics, ...data.keywords];
      return words
  } catch (error) {
      console.error("Error fetching button texts:", error);
  }
};


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('https://www.nikkei.com/article/')) {
    const articleIdMatch = tab.url.match(/www.nikkei.com\/article\/(.+)\//);
    if (articleIdMatch && articleIdMatch[1]) {
      const articleId = articleIdMatch[1];
      getArticleKeywords(articleId).then(articleKeywords => {
        chrome.tabs.sendMessage(tabId, { action: "send_keywords", data: articleKeywords });
      });
    }
  }
});
