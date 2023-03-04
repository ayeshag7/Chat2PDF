chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
      tab.url &&
      tab.url.includes("https://chat.openai.com/chat/") &&
      changeInfo.status === "complete"
    ) {
      chrome.tabs.sendMessage(tabId, {
        action: "extractData"
      }, 
      
      (response) => {
        if (chrome.runtime.lastError) {
            console.log("Message sent but couldn't establish connection!")
        } else {
            console.log(response);
        }
        
      });

    }

  });
  