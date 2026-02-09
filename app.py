from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "data.json")

with open(DATA_FILE, "r", encoding="utf-8") as f:
    KNOWLEDGE = json.load(f)


def find_answer(subject, message):
    message = message.lower()

    if subject not in KNOWLEDGE:
        return "Sorry, I don't know this subject yet."

    for key, answer in KNOWLEDGE[subject].items():
        if key in message:
            return answer

    return "🤔 I don't understand yet. Try keywords like: " + ", ".join(KNOWLEDGE[subject].keys())

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    subject = data["subject"]
    message = data["message"]

    reply = find_answer(subject, message)
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True)