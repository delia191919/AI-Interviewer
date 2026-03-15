import { useState, useEffect } from "react";

export function Spinner() {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: "#fb2ed7",
          animation: "bounce 1.2s infinite",
          animationDelay: `${i * 0.2}s`,
          display: "inline-block",
        }} />
      ))}
    </span>
  );
}

export function ProgressBar({ current, total }) {
  const pct = total ? Math.round((current / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94a3b8" }}>Progress</span>
        <span style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600 }}>{current} / {total}</span>
      </div>
      <div style={{ height: 3, background: "#1e1e2d", borderRadius: 99 }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: "linear-gradient(90deg,#3b82f6,#fb2ed7)",
          borderRadius: 99,
          transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
}

export function useTypingEffect(text, speed = 15) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return { displayed, done };
}

export function QuestionBubble({ text, label = "Interviewer" }) {
  const { displayed, done } = useTypingEffect(text, 14);
  return (
    <div style={{
      background: "linear-gradient(135deg,#161625 0%,#1a1a2e 100%)",
      border: "1px solid #2a2a40",
      borderRadius: "2px 18px 18px 18px",
      padding: "18px 22px",
      marginBottom: 20,
    }}>
      <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#3b82f6", marginBottom: 8, fontWeight: 700 }}>
        {label}
      </div>
      <p style={{ margin: 0, lineHeight: 1.7, color: "#ffffff", fontSize: 15 }}>
        {displayed}
        {!done && (
          <span style={{ borderLeft: "2px solid #fb2ed7", marginLeft: 2, animation: "blink 1s step-end infinite" }}>
            &nbsp;
          </span>
        )}
      </p>
    </div>
  );
}

export function SentimentMeter({ score, label }) {
  const color = score >= 70 ? "#6abf7b" : score >= 40 ? "#c8a96e" : "#e07070";
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94a3b8" }}>Sentiment</span>
        <span style={{ fontSize: 13, color, fontWeight: 700 }}>{label} · {score}/100</span>
      </div>
      <div style={{ height: 6, background: "#1e1e2d", borderRadius: 99 }}>
        <div style={{
          height: "100%", width: `${score}%`,
          background: `linear-gradient(90deg,#3b82f6,#fb2ed7)`,
          borderRadius: 99,
          transition: "width 1s 0.4s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
}

export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div style={{
      background: "#2a1010", border: "1px solid #6a2020",
      borderRadius: 10, padding: "14px 18px",
      color: "#e07070", fontSize: 14, marginBottom: 20,
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <span>⚠ {message}</span>
      <button onClick={onDismiss} style={{
        background: "none", border: "none", color: "#e07070",
        cursor: "pointer", fontSize: 18, lineHeight: 1,
      }}>×</button>
    </div>
  );
}
