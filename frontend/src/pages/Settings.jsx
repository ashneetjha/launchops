import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Settings() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (err) {
      setError("Session expired. Please login again.");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const resetOnboarding = () => {
    localStorage.removeItem("onboarded");
    navigate("/onboarding", { replace: true });
  };

  if (loading) {
    return (
      <Layout>
        <div className="card">Loading account…</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="card" style={{ color: "#ef4444" }}>
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Account Settings</h1>

      {/* Profile */}
      <div className="card" style={{ maxWidth: 600 }}>
        <h3>Profile</h3>
        <div style={{ marginTop: 16 }}>
          <div><b>Name:</b> {user.name}</div>
          <div style={{ marginTop: 8 }}><b>Email:</b> {user.email}</div>
          <div style={{ marginTop: 8 }} className="muted">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card" style={{ maxWidth: 600 }}>
        <h3>Actions</h3>

        <button
          className="btn-outline"
          onClick={resetOnboarding}
          style={{ marginRight: 12 }}
        >
          Restart Onboarding
        </button>
        <button className="btn" onClick={logout}>
          Logout
        </button>
      </div>
    </Layout>
  );
}