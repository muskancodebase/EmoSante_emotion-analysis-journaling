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

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(emotion_bp, url_prefix="/analyze")

@app.route("/")
def home():
    return jsonify({"message": "ÉmoSanté Backend Running ✅"})

if __name__ == "__main__":
    with app.app_context():
        init_db()
    app.run(debug=True)
