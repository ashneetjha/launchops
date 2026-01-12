import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If someone hits /login while already authenticated, force logout
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      // Save session
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Prevent browser back button from going back to login
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #020617, #020617)"
      }}
    >
      <div
        className="card"
        style={{
          width: 380,
          padding: 32,
          borderRadius: 14
        }}
      >
        <h2>LaunchOps</h2>
        <p className="muted" style={{ marginBottom: 24 }}>
          Founder Intelligence Platform
        </p>

        <form onSubmit={submit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div style={{ color: "#ef4444", fontSize: 14, marginBottom: 10 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn"
            style={{ width: "100%", marginTop: 10 }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div
          style={{
            marginTop: 18,
            textAlign: "center",
            cursor: "pointer",
            color: "var(--muted)"
          }}
          onClick={() => navigate("/register")}
        >
          Create account
        </div>
      </div>
    </div>
  );
}