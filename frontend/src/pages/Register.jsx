import { useState } from "react";
import api from "../api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    const res = await api.post("/auth/register", { email, password });
    localStorage.setItem("token", res.data.token);
    window.location.href = "/dashboard";
  };

  return (
    <div className="card" style={{ width: 350, margin: "120px auto" }}>
      <h2>Create Account</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button className="btn" onClick={submit}>Create Account</button>
      <p onClick={() => window.location.href="/"}>Already have an account?</p>
    </div>
  );
}