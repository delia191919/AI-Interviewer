import { useState } from "react";

const TOPICS = [
  { id: "ai-workplace", label: "AI in the Workplace", icon: "⚙️" },
  { id: "productivity", label: "Productivity Tools", icon: "🚀" },
  { id: "scientific-research", label: "Scientific Research", icon: "🔬" },
  { id: "climate-tech", label: "Climate Technology", icon: "🌱" },
  { id: "future-education", label: "Future of Education", icon: "📚" },
  { id: "custom", label: "Custom Topic…", icon: "✏️" },
];

export default function WelcomeScreen({ onStart }) {
  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState("");

  const topic =
    selected === "custom"
      ? custom.trim()
      : TOPICS.find((t) => t.id === selected)?.label ?? "";

  return (
    <div style={{ animation: "fadeUp 0.6s ease both" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>

        <h1 style={{
          fontSize: "clamp(2rem,5vw,3.2rem)",
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 700, margin: "0 0 14px",
          color: "#ffffff", lineHeight: 1.15,
        }}>
          AI Interviewer
        </h1>
        <p style={{ color: "#94a3b8", maxWidth: 440, margin: "0 auto", lineHeight: 1.7, fontSize: 15 }}>
          AI will guide you through a short conversation and analyse your responses.
        </p>
      </div>

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 14 }}>
          Choose a topic
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
          {TOPICS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              style={{
                background: selected === t.id
                  ? "linear-gradient(135deg,#1e1e2d,#252540)"
                  : "#12121e",
                border: `1px solid ${selected === t.id ? "#3b82f6" : "#1e1e2d"}`,
                borderRadius: 10, padding: "14px 16px",
                cursor: "pointer", textAlign: "left",
                color: selected === t.id ? "#ffffff" : "#94a3b8",
                display: "flex", alignItems: "center", gap: 10, fontSize: 14,
              }}
            >
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {selected === "custom" && (
        <div style={{ marginBottom: 28, animation: "fadeUp 0.3s ease both" }}>
          <input
            autoFocus
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && topic && onStart(topic)}
            placeholder=" "
            style={{
              width: "100%", background: "#12121e",
              border: "1px solid #1e1e2d", borderRadius: 10,
              padding: "14px 18px", color: "#ffffff",
              fontSize: 15, outline: "none",
            }}
          />
        </div>
      )}

      <button
        onClick={() => topic && onStart(topic)}
        disabled={!topic}
        style={{
          width: "100%", padding: "16px",
          background: topic ? "linear-gradient(135deg,#3b82f6,#fb2ed7)" : "#1e1e2d",
          border: "none", borderRadius: 10,
          cursor: topic ? "pointer" : "not-allowed",
          color: topic ? "#ffffff" : "#4b5563",
          fontWeight: 700, fontSize: 15, letterSpacing: "0.04em",
        }}
      >
        Begin Interview →
      </button>


    </div>
  );
}
