from flask import Blueprint, request, jsonify
from models.models import db, JournalEntry, User
from sqlalchemy import func, extract, text
from datetime import datetime
import logging
import calendar
import math

report_bp = Blueprint('report', __name__)

# ------------------------------------------------------------
# UC-09: Generate Monthly Emotion Trend Report
# ------------------------------------------------------------
@report_bp.route('/monthly-emotion-trend', methods=['POST'])
def get_monthly_emotion_trend():
    try:
        data = request.json or {}
        user_id = data.get('user_id')
        month = data.get('month')
        year = data.get('year')

        if not user_id:
            return jsonify({"success": False, "message": "User ID required"}), 400

        # Default month/year → current
        if not month or not year:
            now = datetime.now()
            month = month or now.month
            year = year or now.year

        if not (1 <= month <= 12):
            return jsonify({"success": False, "message": "Invalid month (1-12)"}), 400

        # Check user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        # Load entries of this month
        entries = JournalEntry.query.filter(
            JournalEntry.user_id == user_id,
            extract("month", JournalEntry.created_at) == month,
            extract("year", JournalEntry.created_at) == year
        ).all()

        month_name = calendar.month_name[month]

        # If empty → return clean "no data"
        if not entries:
            return jsonify({
                "success": True,
                "report": None,
                "message": f"No journal entries found for {month_name} {year}"
            }), 200

        # ---------------------------------------
        #   PROCESS BREAKDOWN
        # ---------------------------------------
        emotion_breakdown = {}
        entries_by_date = {}

        for entry in entries:
            emotion = entry.emotion or "Neutral"
            emotion_breakdown[emotion] = emotion_breakdown.get(emotion, 0) + 1

            date_key = entry.created_at.strftime("%Y-%m-%d")

            if date_key not in entries_by_date:
                entries_by_date[date_key] = []

            entries_by_date[date_key].append({
                "title": entry.title,
                "emotion": emotion,
                "time": entry.created_at.strftime("%I:%M %p")
            })

        dominant_emotion = max(emotion_breakdown, key=emotion_breakdown.get)

        total_entries = len(entries)

        summary = (
            f"You had {total_entries} journal "
            f"{'entry' if total_entries == 1 else 'entries'} in {month_name} {year}. "
            f"Your most frequent emotion was '{dominant_emotion}'."
        )

        # ---------------------------------------
        #   SAFE LINE CHART (NO UNDEFINED EVER)
        # ---------------------------------------
        emotion_map = {
            "Happy": 5,
            "Excited": 4,
            "Calm": 3,
            "Neutral": 2,
            "Anxious": 1,
            "Sad": 0,
            "Angry": -1
        }

        sorted_dates = sorted(entries_by_date.keys())

        labels = []
        values = []

        for date_str in sorted_dates:
            labels.append(date_str.split("-")[2])  # "01", "02", etc.

            # Always pick first entry of the day
            day_entry = entries_by_date[date_str][0]
            emotion = day_entry.get("emotion", "Neutral")

            # Convert to number safely
            value = emotion_map.get(emotion, 0)

            # Avoid NaN or non-finite
            if value is None or not math.isfinite(value):
                value = 0

            values.append(value)

        # Always return arrays (even empty)
        line_chart = {
            "labels": labels or [],
            "data": values or []
        }

        # ---------------------------------------
        #   FINAL STRUCTURED REPORT
        # ---------------------------------------
        report = {
            "month": month_name,
            "year": year,
            "total_entries": total_entries,
            "emotion_breakdown": emotion_breakdown,
            "dominant_emotion": dominant_emotion,
            "entries_by_date": entries_by_date,
            "summary": summary,
            "lineChart": line_chart
        }

        return jsonify({"success": True, "report": report}), 200

    except Exception as e:
        logging.error(f"Monthly report error: {e}")
        return jsonify({"success": False, "message": "Error generating report"}), 500

# ------------------------------------------------------------
# Get Available Months
# ------------------------------------------------------------
@report_bp.route('/available-months', methods=['POST'])
def get_available_months():
    try:
        data = request.json or {}
        user_id = data.get("user_id")

        if not user_id:
            return jsonify({"success": False, "message": "User ID required"}), 400

        results = db.session.query(
            extract("year", JournalEntry.created_at).label("year"),
            extract("month", JournalEntry.created_at).label("month"),
            func.count(JournalEntry.id).label("count")
        ).filter(
            JournalEntry.user_id == user_id
        ).group_by("year", "month").order_by(
            text("year DESC"), text("month DESC")
        ).all()

        months = []
        for row in results:
            year = int(row.year)
            month = int(row.month)
            count = row.count
            month_name = calendar.month_name[month]

            months.append({
                "month": month,
                "year": year,
                "label": f"{month_name} {year}",
                "count": count
            })

        return jsonify({"success": True, "months": months}), 200

    except Exception as e:
        logging.error(f"Available months error: {e}")
        return jsonify({"success": False, "message": "Error fetching available months"}), 500
