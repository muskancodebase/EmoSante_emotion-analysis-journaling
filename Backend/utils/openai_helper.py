
from openai import OpenAI
import os
import tempfile
import whisper

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "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"))

ALLOWED_EMOTIONS = {"Happy", "Calm", "Neutral", "Tired", "Sad"}

_whisper_model = None

def _get_whisper_model():
    global _whisper_model
    if _whisper_model is None:
        # Tiny model keeps things lightweight while remaining usable.
        _whisper_model = whisper.load_model("tiny")
    return _whisper_model

def _local_whisper_transcribe(path: str):
    """Fallback, fully local transcription using open-source Whisper.

    Returns text or None on failure.
    """
    try:
        model = _get_whisper_model()
        result = model.transcribe(path, fp16=False)
        text = (result.get("text") or "").strip()
        if not text:
            print("Local Whisper transcription returned no text")
            return None
        return text
    except Exception as e:
        print("Local Whisper transcription failed:", e)
        return None

def _normalize_emotion(raw):
    """Normalize the model output to one of the allowed emotion labels."""
    if not raw:
        return "Neutral"

    token = str(raw).strip().split()[0]
    candidate = token.capitalize()
    if candidate in ALLOWED_EMOTIONS:
        return candidate

    upper = token.upper()
    mapping = {
        "HAPPY": "Happy",
        "CALM": "Calm",
        "NEUTRAL": "Neutral",
        "TIRED": "Tired",
        "SAD": "Sad",
    }
    if upper in mapping:
        return mapping[upper]

    return "Neutral"

def transcribe_audio(file_storage):
    """Transcribe an uploaded audio file to text using OpenAI.

    Accepts a Werkzeug FileStorage. Returns the transcribed text, or None on error.
    """
    tmp_path = None
    try:
        # Save upload to a temporary file on disk.
        with tempfile.NamedTemporaryFile(delete=False, suffix=".m4a") as tmp:
            tmp_path = tmp.name
        file_storage.save(tmp_path)

        text = None

        # Try remote transcription first (if quota allows).
        try:
            with open(tmp_path, "rb") as f:
                response = client.audio.transcriptions.create(
                    model="gpt-4o-mini-transcribe",
                    file=f,
                )
            text = getattr(response, "text", None)
        except Exception as remote_err:
            # On any remote failure (including insufficient_quota), fall back to local Whisper.
            print("Remote audio transcription failed, falling back to local Whisper:", remote_err)

        if not text:
            print("Falling back to local Whisper transcription")
            text = _local_whisper_transcribe(tmp_path)

        if not text:
            print("Audio transcription returned no text even after fallback")
            return None

        return text.strip()
    except Exception as e:
        print("Audio transcription failed:", e)
        return None
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except OSError:
                pass

def analyze_emotion(text):
    """Call OpenAI to classify the primary emotion of the given text.

    The model is instructed to return exactly one of: Happy, Calm, Neutral, Tired, Sad.
    On any error, this function falls back to "Neutral" so API calls never crash routes.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": (
                        "You are an emotion classifier for a mental health journaling app. "
                        "Given the journal entry text below, respond with EXACTLY ONE word, "
                        "chosen from this list only: Happy, Calm, Neutral, Tired, Sad. "
                        "Respond with just that single word and nothing else.\n\n"
                        f"Journal entry:\n{text}"
                    ),
                }
            ],
            temperature=0,
        )
        raw = response.choices[0].message.content
        return _normalize_emotion(raw)
    except Exception:
        # Fail-safe default if OpenAI is unavailable or the request fails.
        return "Neutral"
