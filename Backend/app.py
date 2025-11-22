from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from utils.db import db, init_db

# Create Flask app
app = Flask(__name__)
CORS(app)

# Configurations
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///emosante.db"
app.config["JWT_SECRET_KEY"] = "super-secret-key"

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

# Import routes
from routes.auth_routes import auth_bp
from routes.emotion_routes import emotion_bp
from routes.reset_routes import reset_bp
from routes.journal_routes import journal_bp

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(emotion_bp, url_prefix="/analyze")
app.register_blueprint(reset_bp, url_prefix="/reset")
app.register_blueprint(journal_bp, url_prefix="/journal")

@app.route("/")
def home():
    return jsonify({"message": "ÉmoSanté Backend Running ✅"})

if __name__ == "__main__":
    with app.app_context():
        init_db()
    # Bind to all interfaces so mobile devices/emulators can reach the API on your LAN IP.
    app.run(host="0.0.0.0", port=5000, debug=True)
