import { Link } from "react-router-dom";
import { UploadCloud, Brain, BarChart3, ShieldCheck } from "lucide-react";

export default function Landing() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #0b1020 0%, #020409 60%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px 24px"
      }}
    >
      {/* HERO */}
      <div style={{ maxWidth: 1100, textAlign: "center" }}>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            marginBottom: 20
          }}
        >
          LaunchOps
        </h1>

        <p
          style={{
            fontSize: 22,
            opacity: 0.85,
            maxWidth: 720,
            margin: "0 auto"
          }}
        >
          The AI command center for startup founders.  
          Upload documents and instantly get
          <b> revenue, burn, runway, and risk intelligence</b>.
        </p>

        <div
          style={{
            marginTop: 40,
            display: "flex",
            justifyContent: "center",
            gap: 16
          }}
        >
          <Link to="/register">
            <button
              className="btn"
              style={{ padding: "16px 36px", fontSize: 16 }}
            >
              Get Started Free
            </button>
          </Link>

          <Link to="/login">
            <button
              style={{
                padding: "16px 36px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "transparent",
                color: "white"
              }}
            >
              Sign In
            </button>
          </Link>
        </div>
      </div>

      {/* FEATURES */}
      <div
        style={{
          marginTop: 120,
          maxWidth: 1200,
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 32
        }}
      >
        <Feature
          icon={<UploadCloud size={28} />}
          title="Upload Anything"
          desc="Pitch decks, financials, PDFs, screenshots or handwritten notes."
        />
        <Feature
          icon={<Brain size={28} />}
          title="AI Extraction"
          desc="LLMs read your documents and extract financial intelligence."
        />
        <Feature
          icon={<BarChart3 size={28} />}
          title="Founder Dashboard"
          desc="Revenue, burn, runway and risks — always live."
        />
        <Feature
          icon={<ShieldCheck size={28} />}
          title="Secure by Design"
          desc="Encrypted passwords, JWT auth, and isolated user data."
        />
      </div>

      {/* BOTTOM CTA */}
      <div
        style={{
          marginTop: 120,
          textAlign: "center",
          maxWidth: 700
        }}
      >
        <h2 style={{ fontSize: 36, fontWeight: 800 }}>
          Built for serious founders
        </h2>

        <p style={{ marginTop: 12, opacity: 0.75, fontSize: 18 }}>
          Stop guessing your runway.  
          Let AI read your startup and tell you the truth.
        </p>

        <Link to="/register">
          <button
            className="btn"
            style={{
              marginTop: 32,
              padding: "16px 40px",
              fontSize: 16
            }}
          >
            Launch your Command Center
          </button>
        </Link>
      </div>

      <div style={{ marginTop: 100, opacity: 0.4 }}>
        © 2026 LaunchOps — Founder Intelligence Platform
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 32,
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "rgba(224,184,74,0.15)",
          color: "#e0b84a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {icon}
      </div>

      <div style={{ fontWeight: 700, fontSize: 18 }}>{title}</div>
      <div style={{ opacity: 0.75, lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}