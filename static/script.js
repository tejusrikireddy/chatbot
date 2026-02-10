function addMessage(text, sender) {
    const chatBox = document.getElementById("chat-box");
    const div = document.createElement("div");

    div.className = sender === "user" ? "user user-pop" : "bot-message bot-pop";
    div.innerText = text;

    chatBox.appendChild(div);
    smoothScrollToBottom();
    autoFocusInput();
}

function sendUserInput() {
    const input = document.getElementById("user-input");
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, "user");
    input.value = "";

    // 👇 SHOW TYPING DOTS
    showTypingIndicator();

    fetch("/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ message: msg })
    })
    .then(res => res.json())
    .then(data => {
        // 👇 Delay so typing dots are visible
        setTimeout(() => {
            removeTypingIndicator();
            typeBotMessage(data.reply);
            speak(data.reply);
        }, 500);
    });
}

function typeBotMessage(text) {
    const chatBox = document.getElementById("chat-box");
    const botDiv = document.createElement("div");

    botDiv.className = "bot-message bot-pop";
    chatBox.appendChild(botDiv);

    let index = 0;

    const typingInterval = setInterval(() => {
        if (index < text.length) {
            botDiv.innerHTML += text.charAt(index);
            index++;
            smoothScrollToBottom();
        } else {
            clearInterval(typingInterval);
            autoFocusInput();
        }
    }, 30); // typing speed
}

function showTypingIndicator() {
    const chatBox = document.getElementById("chat-box");

    const typing = document.createElement("div");
    typing.id = "typing-indicator";
    typing.className = "typing";
    typing.innerHTML = "🤖 Bot is typing<span>.</span><span>.</span><span>.</span>";

    chatBox.appendChild(typing);
    smoothScrollToBottom();
}

function removeTypingIndicator() {
    const typing = document.getElementById("typing-indicator");
    if (typing) typing.remove();
}

function smoothScrollToBottom() {
    const chatBox = document.getElementById("chat-box");
    chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth"
    });
}

function autoFocusInput() {
    const input = document.getElementById("user-input");
    input.focus();
}

function startVoice() {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = function(event) {
        document.getElementById("user-input").value =
            event.results[0][0].transcript;
        sendUserInput();
    };
    recognition.start();
}

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
}

// 👇 ENTER KEY SUPPORT
document.getElementById("user-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        sendUserInput();
    }
});

// 👇 BOT GREETING ON PAGE LOAD
window.onload = function () {
    setTimeout(() => {
        typeBotMessage("Hi 👋 How can I help you?");
    }, 400);
};



