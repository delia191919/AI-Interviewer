import { useState, useEffect } from "react";
import { api } from "./api.js";
import { Spinner, SentimentMeter, ErrorBanner } from "./components.jsx";

export default function ResultsScreen({ topic, transcript, onRestart }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api.generateSummary(topic, transcript);
        setAnalysis(data);

        await api.saveInterview(topic, transcript, data);
        setSaved(true);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div style={{ textAlign: "center", padding: "80px 0" }}>
      <Spinner />
      <p style={{ color: "#94a3b8", marginTop: 20, fontSize: 14 }}>
        Analysing your responses…
      </p>
    </div>
  );

  return (
    <div style={{ animation: "fadeUp 0.5s ease both" }}>

      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>✦</div>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "1.8rem", color: "#ffffff", margin: "0 0 8px",
        }}>
          Interview Complete
        </h2>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {analysis && (
        <>


          <SentimentMeter
            score={analysis.sentimentScore ?? 50}
            label={analysis.sentiment ?? "Neutral"}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{
              background: "#12121e", border: "1px solid #1e1e2d",
              borderRadius: 12, padding: "20px",
            }}>
              <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3b82f6", marginBottom: 12 }}>
                Key Themes
              </div>
              {(analysis.themes ?? []).map((t, i) => (
                <div key={i} style={{
                  fontSize: 13, color: "#ffffff", marginBottom: 6,
                  paddingLeft: 12, borderLeft: "2px solid #3b82f644",
                }}>
                  {t}
                </div>
              ))}
            </div>

            <div style={{
              background: "#12121e", border: "1px solid #1e1e2d",
              borderRadius: 12, padding: "20px",
            }}>
              <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3b82f6", marginBottom: 12 }}>
                Keywords
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(analysis.keywords ?? []).map((kw, i) => (
                  <span key={i} style={{
                    background: "#1e1e2d", border: "1px solid #2a2a40",
                    borderRadius: 99, padding: "4px 10px",
                    fontSize: 12, color: "#fb2ed7",
                  }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>



          <TranscriptAccordion transcript={transcript} />
        </>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button
          onClick={onRestart}
          style={{
            flex: 1, padding: "14px",
            background: "linear-gradient(135deg,#3b82f6,#fb2ed7)",
            border: "none", borderRadius: 10,
            color: "#ffffff", fontWeight: 700, cursor: "pointer", fontSize: 14,
          }}
        >
          New Interview
        </button>
      </div>
    </div>
  );
}

function TranscriptAccordion({ transcript }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", padding: "13px 18px",
          background: "transparent", border: "1px solid #cc5cbbff",
          borderRadius: open ? "10px 10px 0 0" : 10,
          color: "#4964c4ff", cursor: "pointer",
          display: "flex", justifyContent: "space-between", fontSize: 13,
        }}
      >
        <span>View full transcript</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{
          background: "#0e0c0a", border: "1px solid #2a2520",
          borderTop: "none", borderRadius: "0 0 10px 10px",
          padding: "20px 20px",
        }}>
          {transcript.map((entry, i) => (
            <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < transcript.length - 1 ? "1px solid #1e1e2d" : "none" }}>
              <div style={{ fontSize: 11, color: "#3b82f6", marginBottom: 4 }}>Q{i + 1}</div>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8, lineHeight: 1.6 }}>{entry.question}</p>
              <div style={{ fontSize: 11, color: "#fb2ed7", marginBottom: 4 }}>Answer</div>
              <p style={{ fontSize: 13, color: "#ffffff", marginBottom: entry.followUp ? 8 : 0, lineHeight: 1.6 }}>{entry.answer}</p>
              {entry.followUp && (
                <>
                  <div style={{ fontSize: 11, color: "#3b82f6", marginBottom: 4 }}>Follow-up</div>
                  <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 6, lineHeight: 1.6 }}>{entry.followUp}</p>
                  {entry.followUpAnswer && (
                    <>
                      <div style={{ fontSize: 11, color: "#fb2ed7", marginBottom: 4 }}>Answer</div>
                      <p style={{ fontSize: 13, color: "#ffffff", lineHeight: 1.6 }}>{entry.followUpAnswer}</p>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
