from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.models import User
from utils.db import db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    user = User(username=data["username"], password=data["password"])
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully!"})

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"]).first()
    if user and user.password == data["password"]:
        token = create_access_token(identity=user.id)
        return jsonify(access_token=token)
    return jsonify({"error": "Invalid credentials"}), 401
