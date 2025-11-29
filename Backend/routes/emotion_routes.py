from flask import Blueprint, request, jsonify
from utils.openai_helper import analyze_emotion, transcribe_audio

emotion_bp = Blueprint("emotion", __name__)

@emotion_bp.route("/", methods=["POST"])
def analyze():
    text = (request.json or {}).get("entry")
    if not text:
        return jsonify({"message": "No text provided"}), 400
    emotion = analyze_emotion(text)
    return jsonify({"emotion": emotion}), 200

@emotion_bp.route("/audio", methods=["POST"])
def analyze_audio():
    """Accept an uploaded audio file, transcribe it, and analyze its emotion.

    Expects multipart/form-data with a `file` field.
    Returns JSON with both the transcript and normalized emotion label.
    """
    if "file" not in request.files:
        return jsonify({"message": "No audio file uploaded"}), 400

    file_storage = request.files["file"]
    transcript = transcribe_audio(file_storage)
    if not transcript:
        return jsonify({"message": "Could not transcribe audio"}), 500

    emotion = analyze_emotion(transcript)
    return jsonify({"transcript": transcript, "emotion": emotion}), 200
