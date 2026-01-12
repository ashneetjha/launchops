import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";

export default function ProfileDropdown() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: "pointer",
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8
        }}
      >
        <User size={16} />
        {user.name || "Account"}
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "110%",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            width: 220,
            overflow: "hidden",
            zIndex: 100
          }}
        >
          <div style={{ padding: 12 }}>
            <div style={{ fontWeight: 600 }}>{user.name}</div>
            <div className="muted" style={{ fontSize: 13 }}>
              {user.email}
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)" }}>
            <MenuItem
              icon={<Settings size={16} />}
              label="Settings"
              onClick={() => navigate("/settings")}
            />
            <MenuItem
              icon={<LogOut size={16} />}
              label="Logout"
              onClick={logout}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        cursor: "pointer"
      }}
    >
      {icon}
      {label}
    </div>
  );
}