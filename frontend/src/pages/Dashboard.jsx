import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getWork } from "../api";

export default function Dashboard() {
  const [workItems, setWorkItems] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getWork().then((res) => {
      setWorkItems(res.data);
      if (res.data.length > 0) setSelected(res.data[0]);
    });
  }, []);

  if (!selected) {
    return (
      <Layout>
        <h2>No work items yet</h2>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: 20 }}>
        Command Center
      </h1>

      {/* KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginBottom: "40px"
        }}
      >
        <Metric title="Revenue" value={`₹${(selected.revenue || 0) / 1000}K`} />
        <Metric title="Burn" value={`₹${(selected.expenses || 0) / 1000}K`} />
        <Metric title="Runway" value={`${selected.runwayMonths || "–"} months`} />
        <Metric title="Risk" value={selected.riskLevel || "Unknown"} />
      </div>

      {/* WORK ITEMS */}
      <h2 style={{ marginBottom: 10 }}>Your Projects</h2>

      {workItems.map((w) => (
        <div
          key={w._id}
          onClick={() => setSelected(w)}
          className="card"
          style={{
            marginBottom: 15,
            cursor: "pointer",
            border:
              selected._id === w._id
                ? "2px solid #f5c542"
                : "1px solid rgba(255,255,255,0.08)"
          }}
        >
          <h3>{w.title}</h3>
          <p style={{ opacity: 0.7 }}>{w.description}</p>
          <p>Risk: {w.riskLevel || "Not analyzed yet"}</p>
        </div>
      ))}
    </Layout>
  );
}

function Metric({ title, value }) {
  return (
    <div className="card">
      <p style={{ opacity: 0.6 }}>{title}</p>
      <h2 style={{ fontSize: "28px", marginTop: 10 }}>{value}</h2>
    </div>
  );
}