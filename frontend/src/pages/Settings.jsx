import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const resetOnboarding = () => {
    localStorage.removeItem("onboarded");
    navigate("/onboarding");
  };

  return (
    <Layout>
      <h1>Account Settings</h1>

      <div className="card" style={{ maxWidth: 600 }}>
        <h3>Profile</h3>
        <div style={{ marginTop: 16 }}>
          <div><b>Name:</b> {user.name}</div>
          <div style={{ marginTop: 8 }}><b>Email:</b> {user.email}</div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        <h3>Actions</h3>

        <button className="btn-outline" onClick={resetOnboarding} style={{ marginRight: 12 }}>
          Restart Onboarding
        </button>

        <button className="btn" onClick={logout}>
          Logout
        </button>
      </div>
    </Layout>
  );
}