import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="btn-outline">
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}