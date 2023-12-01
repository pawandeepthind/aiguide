function askQuestion() {
    var question = document.getElementById("question");
    if (question.value === "") {
        return;
    }
    appendQuestion(question.value);
    var wikiLink = getWikiLink();
    var context = getContext();
    console.log("WikiLink:" + wikiLink);
    console.log("Context:", context)
    askQuestionToGuide(question.value, wikiLink, context);
}
function askQuestionToGuide(question, wikiLink, context) {
    const apiKey = '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'; // Replace with your actual API key
    const endpoint = 'https://api.openai.com/v1/chat/completions'; // API endpoint
    const requestData = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: "system", content: 'You are AI guide in Addison Gallery of American Art and you have to answer question based on below content. Be very courtious and helpful.' },
            { role: "assistant", content: "You can use this context: " + context },
            { role: "assistant", content: "You can use this is Wiki page for additional context: " + wikiLink },
            { role: "user", content: question }
        ],
        max_tokens: 100,
        n: 1,
        temperature: 0.2,
    };
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestData),
    })
        .then((response) => response.json())
        .then((data) => {
            receivedResponse(data.choices[0].message.content)
        })
        .catch((error) => {
            receivedResponse(error)
        });
}
function receivedResponse(response) {
    question.value = "";
    appendReply(response);
}
function appendQuestion(question) {
    var chatMessages = document.getElementById("chatmessages");
    var messageElement = document.createElement("div");
    messageElement.classList.add("chatmessage");
    messageElement.classList.add("you");
    messageElement.textContent = `${question}: You`;
    chatMessages.appendChild(messageElement);
}
function appendReply(reply) {
    var chatMessages = document.getElementById("chatmessages");
    var messageElement = document.createElement("div");
    messageElement.classList.add("chatmessage");
    messageElement.classList.add("guide");
    messageElement.textContent = `Guide: ${reply}`;
    chatMessages.appendChild(messageElement);
}
function getWikiLink() {
    var title = document.getElementById("title").textContent;
    var wikiLink = ''
    if (title === 'Mayflower') {
        wikiLink = "https://en.wikipedia.org/wiki/Mayflower";
    } else if (title === 'Clermont') {
        wikiLink = "https://en.wikipedia.org/wiki/North_River_Steamboat";
    } else {
        wikiLink = 'https://en.wikipedia.org/wiki/Dreadnought';
    }
    return wikiLink;
}
function getContext() {
    var pTags = document.getElementsByClassName("content");
    var context = '';
    for (var i = 0; i < pTags.length; i++) {
        context = context + pTags.item(i).textContent;
    }
    return context;
}