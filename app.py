from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

# Load knowledge safely
with open("data.json", "r", encoding="utf-8") as f:
    KNOWLEDGE = json.load(f)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").lower()

    if not user_message:
        return jsonify({"reply": "Please type something 😊"})

    # Simple response logic
    if "hi" in user_message or "hello" in user_message:
        reply = "Hello 👋 How can I help you today?"
    elif "course" in user_message:
        reply = "We offer AI, ML, Python, and Web Development courses."
    elif "contact" in user_message:
        reply = "You can contact us at edutech@gmail.com 📧"
    else:
        reply = "Sorry 🤖 I didn’t understand that. Can you rephrase?"

    return jsonify({"reply": reply})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)



