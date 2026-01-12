import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api";

export default function AI() {
  const [workItems, setWorkItems] = useState([]);
  const [activeWorkItem, setActiveWorkItem] = useState(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState("");

  const [loadingAsk, setLoadingAsk] = useState(false);
  const [loadingExtract, setLoadingExtract] = useState(false);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  useEffect(() => {
    async function loadWork() {
      const res = await api.get("/work");
      setWorkItems(res.data);
      if (res.data.length > 0) setActiveWorkItem(res.data[0]);
    }
    loadWork();
  }, []);

  const askAI = async () => {
    if (!question || !activeWorkItem) return;
    setLoadingAsk(true);
    const res = await api.post("/ai/analyze", {
      workItemId: activeWorkItem._id,
      question
    });
    setAnswer(res.data.answer);
    setLoadingAsk(false);
  };

  const extractMetrics = async () => {
    if (!activeWorkItem) return;
    setLoadingExtract(true);
    await api.post("/ai/extract-metrics", {
      workItemId: activeWorkItem._id
    });
    const updated = await api.get("/work");
    const current = updated.data.find(w => w._id === activeWorkItem._id);
    setActiveWorkItem(current);
    setMetrics(current);
    setLoadingExtract(false);
  };

  const getAlerts = async () => {
    if (!activeWorkItem) return;
    setLoadingAlerts(true);
    const res = await api.post("/ai/alerts", {
      workItemId: activeWorkItem._id
    });
    setAlerts(res.data.alerts);
    setLoadingAlerts(false);
  };

  return (
    <Layout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700 }}>AI Command Center</h1>
        <select
          value={activeWorkItem?._id || ""}
          onChange={(e) =>
            setActiveWorkItem(workItems.find(w => w._id === e.target.value))
          }
        >
          {workItems.map(w => (
            <option key={w._id} value={w._id}>
              {w.title}
            </option>
          ))}
        </select>
      </div>

      {/* Metric cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px"
      }}>
        {["Revenue", "Expenses", "Runway", "Risk"].map((label, i) => (
          <div key={i} className="card" style={{ padding: "20px" }}>
            <div style={{ opacity: 0.6, fontSize: 14 }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>
              {metrics
                ? label === "Revenue" ? `₹${metrics.revenue}`
                : label === "Expenses" ? `₹${metrics.expenses}`
                : label === "Runway" ? `${metrics.runwayMonths} mo`
                : metrics.riskLevel
                : "—"}
            </div>
          </div>
        ))}
      </div>

      {/* Main 2-column layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "32px",
        marginTop: "20px"
      }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card" style={{ padding: "24px" }}>
            <h3>Ask AI</h3>
            <textarea
              rows="4"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about this startup..."
            />
            <button onClick={askAI} disabled={loadingAsk}>
              {loadingAsk ? "Thinking..." : "Ask"}
            </button>
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <h3>Extract Financial Metrics</h3>
            <button onClick={extractMetrics} disabled={loadingExtract}>
              {loadingExtract ? "Analyzing..." : "Run AI Extraction"}
            </button>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card" style={{ padding: "24px", minHeight: 180 }}>
            <h3>AI Answer</h3>
            <div style={{ whiteSpace: "pre-wrap", opacity: 0.9 }}>
              {answer || "Ask a question to see AI insights here."}
            </div>
          </div>

          <div className="card" style={{ padding: "24px", minHeight: 180 }}>
            <h3>Founder Alerts</h3>
            <button onClick={getAlerts} disabled={loadingAlerts}>
              {loadingAlerts ? "Scanning..." : "Run Risk Scan"}
            </button>
            <div style={{ marginTop: 12, whiteSpace: "pre-wrap", opacity: 0.9 }}>
              {alerts || "Run a scan to detect risks and issues."}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}