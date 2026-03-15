const BASE = "/api";

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  generateQuestions: (topic) => post("/questions", { topic }),
  generateFollowUp: (topic, question, answer) => post("/followup", { topic, question, answer }),
  generateSummary: (topic, transcript) => post("/summary", { topic, transcript }),
  saveInterview: (topic, transcript, analysis) => post("/save", { topic, transcript, analysis }),
};