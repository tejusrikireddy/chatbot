function addMessage(text, sender) {
    const chatBox = document.getElementById("chat-box");
    const div = document.createElement("div");
    div.className = sender;
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendUserInput() {
    const input = document.getElementById("user-input");
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, "user");
    input.value = "";

    fetch("/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({message: msg})
    })
    .then(res => res.json())
    .then(data => {
        addMessage(data.reply, "bot");
        speak(data.reply);
    });
}

function handleEnter(event) {
    if (event.key === "Enter") {
        sendUserInput();
    }
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
