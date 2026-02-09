from flask import Flask, render_template, request, jsonify
import json
import difflib

app = Flask(__name__)

# Load Q&A data
with open("data.json", "r") as f:
    DATA = json.load(f)

def find_best_answer(user_question):
    user_question = user_question.lower()

    best_match = None
    best_score = 0

    for subject in DATA:
        for qa in DATA[subject]["qa"]:
            score = difflib.SequenceMatcher(
                None, user_question, qa["question"].lower()
            ).ratio()

            if score > best_score:
                best_score = score
                best_match = qa["answer"]

    if best_score > 0.4:
        return best_match
    return "Sorry, I don't know that yet."

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_msg = request.json["message"]
    reply = find_best_answer(user_msg)
    return jsonify({"reply": reply})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)




