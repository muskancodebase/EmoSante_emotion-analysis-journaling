from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "your_api_key_here"))

def analyze_emotion(text):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": f"Identify the main emotion in: {text}"}]
    )
    return response.choices[0].message.content
