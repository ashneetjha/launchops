import { LayoutDashboard, FileText, Brain } from "lucide-react";
import AJ from "../assets/AJ.png";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <img src={AJ} className="logo" />
      <nav>
        <Link to="/dashboard"><LayoutDashboard /> Dashboard</Link>
        <Link to="/documents"><FileText /> Documents</Link>
        <Link to="/ai"><Brain /> AI Insights</Link>
      </nav>
    </div>
  );
}