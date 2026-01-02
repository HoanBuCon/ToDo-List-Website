# BackEnd Entrypoint
from flask import Flask
from routes.auth import auth_bp
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
app.register_blueprint(auth_bp)

if __name__ == "__main__":
    app.run(port=5000, debug=True)