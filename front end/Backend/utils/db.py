from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db():
    from models.models import User
    db.create_all()
