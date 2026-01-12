import { useNavigate } from "react-router-dom";
import { CheckCircle, UploadCloud, Brain, BarChart3 } from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();

  const finish = () => {
    localStorage.setItem("onboarded", "true");
    navigate("/dashboard", { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #020617, #0b1020)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px"
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: 720,
          padding: 48,
          textAlign: "center"
        }}
      >
        <h1 style={{ fontSize: 36, fontWeight: 800 }}>
          Welcome to LaunchOps 🚀
        </h1>

        <p className="muted" style={{ marginTop: 12, fontSize: 18 }}>
          Your AI-powered command center for startup founders
        </p>

        {/* Steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 24,
            marginTop: 40
          }}
        >
          <Step
            icon={<UploadCloud size={28} />}
            title="Upload Documents"
            desc="Pitch decks, financials, or notes"
          />
          <Step
            icon={<Brain size={28} />}
            title="Run AI Analysis"
            desc="Extract revenue, burn & risks"
          />
          <Step
            icon={<BarChart3 size={28} />}
            title="View Insights"
            desc="Track runway and health"
          />
        </div>

        {/* CTA */}
        <button
          className="btn"
          style={{ marginTop: 48, padding: "14px 36px", fontSize: 16 }}
          onClick={finish}
        >
          Enter Command Center
        </button>

        <div style={{ marginTop: 24, color: "var(--muted)" }}>
          You can always access this later from settings
        </div>
      </div>
    </div>
  );
}

function Step({ icon, title, desc }) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "rgba(212,175,55,0.1)",
          color: "var(--gold)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {icon}
      </div>

      <div style={{ fontWeight: 700 }}>{title}</div>
      <div className="muted" style={{ fontSize: 14 }}>
        {desc}
      </div>
    </div>
  );
}