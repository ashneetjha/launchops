import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--card)",
        border: "1px solid var(--border)",
        color: "var(--text)",
        cursor: "pointer",
        transition: "0.2s",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
      }}
      title="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun size={18} color="var(--gold)" />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}