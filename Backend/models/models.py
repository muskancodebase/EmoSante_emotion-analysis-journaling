from utils.db import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy.sql import func

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    # One-to-many relationship: a user can have many journal entries.
    entries = db.relationship('JournalEntry', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class ResetToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    token = db.Column(db.String(100), unique=True, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)


class JournalEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.Text, nullable=False)
    emotion = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    def to_dict(self):
        """Shape data for the mobile UI (matches JournalContext expectations)."""
        # Preview: first ~180 characters of the content.
        preview = (self.content or "")[:180]

        # Date label formatted like "Nov 16 · 9:30 PM".
        created = self.created_at or datetime.utcnow()
        date_label = created.strftime('%b %d · %I:%M %p').lstrip('0')

        return {
            "id": str(self.id),
            "title": self.title,
            "content": self.content,
            "preview": preview,
            "dateLabel": date_label,
            "emotion": self.emotion or "Neutral",
        }
