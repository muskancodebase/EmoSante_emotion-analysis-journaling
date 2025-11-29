<<<<<<< HEAD
from flask import Blueprint, request, jsonify
from models.models import db, User
from werkzeug.security import generate_password_hash
from utils.email_helper import send_otp_email, send_password_changed_confirmation
import secrets
from datetime import datetime, timedelta
import logging
import random 

reset_bp = Blueprint('reset', __name__)

def generate_otp():
    return f"{random.randint(0, 999999):06d}"



# -------forgot password-------

@reset_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """
    Client posts: { "email": "user@example.com" }
    Backend generates 6-digit OTP, stores it in user.reset_token and expiry, and emails OTP.
    """
    try:
        # Get email from request
        data = request.json or {}
        email = data.get('email', '').strip().lower()
        
        # Validate email
        if not email:
            return jsonify({"message": "Email is required"}), 400
        
        if not email.endswith('@gmail.com'):
            return jsonify({"message": "Please use a valid Gmail address"}), 400
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        # 🔒 SECURITY: Always return success message
        # Don't reveal if email exists or not (prevents email enumeration)
        if not user:
            return jsonify({"message": "No account exists with this email"}), 404

# Generate OTP and expiry (10 minutes)
        otp_code = generate_otp()
        expiry_time = datetime.utcnow() + timedelta(minutes=10)

        user.reset_token = otp_code
        user.reset_token_expiry = expiry_time
        db.session.commit()
        
         # send OTP email
        sent = send_otp_email(user.email, user.name or user.email.split('@')[0], otp_code)
        if sent:
            logging.info(f"Reset OTP sent to {email}")
            return jsonify({"message": "If that email exists, we've sent a reset code"}), 200
        else:
            # cleanup token if mail fails
            user.reset_token = None
            user.reset_token_expiry = None
            db.session.commit()
            logging.error(f"Failed to send OTP to {email}")
            return jsonify({"message": "Failed to send reset code"}), 500

    except Exception as e:
        logging.error(f"Error in forgot_password: {e}")
        db.session.rollback()
        return jsonify({"message": "An error occurred"}), 500
    

# -------verify OTP-------
@reset_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    """
    Client posts: { "email": "...", "otp": "123456" }
    Returns 200 + { verified: true } if valid; 400 if invalid/expired.
    """
    try:
        data = request.json or {}
        email = data.get('email', '').strip().lower()
        otp = data.get('otp', '').strip()

        if not email or not otp:
            return jsonify({"verified": False, "message": "Email and OTP required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not user.reset_token:
            return jsonify({"verified": False, "message": "Invalid OTP"}), 400

        if user.reset_token_expiry < datetime.utcnow():
            # clear expired
            user.reset_token = None
            user.reset_token_expiry = None
            db.session.commit()
            return jsonify({"verified": False, "message": "OTP expired"}), 400

        if user.reset_token != otp:
            return jsonify({"verified": False, "message": "Invalid OTP"}), 400

        # OTP OK — To allow safe reset, we will create a one-time reset_token (longer) and return it
        one_time_token = secrets.token_urlsafe(32)
        expiry = datetime.utcnow() + timedelta(minutes=15)
        user.reset_token = one_time_token
        user.reset_token_expiry = expiry
        db.session.commit()

        return jsonify({"verified": True, "reset_token": one_time_token}), 200

    except Exception as e:
        logging.error(f"Error in verify_otp: {e}")
        return jsonify({"verified": False, "message": "Error occurred"}), 500



# -------reset password-------

@reset_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """
    Client posts:
    { "token": "<one_time_token>", "password":"newPass123" }
    """
    try:
        data = request.json or {}
        token = data.get('token', '').strip()
        new_password = data.get('password', '')

        if not token or not new_password:
            return jsonify({"message": "Token and password required"}), 400
        if len(new_password) < 6:
            return jsonify({"message": "Password must be at least 6 characters"}), 400

        user = User.query.filter_by(reset_token=token).first()
        if not user:
            logging.warning("Invalid reset token used")
            return jsonify({"message": "Invalid or expired reset token"}), 400

        if user.reset_token_expiry < datetime.utcnow():
            user.reset_token = None
            user.reset_token_expiry = None
            db.session.commit()
            return jsonify({"message": "Reset token expired"}), 400

        # Update password and clear token
        user.set_password(new_password)

        user.reset_token = None
        user.reset_token_expiry = None
        db.session.commit()

        # optional: send confirmation email
        send_password_changed_confirmation(user.email, user.name or user.email.split('@')[0])

        logging.info(f"Password reset for {user.email}")
        return jsonify({"message": "Password reset successful"}), 200

    except Exception as e:
        logging.error(f"Error in reset_password: {e}")
        db.session.rollback()
        return jsonify({"message": "An error occurred"}), 500
=======
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
>>>>>>> 7a2e35221d0f276e0a91014c905b43ddbc96f46b
