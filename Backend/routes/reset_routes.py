from flask import Blueprint, request, jsonify
from utils.db import db
from models.models import User, ResetToken
from datetime import datetime, timedelta
import secrets

reset_bp = Blueprint("reset", __name__)

# ---------------------
# 1. REQUEST RESET TOKEN
# ---------------------
@reset_bp.route("/request", methods=["POST"])
def request_reset():
    data = request.json
    email = data.get("email")

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    token = secrets.token_urlsafe(32)
    expiry = datetime.utcnow() + timedelta(minutes=10)

    reset_token = ResetToken(user_id=user.id, token=token, expires_at=expiry)
    db.session.add(reset_token)
    db.session.commit()

    print("\n========================")
    print(" RESET LINK (copy this):")
    print(f"http://localhost:5000/reset/verify?token={token}")
    print("========================\n")

    return jsonify({"message": "Reset link generated. Check backend console."})
    

# ---------------------
# 2. RESET PASSWORD
# ---------------------
@reset_bp.route("/confirm", methods=["POST"])
def confirm_reset():
    data = request.json
    token = data.get("token")
    new_password = data.get("password")

    reset_token = ResetToken.query.filter_by(token=token).first()

    if not reset_token:
        return jsonify({"message": "Invalid token"}), 400

    if datetime.utcnow() > reset_token.expires_at:
        return jsonify({"message": "Token expired"}), 400

    user = User.query.get(reset_token.user_id)
    user.set_password(new_password)

    db.session.delete(reset_token)
    db.session.commit()

    return jsonify({"message": "Password updated successfully"})
