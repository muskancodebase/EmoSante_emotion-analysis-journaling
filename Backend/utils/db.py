<<<<<<< HEAD
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    with app.app_context():
        from models.models import User, JournalEntry
        db.create_all()
        print("📌 Database initialized successfully!")
=======
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db():
    # Import models so SQLAlchemy is aware of them before creating tables.
    from models.models import User, ResetToken, JournalEntry

    # Development-time reset: drop all tables then recreate them to ensure
    # the SQLite schema matches the current models.
    db.drop_all()
    db.create_all()
>>>>>>> 7a2e35221d0f276e0a91014c905b43ddbc96f46b
