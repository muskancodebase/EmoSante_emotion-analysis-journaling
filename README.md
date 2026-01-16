# ÉmoSanté – AI-Powered Emotion & Sentiment Journal

**ÉmoSanté** is a cross-platform mobile application designed to help users track, understand, and visualize their emotional well-being. By utilizing Artificial Intelligence, the app analyzes audio and text entries to detect underlying sentiments, helping users maintain a daily log of their mental health journey.

🔗 **Repository:** [https://github.com/muskancodebase/EmoSante_emotion-analysis-journaling](https://github.com/muskancodebase/EmoSante_emotion-analysis-journaling)

---

## 🚀 Key Features

* **AI Emotion Analysis:** Automatically detects emotions from both text inputs and audio voice notes using OpenAI.
* **Color-Coded Visualization:** Assigns colors to specific emotions for easy pattern recognition.
* **Streak & History:** Tracks daily logging habits and provides a historical view of emotional trends.
* **Visual Analytics:** Uses interactive charts to display mood progress over time.
* **Secure Data:** Full CRUD functionality with password protection and secure storage.
* **Data Management:** Export entries as PDF for personal use or sharing.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React Native (Expo) |
| **Backend** | Flask (Python) |
| **Database** | SQLite |
| **AI / NLP** | OpenAI API |
| **Visualization** | React Native Chart Kit |
| **Authentication** | JWT (JSON Web Tokens) |


## ⚙️ Installation & Setup

```bash
# ==========================================
# STEP 1: CLONE THE REPOSITORY
# ==========================================
git clone [https://github.com/muskancodebase/EmoSante_emotion-analysis-journaling.git](https://github.com/muskancodebase/EmoSante_emotion-analysis-journaling.git)
cd EmoSante_emotion-analysis-journaling

# ==========================================
# STEP 2: BACKEND SETUP (FLASK)
# ==========================================
cd backend

# --- Create Virtual Environment ---
# Windows:
python -m venv venv
venv\Scripts\activate

# Mac/Linux:
# python3 -m venv venv
# source venv/bin/activate

# --- Install Dependencies ---
pip install -r requirements.txt

# --- Environment Variables ---
# Create a .env file in the backend folder and add your keys:
# OPENAI_API_KEY=your_key_here
# SECRET_KEY=your_secret_here

# --- Start the Server ---
flask run --host=0.0.0.0

# ==========================================
# STEP 3: FRONTEND SETUP (REACT NATIVE)
# ==========================================
# Open a NEW terminal window (keep backend running)
# Navigate back to root, then into frontend:
cd ../frontend

# --- Install Node Modules ---
npm install

# --- Start the App ---
npx expo start

# Use the Expo Go app on your phone to scan the QR code

🤝 The Team
This project was built with collaboration and hard work by:

Muskan Irfan (muskancodebase)
Amina Asghar (emma460emma460)
Muhammad Umer (SilverUmer21)
Muhammad Ahmad (AhmydBajwa)

📄 License
This project is open-source and available under the MIT License.
