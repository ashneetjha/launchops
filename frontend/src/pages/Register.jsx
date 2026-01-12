import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password
      });

      // Save session (must match Login.jsx)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Force onboarding for new users
      localStorage.removeItem("onboarded");

      navigate("/onboarding", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
        <h2>Create your LaunchOps account</h2>
        <p className="muted" style={{ marginBottom: 24 }}>
          Start turning documents into intelligence
        </p>

        <form onSubmit={submit}>
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password (min 8 characters)"
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
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div
          style={{
            marginTop: 18,
            textAlign: "center",
            cursor: "pointer",
            color: "var(--muted)"
          }}
          onClick={() => navigate("/login")}
        >
          Already have an account?
        </div>
      </div>
    </div>
  );
}