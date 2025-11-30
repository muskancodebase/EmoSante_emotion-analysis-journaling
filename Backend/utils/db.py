from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    with app.app_context():
        from models.models import User, JournalEntry
        db.create_all()
        print("📌 Database initialized successfully!")
