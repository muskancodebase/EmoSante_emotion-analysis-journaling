from flask import Blueprint, request, jsonify
from utils.db import db
from models.models import User, ResetToken
from datetime import datetime, timedelta
import secrets
import smtplib
from email.mime.text import MIMEText

from config import MAIL_USERNAME, MAIL_PASSWORD, FRONTEND_URL

reset_bp = Blueprint("reset", __name__)


def _send_reset_email(to_email: str, token: str) -> bool:
    """Send a password reset email via Gmail.

    Returns True if the email was sent successfully, otherwise False.
    In failure cases, the token is still printed to the backend logs so
    developers can recover it during local development.
    """
    if not MAIL_USERNAME or not MAIL_PASSWORD:
        print("MAIL_USERNAME/MAIL_PASSWORD not configured; cannot send reset email.")
        print(f"Reset token for {to_email}: {token}")
        return False

    reset_link = None
    if FRONTEND_URL:
        # Include a deep link-style URL that could be wired up in the mobile app.
        reset_link = f"{FRONTEND_URL}?resetToken={token}"

    lines = [
        "We received a request to reset your ÉmoSanté password.",
        "If you did not request this, you can ignore this email.",
        "",
        f"Your reset token is: {token}",
    ]
    if reset_link:
        lines.extend([
            "",
            "On a device with the ÉmoSanté app installed, you can also try this link:",
            reset_link,
        ])

    body = "\n".join(lines)

    msg = MIMEText(body)
    msg["Subject"] = "ÉmoSanté password reset"
    msg["From"] = MAIL_USERNAME
    msg["To"] = to_email

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(MAIL_USERNAME, MAIL_PASSWORD)
            server.send_message(msg)
        print(f"Password reset email sent to {to_email}")
        return True
    except Exception as exc:  # pragma: no cover - hard to unit test SMTP failures
        print("Failed to send password reset email:", exc)
        print(f"Reset token for {to_email}: {token}")
        return False


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

    # Attempt to send the reset email; fall back to console logging in development.
    email_sent = _send_reset_email(user.email, token)

    if email_sent:
        return jsonify({"message": "Reset link sent to your email."}), 200

    # Fallback message when email fails; token is still printed to the backend logs.
    return jsonify({"message": "Reset link generated. Check backend console."}), 200


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
