from flask import Blueprint, request, jsonify
from utils.openai_helper import analyze_emotion

emotion_bp = Blueprint("emotion", __name__)

@emotion_bp.route("/", methods=["POST"])
def analyze():
    text = request.json.get("entry")
    emotion = analyze_emotion(text)
    return jsonify({"emotion": emotion})
