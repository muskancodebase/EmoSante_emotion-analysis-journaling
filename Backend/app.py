import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from utils.db import db, init_db
from flask_migrate import Migrate
from routes.reset_routes import reset_bp  
from utils.email_helper import mail  
from config import Config
import logging
from dotenv import load_dotenv
load_dotenv()
print("DEBUG FRONTEND_URL =", os.getenv("FRONTEND_URL"))

# Import routes
from routes.auth_routes import auth_bp
from routes.emotion_routes import emotion_bp
from routes.reset_routes import reset_bp
from routes.journal_routes import journal_bp
from routes.report_routes import report_bp

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Create Flask app
app = Flask(__name__)
CORS(app)

# Configurations
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///emosante.db"
app.config["JWT_SECRET_KEY"] = "super-secret-key"
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
app.config['FRONTEND_URL'] = os.getenv("FRONTEND_URL") 

app.config['MAIL_DEFAULT_SENDER'] = ('EmoSante', os.getenv('MAIL_USERNAME'))
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)
mail.init_app(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(emotion_bp, url_prefix="/analyze")
app.register_blueprint(journal_bp, url_prefix="/journal")
app.register_blueprint(reset_bp, url_prefix='/reset')  
app.register_blueprint(report_bp, url_prefix='/report')

@app.route("/")
def home():
    return jsonify({"message": "ÉmoSanté Backend Running ✅"})

if __name__ == "__main__":
    init_db(app)
    app.run(host="0.0.0.0", port=5000, debug=True)
