<<<<<<< HEAD
import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from utils.db import db, init_db
from flask_migrate import Migrate
from routes.reset_routes import reset_bp  # 🆕 NEW IMPORT
from utils.email_helper import mail  # 🆕 NEW IMPORT
from config import Config
import logging
from dotenv import load_dotenv
load_dotenv()
print("DEBUG FRONTEND_URL =", os.getenv("FRONTEND_URL"))



# Import routes
from routes.auth_routes import auth_bp
from routes.emotion_routes import emotion_bp
from routes.journal_routes import journal_bp

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



@app.route("/")
def home():
    return jsonify({"message": "ÉmoSanté Backend Running ✅"})

if __name__ == "__main__":
    init_db(app)
    app.run(host="0.0.0.0", port=5000, debug=True)
=======
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
>>>>>>> 7a2e35221d0f276e0a91014c905b43ddbc96f46b
