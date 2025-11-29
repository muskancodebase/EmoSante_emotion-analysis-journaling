from flask_mail import Mail, Message
from flask import current_app
import logging

mail = Mail()

def send_otp_email(user_email, user_name, otp_code):
    """
    Send OTP email (6-digit) for password reset
    """
    try:
        msg = Message(
            subject="Your EmoSante Password Reset Code",
            recipients=[user_email],
            sender=current_app.config['MAIL_DEFAULT_SENDER']
        )

        msg.body = f"""
Hi {user_name},

We received a request to reset your password for your EmoSante account.

Your password reset code (OTP) is:

{otp_code}

This code is valid for 10 minutes.

If you didn't request this, you can ignore this email.

Thanks,
EmoSante Team
"""

        msg.html = f"""
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <h2 style="color:#6C63FF">Password Reset Code</h2>
    <p>Hi <strong>{user_name}</strong>,</p>
    <p>Your password reset code is:</p>
    <h1 style="letter-spacing:6px;color:#333">{otp_code}</h1>
    <p style="color:#666">This code is valid for 10 minutes.</p>
    <p>If you didn't request this, ignore this message.</p>
    <p style="margin-top:20px">Thanks,<br/>EmoSante Team</p>
  </div>
</body>
</html>
"""

        mail.send(msg)
        logging.info(f"OTP email successfully sent to {user_email}")
        return True

    except Exception as e:
        logging.error(f"Error sending OTP email: {e}")
        return False


def send_password_changed_confirmation(user_email, user_name):
    """
    Send confirmation email when password is successfully changed
    """
    try:
        msg = Message(
            subject="Password Changed Successfully - EmoSante",
            recipients=[user_email],
            sender=current_app.config['MAIL_DEFAULT_SENDER']
        )

        msg.body = f"""
Hi {user_name},

Your password has been changed successfully!

If this wasn’t you, please contact support immediately.

Thanks,
EmoSante Team
"""

        msg.html = f"""
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:20px;">
        <h2 style="color:#6C63FF">Password Changed Successfully</h2>
        <p>Hi <strong>{user_name}</strong>,</p>
        <p>Your password has been changed.</p>
        <p>If you did not make this change, please contact support immediately.</p>
        <p style="margin-top:20px;">Thanks,<br/>EmoSante Team</p>
    </div>
</body>
</html>
"""

        mail.send(msg)
        logging.info(f"Password change confirmation sent to {user_email}")
        return True

    except Exception as e:
        logging.error(f"Error sending confirmation email: {e}")
        return False

