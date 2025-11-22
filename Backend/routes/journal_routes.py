from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from utils.db import db
from models.models import JournalEntry

journal_bp = Blueprint("journal", __name__)


@journal_bp.route("/", methods=["GET"])
@jwt_required()
def list_entries():
    """Return all journal entries for the current user (most recent first)."""
    user_id = get_jwt_identity()
    entries = (
        JournalEntry.query
        .filter_by(user_id=user_id)
        .order_by(JournalEntry.created_at.desc())
        .all()
    )
    return jsonify([entry.to_dict() for entry in entries]), 200


@journal_bp.route("/", methods=["POST"])
@jwt_required()
def create_entry():
    data = request.get_json() or {}
    content = (data.get("content") or "").strip()
    title = data.get("title") or "New entry"
    emotion = data.get("emotion") or "Neutral"

    if not content:
        return jsonify({"message": "Entry content cannot be empty"}), 400

    user_id = get_jwt_identity()

    entry = JournalEntry(
        user_id=user_id,
        title=title,
        content=content,
        emotion=emotion,
    )
    db.session.add(entry)
    db.session.commit()

    return jsonify(entry.to_dict()), 201


@journal_bp.route("/<int:entry_id>", methods=["PUT", "PATCH"])
@jwt_required()
def update_entry(entry_id):
    data = request.get_json() or {}
    content = data.get("content")
    title = data.get("title")
    emotion = data.get("emotion")

    user_id = get_jwt_identity()
    entry = JournalEntry.query.filter_by(id=entry_id, user_id=user_id).first()

    if not entry:
        return jsonify({"message": "Entry not found"}), 404

    if content is not None:
        trimmed = content.strip()
        if not trimmed:
            return jsonify({"message": "Entry content cannot be empty"}), 400
        entry.content = trimmed

    if title is not None:
        entry.title = title or "New entry"

    if emotion is not None:
        entry.emotion = emotion or "Neutral"

    db.session.commit()
    return jsonify(entry.to_dict()), 200


@journal_bp.route("/<int:entry_id>", methods=["DELETE"])
@jwt_required()
def delete_entry(entry_id):
    user_id = get_jwt_identity()
    entry = JournalEntry.query.filter_by(id=entry_id, user_id=user_id).first()

    if not entry:
        return jsonify({"message": "Entry not found"}), 404

    db.session.delete(entry)
    db.session.commit()

    return jsonify({"message": "Entry deleted"}), 200