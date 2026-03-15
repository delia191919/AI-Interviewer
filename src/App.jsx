import { useState } from "react";
import WelcomeScreen from "./WelcomeScreen.jsx";
import InterviewScreen from "./InterviewScreen.jsx";
import ResultsScreen from "./ResultsScreen.jsx";

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [topic, setTopic] = useState("");
  const [transcript, setTranscript] = useState([]);

  const startInterview = (t) => { setTopic(t); setScreen("interview"); };
  const finishInterview = (tr) => { setTranscript(tr); setScreen("results"); };
  const restart = () => { setTopic(""); setTranscript([]); setScreen("welcome"); };

  return (
    <>
      <div style={{
        position: "fixed", inset: 0, opacity: 0.025, pointerEvents: "none", zIndex: 9999,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      <div style={{
        position: "fixed", top: "-20%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 400, pointerEvents: "none",
        background: "radial-gradient(ellipse,#3b82f615 0%,transparent 70%)",
      }} />

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 52,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#3b82f6", letterSpacing: "0.06em" }}>
            ✦ AI Interviewer
          </div>
          {topic && (
            <div style={{ fontSize: 12, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {topic}
            </div>
          )}
        </div>

        {screen === "welcome" && <WelcomeScreen onStart={startInterview} />}
        {screen === "interview" && <InterviewScreen key={topic} topic={topic} onFinish={finishInterview} />}
        {screen === "results" && <ResultsScreen topic={topic} transcript={transcript} onRestart={restart} />}
      </div>
    </>
  );
}
