import os
from dotenv import load_dotenv

# Load environment variables from Backend/backend.env
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, "backend.env")

# Load once when this module is imported.
if os.path.exists(ENV_PATH):
    load_dotenv(ENV_PATH)

MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
FRONTEND_URL = os.getenv("FRONTEND_URL", "exp://localhost:8081")