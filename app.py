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
    subject = data.get("subject", "")
    message = data.get("message", "").lower()

    reply = "Sorry, I don't know that yet."

    if subject in KNOWLEDGE:
        for key, value in KNOWLEDGE[subject].items():
            if key in message:
                reply = value
                break

    return jsonify({"reply": reply})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)


