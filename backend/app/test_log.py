import os

from flask import Flask, send_from_directory, jsonify, request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "..", "..", "frontend")

app = Flask(__name__, static_folder=FRONTEND_DIR)

@app.route("/api/mmb", methods=["GET", "POST"])
def receive_text():
    if request.method == "GET":
        return jsonify({
            "message": "Hello from /api/mmb (GET)"
        })

    if request.method == "POST":
        data = request.get_json()
        text = data.get("text")
        email = data.get("email")
        password = data.get("password")

        print("📥 TEXT FROM FE:", text, email, password)

        return jsonify({
            "status": "ok",
            "received": text
        })

if __name__ == "__main__":
    app.run(port=5000)
