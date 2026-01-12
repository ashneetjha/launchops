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

  // Load all work items on page load
  useEffect(() => {
    async function loadWork() {
      const res = await api.get("/work");
      setWorkItems(res.data);
      if (res.data.length > 0) setActiveWorkItem(res.data[0]);
    }
    loadWork();
  }, []);

  // Ask AI a question
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

  // Extract metrics
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

  // Get risk alerts
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
      <h1 style={{ fontSize: "28px", fontWeight: 700 }}>AI Command Center</h1>

      {/* WorkItem Selector */}
      <div style={{ marginTop: "20px" }}>
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

      {/* Ask AI */}
      <div className="card" style={{ marginTop: "20px" }}>
        <h3>Ask AI</h3>
        <textarea
          rows="3"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about this startup..."
        />
        <button onClick={askAI} disabled={loadingAsk}>
          {loadingAsk ? "Thinking..." : "Ask"}
        </button>

        {answer && (
          <div style={{ marginTop: "10px", whiteSpace: "pre-wrap" }}>
            {answer}
          </div>
        )}
      </div>

      {/* Extract Metrics */}
      <div className="card" style={{ marginTop: "20px" }}>
        <h3>Extract Financial Metrics</h3>
        <button onClick={extractMetrics} disabled={loadingExtract}>
          {loadingExtract ? "Analyzing..." : "Run AI Extraction"}
        </button>

        {metrics && (
          <div style={{ marginTop: "10px" }}>
            <p><b>Revenue:</b> ₹{metrics.revenue}</p>
            <p><b>Expenses:</b> ₹{metrics.expenses}</p>
            <p><b>Funding Required:</b> ₹{metrics.fundingRequired}</p>
            <p><b>Runway:</b> {metrics.runwayMonths} months</p>
            <p><b>Risk:</b> {metrics.riskLevel}</p>
          </div>
        )}
      </div>

      {/* Risk & Alerts */}
      <div className="card" style={{ marginTop: "20px" }}>
        <h3>Founder Alerts</h3>
        <button onClick={getAlerts} disabled={loadingAlerts}>
          {loadingAlerts ? "Scanning..." : "Run Risk Scan"}
        </button>

        {alerts && (
          <div style={{ marginTop: "10px", whiteSpace: "pre-wrap" }}>
            {alerts}
          </div>
        )}
      </div>
    </Layout>
  );
}