import { LayoutDashboard, FileText, Brain } from "lucide-react";
import { NavLink } from "react-router-dom";
import AJ from "../assets/AJ.png";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "14px",
    color: isActive ? "var(--primary)" : "var(--muted)",
    background: isActive ? "rgba(124,124,255,0.12)" : "transparent",
    transition: "0.2s"
  });

  return (
    <aside
      style={{
        width: 220,
        background: "var(--card)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "16px 12px",
        gap: "20px",
        backdropFilter: "blur(12px)"
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src={AJ} alt="LaunchOps" style={{ width: 32, height: 32 }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>LaunchOps</div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>
            Founder OS
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <NavLink to="/dashboard" style={linkStyle}>
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>

        <NavLink to="/documents" style={linkStyle}>
          <FileText size={16} />
          Documents
        </NavLink>

        <NavLink to="/ai" style={linkStyle}>
          <Brain size={16} />
          AI Center
        </NavLink>
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 10,
          borderTop: "1px solid var(--border)"
        }}
      >
        <div style={{ fontSize: 11, color: "var(--muted)" }}>
          LaunchOps
        </div>
        <ThemeToggle />
      </div>
    </aside>
  );
}