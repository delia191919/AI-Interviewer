import { useState, useEffect, useRef } from "react";
import { api } from "./api.js";
import { Spinner, ProgressBar, QuestionBubble, ErrorBanner } from "./components.jsx";

export default function InterviewScreen({ topic, onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [phase, setPhase] = useState("main");
  const [transcript, setTranscript] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const mainRef = useRef();


  useEffect(() => {
    (async () => {
      try {
        const data = await api.generateQuestions(topic);
        setQuestions(data.questions.slice(0, 5));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [topic]);

  const currentQ = questions[qIndex] ?? "";

  const submitMain = async () => {
    if (!answer.trim() || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const data = await api.generateFollowUp(topic, currentQ, answer);
      setFollowUp(data.followUp);
      setPhase("followup");
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const advance = (includeFollowUp = true) => {
    const entry = {
      question: currentQ,
      answer: answer.trim(),
      followUp: followUp || null,
      followUpAnswer: includeFollowUp ? followUpAnswer.trim() : "",
    };
    const next = [...transcript, entry];
    setTranscript(next);

    if (qIndex + 1 >= questions.length) {
      onFinish(next);
    } else {
      setQIndex(qIndex + 1);
      setAnswer("");
      setFollowUp("");
      setFollowUpAnswer("");
      setPhase("main");
      mainRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      phase === "main" ? submitMain() : advance(true);
    }
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: "80px 0" }}>
      <Spinner />
      <p style={{ color: "#94a3b8", marginTop: 20, fontSize: 14 }}>Crafting your interview questions…</p>
    </div>
  );

  return (
    <div ref={mainRef} style={{ animation: "fadeUp 0.5s ease both" }}>


      <div style={{ fontSize: 12, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: 6 }}>
        QUESTION {qIndex + 1} OF {questions.length}
      </div>

      <QuestionBubble key={currentQ} text={currentQ} />

      <ErrorBanner message={error} onDismiss={() => setError("")} />

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={handleKey}
        disabled={phase === "followup"}
        placeholder="Your answer…"
        rows={4}
        style={{
          width: "100%", background: "#12121e",
          border: "1px solid #1e1e2d", borderRadius: 10,
          padding: "14px 18px", color: "#ffffff",
          fontSize: 15, lineHeight: 1.6, resize: "vertical",
          outline: "none", marginBottom: 12,
          opacity: phase === "followup" ? 0.5 : 1,
          transition: "opacity 0.3s",
        }}
      />

      {phase === "main" && (
        <button
          onClick={submitMain}
          disabled={!answer.trim() || submitting}
          style={{
            width: "100%", padding: "14px",
            background: answer.trim() && !submitting
              ? "linear-gradient(135deg,#3b82f6,#fb2ed7)"
              : "#1e1e2d",
            border: "none", borderRadius: 10,
            color: answer.trim() && !submitting ? "#ffffff" : "#4b5563",
            fontWeight: 700, fontSize: 14,
            cursor: answer.trim() && !submitting ? "pointer" : "not-allowed",
          }}
        >
          {submitting ? <Spinner /> : "Submit Answer →"}
        </button>
      )}

      {phase === "followup" && (
        <div style={{ marginTop: 24, animation: "fadeUp 0.4s ease both" }}>
          <QuestionBubble key={followUp} text={followUp} label="Interviewer (Optional)" />

          <textarea
            autoFocus
            value={followUpAnswer}
            onChange={(e) => setFollowUpAnswer(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Your answer... "
            rows={3}
            style={{
              width: "100%", background: "#12121e",
              border: "1px solid #1e1e2d", borderRadius: 10,
              padding: "14px 18px", color: "#ffffff",
              fontSize: 15, lineHeight: 1.6, resize: "vertical",
              outline: "none", marginBottom: 12,
            }}
          />

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => advance(false)}
              style={{
                flex: 1, padding: "13px",
                background: "transparent", border: "1px solid #1e1e2d",
                borderRadius: 10, color: "#94a3b8", fontWeight: 600, cursor: "pointer",
              }}
            >
              Skip
            </button>
            <button
              onClick={() => advance(true)}
              style={{
                flex: 2, padding: "13px",
                background: "linear-gradient(135deg,#3b82f6,#fb2ed7)",
                border: "none", borderRadius: 10,
                color: "#ffffff", fontWeight: 700, cursor: "pointer",
              }}
            >
              {qIndex + 1 >= questions.length ? "Finish Interview →" : "Next Question →"}
            </button>
          </div>
        </div>
      )}


    </div>
  );
}
