<div align="center">

# ✦ AI Interviewer

**A full-stack AI-powered interview tool that conducts structured, adaptive interviews on any topic.**

Built with FastAPI · React · Google Gemini

</div>

---

## 📌 Overview

AI Interviewer mimics a simplified version of the [Anthropic Interviewer](https://www.anthropic.com/news/anthropic-interviewer) tool. The user selects a topic, and the system conducts a short structured interview — generating questions, collecting answers, asking personalized follow-ups, and producing a detailed analysis at the end.

Every session is automatically saved as a JSON file on the server.

---

## ✨ Features

- 🎯 **Structured interviews** — 2 technical, 1 critical thinking, 1 work ethic question per session
- 🔄 **Adaptive follow-ups** — personalized follow-up after every answer, referencing what the user actually said
- 📊 **Rich analysis** — sentiment score, engagement score, themes, strengths, improvements
- 💾 **Auto-save** — every interview saved as a timestamped JSON file
- ⌨️ **Typing effect** — questions appear character by character for a natural feel
- 🔒 **Secure** — API key lives on the server, never exposed to the browser

---

## 🖥️ Demo flow

```
1. Pick a topic  →  AI in the Workplace, Scientific Research, or any custom topic
2. Answer 4 structured questions  →  technical, critical thinking, work ethic
3. Respond to personalized follow-ups  →  based on what you actually said
4. View full analysis  →  summary, themes, scores, strengths, improvements
5. Interview auto-saved  →  backend/interviews/topic-date-id.json
```

---

## 🏗️ Architecture

```
Browser (React + Vite :5173)
        │
        │   POST /api/questions
        │   POST /api/followup
        │   POST /api/summary
        │   POST /api/save
        ▼
FastAPI Backend (:8000)
        │
        │   Builds prompts → calls Gemini API
        ▼
Google Gemini (gemini-3-flash-preview)
        │
        │   Returns structured JSON responses
        ▼
interviews/ folder  ←  auto-saved JSON transcripts
```

> The frontend calls `/api/*` endpoints on the backend. The backend holds the Gemini API key securely — it never reaches the browser.

---

## 📁 Project structure

```
ai-interviewer/
├── backend/
│   ├── main.py               ← FastAPI app — endpoints + prompt logic
│   ├── run.py                ← Entry point — loads .env, starts uvicorn
│   ├── requirements.txt
│   ├── .env                  ← API key (never commit this)
│   └── interviews/           ← Saved JSON files (auto-created at runtime)
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx            ← Screen router
        ├── api.js             ← Centralized HTTP client
        ├── components.jsx     ← Spinner, ProgressBar, QuestionBubble, SentimentMeter
        ├── WelcomeScreen.jsx  ← Topic selection
        ├── InterviewScreen.jsx ← Question → Answer → Follow-up loop
        └── ResultsScreen.jsx  ← Analysis display + collapsible transcript
```

---

## 🚀 Getting started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A free Gemini API key → [Get one here](https://aistudio.google.com/apikey)

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-interviewer.git
cd ai-interviewer
```

---

### 2. Backend setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Mac/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:

```env
GEMINI_API_KEY=your-gemini-api-key-here
```

Start the server:

```bash
python run.py
```

✅ Backend running at **http://localhost:8000**  
📖 API docs at **http://localhost:8000/docs**

---

### 3. Frontend setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running at **http://localhost:5173**

---

## 🔌 API reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server status check |
| `POST` | `/api/questions` | Generate 4 structured interview questions |
| `POST` | `/api/followup` | Generate a personalized follow-up question |
| `POST` | `/api/summary` | Analyse the full interview transcript |
| `POST` | `/api/save` | Save interview to `interviews/` as JSON |

---

## 📊 Analysis output

At the end of each interview, the system returns:

| Field | Type | Description |
|-------|------|-------------|
| `summary` | string | 2-3 sentence overview of the candidate |
| `themes` | array | 3-5 key themes across answers |
| `sentiment` | string | Positive / Neutral / Mixed / Negative |
| `sentimentScore` | integer | 0–100, based on tone and confidence |
| `engagementScore` | integer | 0–100, based on depth and detail of answers |
| `keyPoints` | array | 3-5 specific insights from the interview |
| `keywords` | array | 6-8 words representing the responses |
| `strengths` | array | 2-3 notable strengths demonstrated |
| `improvements` | array | 1-2 areas to develop further |

---

## 💾 Saved interview format

Files are saved in `backend/interviews/` with the naming pattern:  
`topic-name-YYYYMMDD-HHMMSS-uniqueid.json`

```json
{
  "topic": "AI in the Workplace",
  "date": "2025-01-15T14:32:10",
  "transcript": [
    {
      "question": "How do you evaluate the reliability of an AI system before deploying it?",
      "answer": "I look at test coverage, edge cases and benchmark performance...",
      "followUp": "What specific edge case caught you off guard most recently?",
      "followUpAnswer": "A model that performed well on benchmarks but failed on real user input..."
    }
  ],
  "analysis": {
    "summary": "The candidate demonstrated strong technical grounding...",
    "themes": ["reliability", "testing", "deployment"],
    "sentiment": "Positive",
    "sentimentScore": 78,
    "engagementScore": 85,
    "keyPoints": ["Mentioned specific testing frameworks", "..."],
    "keywords": ["reliability", "testing", "edge cases"],
    "strengths": ["Clear technical communication", "Practical examples"],
    "improvements": ["Could elaborate more on team collaboration"]
  }
}
```

---

## 🛠️ Tech stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| LLM | Google Gemini | Free tier, strong JSON instruction following |
| Backend | FastAPI + Uvicorn | Async, auto-validation via Pydantic, fast |
| Frontend | React 18 + Vite | Instant HMR, simple component model |
| Styling | CSS-in-JS | Zero UI library dependencies |
| Storage | JSON files | Simple, portable, no database needed |

---
