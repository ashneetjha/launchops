import { useState } from "react";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);

      window.location.href = "/dashboard";
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Check email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #020617, #020617)"
    }}>
      <div className="card" style={{
        width: 380,
        padding: 30,
        borderRadius: 12,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
      }}>
        <h2 style={{ marginBottom: 5 }}>LaunchOps</h2>
        <p style={{ opacity: 0.7, marginBottom: 25 }}>
          Founder Intelligence Platform
        </p>

        <form onSubmit={submit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && (
            <div style={{ color: "#f87171", fontSize: 14, marginBottom: 10 }}>
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

        <p
          style={{ marginTop: 20, textAlign: "center", cursor: "pointer", opacity: 0.8 }}
          onClick={() => window.location.href = "/register"}
        >
          Create Account
        </p>
      </div>
    </div>
  );
}