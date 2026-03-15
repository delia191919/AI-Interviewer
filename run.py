"""
Entry point - loads .env then starts uvicorn.
Run with:  python run.py
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

if not os.getenv("GEMINI_API_KEY"):
    raise SystemExit(" GEMINI_API_KEY not set")

import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)