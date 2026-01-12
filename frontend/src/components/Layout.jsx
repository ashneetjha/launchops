import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Sidebar from "./Sidebar";
import ProfileDropdown from "./ProfileDropdown";

export default function Layout({ children }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)"
      }}
    >
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            borderBottom: "1px solid var(--border)",
            background: "var(--card)",
            backdropFilter: "blur(12px)"
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              color: "var(--text)",
              border: "none",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <ProfileDropdown />
        </div>

        {/* Main content */}
        <main
          style={{
            flex: 1,
            padding: "32px 40px",
            overflowY: "auto",
            display: "flex",
            justifyContent: "center",
            background: "transparent"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1200px",
              display: "flex",
              flexDirection: "column",
              gap: "32px"
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}