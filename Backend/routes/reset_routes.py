from flask import Blueprint, request, jsonify
from models.models import db, User
from werkzeug.security import generate_password_hash
from utils.email_helper import send_otp_email, send_password_changed_confirmation
from datetime import datetime, timedelta
import secrets
import logging
import random

reset_bp = Blueprint('reset', __name__)

# Utility — Generate 6-digit OTP
def generate_otp():
    return f"{random.randint(0, 999999):06d}"

# ------------------------------------------------------------
# 1️⃣  FORGOT PASSWORD — Send OTP to Gmail
# ------------------------------------------------------------
@reset_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.json or {}
        email = data.get('email', '').strip().lower()

        if not email:
            return jsonify({"message": "Email is required"}), 400

        if not email.endswith('@gmail.com'):
            return jsonify({"message": "Please use a valid Gmail address"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"message": "No account exists with this email"}), 404

        otp_code = generate_otp()
        expiry_time = datetime.utcnow() + timedelta(minutes=10)

        user.reset_token = otp_code
        user.reset_token_expiry = expiry_time
        db.session.commit()

        sent = send_otp_email(
            user.email,
            user.name or user.email.split('@')[0],
            otp_code
        )

        if sent:
            logging.info(f"OTP sent to {email}")
            return jsonify({"message": "Reset code sent"}), 200
        else:
            user.reset_token = None
            user.reset_token_expiry = None
            db.session.commit()
            return jsonify({"message": "Failed to send code"}), 500

    except Exception as e:
        logging.error(f"forgot_password error: {e}")
        db.session.rollback()
        return jsonify({"message": "An error occurred"}), 500


# ------------------------------------------------------------
# 2️⃣ VERIFY OTP
# ------------------------------------------------------------
@reset_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
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
            user.reset_token = None
            user.reset_token_expiry = None
            db.session.commit()
            return jsonify({"verified": False, "message": "OTP expired"}), 400

        if user.reset_token != otp:
            return jsonify({"verified": False, "message": "Invalid OTP"}), 400

        # OTP is correct → generate one-time reset token
        one_time_token = secrets.token_urlsafe(32)
        expiry = datetime.utcnow() + timedelta(minutes=15)

        user.reset_token = one_time_token
        user.reset_token_expiry = expiry
        db.session.commit()

        return jsonify({
            "verified": True,
            "reset_token": one_time_token
        }), 200

    except Exception as e:
        logging.error(f"verify_otp error: {e}")
        return jsonify({"verified": False, "message": "Error occurred"}), 500


# ------------------------------------------------------------
# 3️⃣ CONFIRM PASSWORD (Reset password using token)
# ------------------------------------------------------------
@reset_bp.route('/confirm', methods=['POST'])
def confirm_password():
    try:
        data = request.json or {}
        
        # Accept token from request
        token = data.get('token', '').strip()
        new_password = data.get('password', '')

        if not token:
            return jsonify({"message": "Token required"}), 400

        if not new_password:
            return jsonify({"message": "Password required"}), 400

        if len(new_password) < 6:
            return jsonify({"message": "Password must be at least 6 characters"}), 400

        # Find user by token
        user = User.query.filter_by(reset_token=token).first()

        if not user:
            return jsonify({"message": "Invalid reset token"}), 404

        # Check token expiry
        if user.reset_token_expiry < datetime.utcnow():
            user.reset_token = None
            user.reset_token_expiry = None
            db.session.commit()
            return jsonify({"message": "Token expired. Request new OTP"}), 400

        # Update password
        user.set_password(new_password)
        user.reset_token = None
        user.reset_token_expiry = None
        db.session.commit()

        send_password_changed_confirmation(user.email, user.name or user.email.split('@')[0])

        logging.info(f"Password reset successful for {user.email}")
        return jsonify({"message": "Password reset successful"}), 200

    except Exception as e:
        logging.error(f"confirm_password error: {e}")
        db.session.rollback()
        return jsonify({"message": "An error occurred"}), 500