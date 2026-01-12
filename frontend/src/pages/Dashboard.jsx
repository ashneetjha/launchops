import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getWork } from "../api";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [workItems, setWorkItems] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getWork().then((res) => {
      setWorkItems(res.data || []);
      if (res.data?.length > 0) setSelected(res.data[0]);
    });
  }, []);

  if (!selected) {
    return (
      <Layout>
        <div className="card" style={{ textAlign: "center", padding: 60 }}>
          <h2>No projects yet</h2>
          <p className="muted">Upload documents to start getting insights</p>
        </div>
      </Layout>
    );
  }

  const chartData = [
    {
      name: "Now",
      Revenue: selected.revenue || 0,
      Burn: selected.expenses || 0
    },
    {
      name: "3m",
      Revenue: (selected.revenue || 0) * 1.2,
      Burn: (selected.expenses || 0) * 1.1
    },
    {
      name: "6m",
      Revenue: (selected.revenue || 0) * 1.5,
      Burn: (selected.expenses || 0) * 1.2
    }
  ];

  return (
    <Layout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Command Center</h1>
        <div className="muted">{selected.title}</div>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
        <Metric title="Revenue" value={selected.revenue || 0} prefix="₹" />
        <Metric title="Burn" value={selected.expenses || 0} prefix="₹" />
        <Metric title="Runway" value={selected.runwayMonths || 0} suffix=" mo" />
        <RiskBadge level={selected.riskLevel} />
      </div>

      {/* Chart */}
      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Revenue vs Burn</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Revenue" stroke="#e0b84a" strokeWidth={3} />
              <Line type="monotone" dataKey="Burn" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projects */}
      <div>
        <h2>Your Projects</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 20 }}>
          {workItems.map(w => (
            <div
              key={w._id}
              className="card"
              onClick={() => setSelected(w)}
              style={{
                cursor: "pointer",
                border: selected._id === w._id ? "2px solid var(--gold)" : "1px solid var(--border)"
              }}
            >
              <h3>{w.title}</h3>
              <p className="muted">{w.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

function Metric({ title, value, prefix = "", suffix = "" }) {
  return (
    <div className="card">
      <div className="muted">{title}</div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ fontSize: 28, fontWeight: 700 }}
      >
        {prefix}{Math.round(value)}{suffix}
      </motion.div>
    </div>
  );
}

function RiskBadge({ level }) {
  const color =
    level === "High" ? "#ef4444" :
    level === "Medium" ? "#f59e0b" :
    "#22c55e";

  return (
    <div className="card" style={{ borderColor: color }}>
      <div className="muted">Risk</div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>
        {level || "Low"}
      </div>
    </div>
  );
}