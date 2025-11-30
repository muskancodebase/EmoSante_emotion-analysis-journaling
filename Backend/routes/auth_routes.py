from flask import Blueprint, request, jsonify
from utils.db import db
from models.models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint("auth", __name__)

# -------------------------
# UC-01: SIGNUP (REGISTER)
# -------------------------
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"message": "Name, email and password required"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": "User already exists"}), 409

    new_user = User(name=name, email=email)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Signup successful"}), 201

# -------------------------
# UC-01: LOGIN
# -------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"message": "Incorrect email or password"}), 401

    # Use string identity to avoid "Subject must be a string" 422 errors with newer PyJWT.
    token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        },
    }), 200


# -------------------------
# UC-02: LOGOUT
# (Frontend just deletes token)
# -------------------------
@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    return jsonify({"message": "Logout successful"}), 200


# -------------------------
# UC-02: DELETE ACCOUNT
# -------------------------


@auth_bp.route("/delete-account", methods=["DELETE"])
@jwt_required()
def delete_account():
    try:
        user_id = int(get_jwt_identity())  # 👈 FIX

        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "Account deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print("Delete error:", e)
        return jsonify({"message": "Error deleting account"}), 500