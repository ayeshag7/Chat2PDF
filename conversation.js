(() => {

    function extractQuestions () {
        // Getting all the divs on the page
        const divs = document.querySelectorAll("div");
    
        // Creating a new array
        const questionDivs = [];
    
        // Looping through the divs and retrieving only those that contain text nodes
        for (let i = 0; i < divs.length-3; i++) {
            const childNodes = divs[i].childNodes;
            let hasText = false;
        
            // Checking if any of the child nodes are text nodes
            for (let j = 0; j < childNodes.length; j++) {
                if (childNodes[j].nodeType === Node.TEXT_NODE) {
                hasText = true;
                break;
                }
            }
        
            // If the div contains a text node, pushing it into the 'questionDivs' array
            if (hasText) {
                questionDivs.push(divs[i].innerText)
            }
    
        };
    
        return questionDivs;
    
    }
    
    function extractAnswers () {
        
        // Selecting all the divs.
        const allDivs = document.querySelectorAll("div");
    
        // Creating a new array.
        const answerDivs = [];
    
        // Populating the newly created array with those divs whose first child is a paragraph 
        // element but which may or may not contain other elements as well.
        for (let i = 0; i < allDivs.length; i++) {
            if (allDivs[i].firstElementChild && allDivs[i].firstElementChild.tagName === "P") {
                answerDivs.push(allDivs[i]);
            }
        };
    
    
        // Formatting the answers and pushing them into the 'answers' array.
        const answers = [];
    
        for (let j=0; j<answerDivs.length; j++) {
            let childNodes = answerDivs[j].childNodes;
            let answer = "";
    
            for (let k=0; k<childNodes.length; k++) {
    
                if (childNodes[k].tagName === "P") {
                    answer += "P-Element" + " ";
                    answer += childNodes[k].innerText;
                    answer += "\\split-string-here\\";
                } else if (childNodes[k].tagName === "TABLE") {
                    answer += "TABLE-Element" + " ";
                    answer += childNodes[k].innerText;
                    answer += "\\split-string-here\\";
                } else if (childNodes[k].tagName === "UL") {
                    answer += "UNORDERED-LIST-Element" + " ";
                    answer += childNodes[k].innerText;
                    answer += "\\split-string-here\\";
                } else if (childNodes[k].tagName === "OL") {
                    answer += "ORDERED-LIST-Element" + " ";
                    answer += childNodes[k].innerText;
                    answer += "\\split-string-here\\";
                }
                else if (childNodes[k].tagName === "PRE") {
                    answer += "CODE-Element" + " ";
                    answer += childNodes[k].innerText;
                    answer += "\\split-string-here\\";
                }
    
            }
    
            answers.push(answer);
        }
    
        return answers;
    };
    
    function generatePDF(questions, answers, conversationTitle) {
    
        var docDefinition = {
            content: [],
    
            styles: {
                header: {
                    bold: true,
                    fontSize: 22,
                    decoration: "underline",
                    margin: [0, 0, 0, 32],
                    alignment: "center"
                },
                question: {
                    bold: true,
                    fontSize: 16,
                    lineHeight: 1.2,
                    margin: [0, 14, 0, 7]
                    },
                paragraph: {
                    fontSize: 14,
                    margin: [0, 7, 0, 7]
                },
                list: {
                    fontSize: 14,
                    margin: [0, 5, 0, 5]
                },
                code: {
                    fontSize: 14,
                    italics: true,
                    preformatted: true,
                    margin: [7, 7, 7, 7],
                    background: '#DFDFDF'
                }
            }
    
        }
    
        // Adding the document header
        docDefinition.content.push({text: conversationTitle, style: 'header'})
    
        // Ensuring that the 'questions' and 'answers' arrays are of the same length
        if (questions.length !== answers.length) {
            if (questions.length > answers.length) {
                questions.pop()
            } else {
                answers.pop()
            }
        }
    
        for (let i=0; i<questions.length; i++) {
    
    
            // Pushing the question onto the document
            docDefinition.content.push({ text: questions[i], style: 'question' });
    
            // Pushing the answer onto the document
            const answerElements = answers[i].split("\\split-string-here\\");
    
            for (let j=0; j<answerElements.length; j++) {
    
                const firstSpaceIndex = answerElements[j].indexOf(' ');
                const elementIdentifier = answerElements[j].substr(0, firstSpaceIndex);
                const elementContent = answerElements[j].substr(firstSpaceIndex + 1);
    
                if (elementIdentifier === "P-Element") {
    
                    docDefinition.content.push({ text: elementContent, style: 'paragraph' });
    
                } else if (elementIdentifier === "TABLE-Element") {
    
    
                    const tableNodes = elementContent.split('\n');
                    const tableBody = tableNodes.map(line => line.split('\t'));
    
                    tableBody[0] = tableBody[0].map(item => {
                        return {text: item, fontSize: 14, bold: true};
                        });
    
                    docDefinition.content.push({
                    table: {
                        headerRows: 1,
                        body: tableBody
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 1.5 : 1;
                        },
                        vLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 1.5 : 1;
                        },
                        hLineColor: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                        },
                        vLineColor: function (i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                        },
                        fillColor: function (i, node) {
                            return (i === 0) ? '#CCCCCC' : null;
                        },
                        paddingLeft: function(i, node) { return 7; },
                        paddingRight: function(i, node) { return 7; },
                        paddingTop: function(i, node) { return 7; },
                        paddingBottom: function(i, node) { return 7; }
                        }
                });
    
                } else if (elementIdentifier === "UNORDERED-LIST-Element") {
    
                    const listElements = elementContent.split("\n");
                
                    const formattedListElements = [];
                    for (let k=0; k<listElements.length; k++) {
                        if (listElements !== "") {
                            formattedListElements.push({text: listElements[k], style: 'list'})
                        }
                    }
    
                    docDefinition.content.push({
                        ul : formattedListElements
                    })
    
                } else if (elementIdentifier === "ORDERED-LIST-Element") {
                    
                    const listElements = elementContent.split("\n");
                    
    
                    const formattedListElements = [];
                    for (let l=0; l<listElements.length; l++) {
                        if (listElements[l] !== "") {
                            formattedListElements.push({text: listElements[l], style: 'list'})
                        }   
                    }
    
                    docDefinition.content.push({
                        ol : formattedListElements
                    })
    
                } else if (elementIdentifier === "CODE-Element") {
    
                    const formattedElementContent = elementContent.replace("Copy", "").replace("code", "")
                    
                    const firstSpaceIndex = formattedElementContent.indexOf(' ');
                    const language = formattedElementContent.substr(0, firstSpaceIndex);
                    const code = formattedElementContent.substr(firstSpaceIndex + 2);
                    
                    docDefinition.content.push({text: " " + language, fontSize: 12, color: '#DFDFDF', background: 
                    "black"})
                    docDefinition.content.push({ text: code, style: "code"});
    
                }
    
            }
        }
    
        // Generating the PDF document
        const pdfDoc = pdfMake.createPdf(docDefinition);

        return pdfDoc;
    };
    
    let questions;
    let answers;
    let title;
    let interval;
    let pdf;

    chrome.runtime.onMessage.addListener((message, sender, response) => {
        if (message.action === "extractData") {

            interval = setInterval(() => {

                answers = extractAnswers();

                if (answers.length !== 0) {
                    clearInterval(interval)

                    title = document.title;
                    
                    questions = extractQuestions();
                    questions = questions.slice(0, answers.length)

                }

            }, 500)            

            response({ message: "Data extracted successfully!" });
        }
    })
    
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "generatePDF") {

            if (answers && questions && answers.length === questions.length && answers.length > 0) {

                pdf = generatePDF(questions, answers, title);

                sendResponse({ reply: "pdfGenerated" });

              } else {

                sendResponse({ reply: "error", message: "Data was not extracted yet!" });

              }

        }
      });

      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "downloadPDF") {

            pdf.download(`${title}.pdf`)

        }

      });

}) ();
