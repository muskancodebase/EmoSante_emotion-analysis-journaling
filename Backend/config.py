import os
from dotenv import load_dotenv

load_dotenv()

# Ensure instance folder exists
os.makedirs("instance", exist_ok=True)

class Config:
    # ---------------------
    # DATABASE CONFIG
    # ---------------------
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///instance/emosante.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ---------------------
    # SECRET KEY
    # ---------------------
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")

    # ---------------------
    # EMAIL (Gmail SMTP)
    # ---------------------
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

    MAIL_DEFAULT_SENDER = (
        "EmoSante",
        MAIL_USERNAME
    )

    # ---------------------
    # FRONTEND (Expo URL)
    # ---------------------
    FRONTEND_URL = os.getenv(
        "FRONTEND_URL",
        "exp://192.168.0.103:8081"   # default fallback
    )
