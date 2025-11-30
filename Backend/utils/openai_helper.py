from openai import OpenAI
import os
import tempfile

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY","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"))

ALLOWED_EMOTIONS = {"Happy", "Calm", "Neutral", "Tired", "Sad"}

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
    """Transcribe an uploaded audio file to text using OpenAI only.

    Accepts a Werkzeug FileStorage. Returns the transcribed text, or None on error.
    """
    tmp_path = None
    try:
        # Save upload to a temporary file on disk.
        with tempfile.NamedTemporaryFile(delete=False, suffix=".m4a") as tmp:
            tmp_path = tmp.name
        file_storage.save(tmp_path)

        try:
            with open(tmp_path, "rb") as f:
                response = client.audio.transcriptions.create(
                    model="gpt-4o-mini-transcribe",
                    file=f,
                )
            text = getattr(response, "text", None)
        except Exception as e:
            print("Remote audio transcription failed:", e)
            return None

        if not text:
            print("Audio transcription returned no text")
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
