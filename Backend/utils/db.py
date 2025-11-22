from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db():
    # Import models so SQLAlchemy is aware of them before creating tables.
    from models.models import User, ResetToken, JournalEntry

    # Development-time reset: drop all tables then recreate them to ensure
    # the SQLite schema matches the current models.
    db.drop_all()
    db.create_all()
