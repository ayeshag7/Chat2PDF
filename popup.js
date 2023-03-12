// Rendering elements onto the popup window depending on the current web page
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];

  if (currentTab.url.includes("https://chat.openai.com/chat/")) {

    document.getElementById("generate-pdf-button").classList.remove("display-hidden");
    document.getElementById("generate-pdf-button").classList.add("display-button");

  } else {
    const other_webpage_message = document.getElementById("other-tab-message");
    other_webpage_message.classList.remove("display-hidden");
    other_webpage_message.classList.add("other-tab");
  }
});


const displayMessage = document.getElementById("message");
const generatePDFbutton = document.getElementById("generate-pdf-button");
const downloadPDFbutton = document.getElementById("download-pdf-button");


generatePDFbutton.addEventListener("click", () => {

  generatePDFbutton.classList.remove("display-button");
  generatePDFbutton.classList.add("display-hidden");

  
  displayMessage.classList.remove("display-hidden");
  displayMessage.classList.add("message");

  setTimeout(() => {
    displayMessage.innerText = "Generating PDF..."
  }
  ,1000)

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "generatePDF" }, (response) => {
      
      if (response && response.reply === "pdfGenerated") {

        setTimeout(() => {

          displayMessage.classList.remove("message");
          displayMessage.classList.add("display-hidden");

          downloadPDFbutton.classList.remove("display-hidden");
          downloadPDFbutton.classList.add("display-button");
        }, 2000)

      } else if (response && response.reply === "error") {

        setTimeout (() => {
          displayMessage.innerText = "Conversation wasn't loaded properly. Try again!"
        }, 1500);

      }
      
    });

  });

});


downloadPDFbutton.addEventListener("click", function () {

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "downloadPDF" });
  });

})
