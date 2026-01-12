import { useState } from "react";
import api from "../api";

export default function Register() {
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

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
        <h2 style={{ marginBottom: 5 }}>Create your LaunchOps account</h2>
        <p style={{ opacity: 0.7, marginBottom: 25 }}>
          Start turning startup documents into intelligence
        </p>

        <form onSubmit={submit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p
          style={{ marginTop: 20, textAlign: "center", cursor: "pointer", opacity: 0.8 }}
          onClick={() => window.location.href = "/"}
        >
          Already have an account?
        </p>
      </div>
    </div>
  );
}