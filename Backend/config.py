import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database
    SQLALCHEMY_DATABASE_URI = 'sqlite:///instance/emosante.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Secret Key
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    
    # 📧 EMAIL CONFIGURATION
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')  # Your Gmail
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')  # App Password
    MAIL_DEFAULT_SENDER = ('EmoSante', os.getenv('MAIL_USERNAME'))
    
    # App URL (for reset links)
    FRONTEND_URL = 'exp://192.168.0.101:8081'  # Expo URL