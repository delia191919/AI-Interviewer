import json
import os
import re
import datetime
import pathlib
import uuid
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from pydantic import BaseModel

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="AI Interviewer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class TopicRequest(BaseModel):
    topic: str


class FollowUpRequest(BaseModel):
    topic: str
    question: str
    answer: str


class TranscriptEntry(BaseModel):
    question: str
    answer: str
    followUp: Optional[str] = None
    followUpAnswer: Optional[str] = None


class SummaryRequest(BaseModel):
    topic: str
    transcript: list[TranscriptEntry]


class SaveRequest(BaseModel):
    topic: str
    transcript: list[TranscriptEntry]
    analysis: Optional[dict] = None


def call_gemini(prompt: str) -> str:
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt,
    )
    return response.text


def parse_json_response(text: str) -> dict | list:
    clean = re.sub(r"```(?:json)?", "", text).strip().rstrip("`").strip()
    return json.loads(clean)


@app.get("/")
def root():
    return {"status": "ok"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/questions")
def generate_questions(req: TopicRequest):
    prompt = (
        f"You are a senior interviewer and researcher conducting a structured professional interview.\n"
        f"Generate exactly 4 interview questions about: \"{req.topic}\".\n\n"
        f"The questions must follow this exact structure:\n"
        f"1. A technical question that tests specific knowledge or expertise on the topic.\n"
        f"2. A second technical question that explores practical application or problem-solving.\n"
        f"3. A critical thinking or creativity question that reveals how the person approaches challenges.\n"
        f"4. A work ethic or communication skills question that uncovers values and collaboration style.\n\n"
        f"Rules:\n"
        f"- Each question must be open-ended and non-leading.\n"
        f"- Questions must be precise, specific, and directly relevant to \"{req.topic}\".\n"
        f"- Avoid vague or generic questions.\n\n"
        f"Return ONLY a JSON array of exactly 4 strings, no markdown, no explanation.\n"
        f"Format: [\"Question 1?\", \"Question 2?\", \"Question 3?\", \"Question 4?\"]"
    )

    try:
        text = call_gemini(prompt)
        questions = parse_json_response(text)

        if not isinstance(questions, list):
            raise ValueError("Expected a JSON array")

        return {"questions": questions[:4]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/followup")
def generate_followup(req: FollowUpRequest):
    prompt = (
        f"You are a skilled and empathetic professional interviewer.\n\n"
        f"Context:\n"
        f"- Topic: \"{req.topic}\"\n"
        f"- Question asked: \"{req.question}\"\n"
        f"- Candidate answer: \"{req.answer}\"\n\n"
        f"Your task:\n"
        f"Read the candidate's full answer carefully and generate ONE follow-up question "
        f"that directly references something specific they said.\n\n"
        f"The follow-up must:\n"
        f"- Be max 20 words\n"
        f"- Dig deeper into a concrete detail, example, or claim from their answer\n"
        f"- Feel natural and conversational, not robotic\n"
        f"- NOT repeat the original question\n\n"
        f"Return ONLY the follow-up question text, nothing else."
    )

    try:
        text = call_gemini(prompt)
        return {"followUp": text.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/summary")
def generate_summary(req: SummaryRequest):
    formatted = "\n\n".join(
        f"Q: {e.question}\nA: {e.answer}"
        + (
            f"\nFollow-up: {e.followUp}\nFollow-up answer: {e.followUpAnswer}"
            if e.followUp
            else ""
        )
        for e in req.transcript
    )

    prompt = (
        f"You are an expert qualitative analyst evaluating a professional interview.\n\n"
        f"Interview topic: \"{req.topic}\"\n\n"
        f"Full transcript:\n{formatted}\n\n"
        f"Analyze the interview carefully and return a JSON object with these exact keys:\n\n"
        f"- \"summary\": A 2-3 sentence overview of the candidate's overall perspective and performance.\n"
        f"- \"themes\": Array of 3-5 key themes that emerged across the answers.\n"
        f"- \"sentiment\": Overall emotional tone — one of: Positive / Neutral / Mixed / Negative.\n"
        f"- \"sentimentScore\": Integer 0-100. Be precise: base this on the actual tone, "
        f"confidence, and enthusiasm in the answers. Do not default to average scores.\n"
        f"- \"engagementScore\": Integer 0-100. Measures how detailed, thoughtful, and engaged "
        f"the candidate was. Short or vague answers should score low. Rich, specific answers score high.\n"
        f"- \"keyPoints\": Array of 3-5 specific insights or standout moments from the interview.\n"
        f"- \"keywords\": Array of 6-8 single words that best represent the candidate's responses.\n"
        f"- \"strengths\": Array of 2-3 notable strengths demonstrated in the answers.\n"
        f"- \"improvements\": Array of 1-2 areas where the candidate could improve or elaborate more.\n\n"
        f"Be accurate and critical. Avoid generic observations — reference specific things said.\n"
        f"Return ONLY valid JSON, no markdown, no explanation."
    )

    try:
        text = call_gemini(prompt)
        analysis = parse_json_response(text)
        return analysis

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/save")
def save_interview(req: SaveRequest):
    output_dir = pathlib.Path("interviews")
    output_dir.mkdir(exist_ok=True)

    slug = re.sub(r"[^\w]+", "-", req.topic.lower()).strip("-")
    timestamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    filename = f"{slug}-{timestamp}-{uuid.uuid4().hex[:6]}.json"

    payload = {
        "topic": req.topic,
        "date": datetime.datetime.now().isoformat(),
        "transcript": [e.model_dump() for e in req.transcript],
        "analysis": req.analysis,
    }

    (output_dir / filename).write_text(
        json.dumps(payload, indent=2, ensure_ascii=False)
    )

    return {"saved": True, "file": str(output_dir / filename)}