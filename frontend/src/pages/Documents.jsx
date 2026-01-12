import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import api from "../api";
import {
  UploadCloud,
  FileText,
  Brain,
  CheckCircle,
  Clock,
  AlertTriangle,
  X
} from "lucide-react";
import { motion } from "framer-motion";

export default function Documents() {
  const [workItems, setWorkItems] = useState([]);
  const [active, setActive] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    api.get("/work").then((res) => {
      setWorkItems(res.data);
      if (res.data.length > 0) setActive(res.data[0]);
    });
  }, []);

  useEffect(() => {
    if (active) fetchDocs();
  }, [active]);

  const fetchDocs = async () => {
    const res = await api.get(`/documents/workitem/${active._id}`);
    setDocuments(res.data);
  };

  const upload = async () => {
    if (!file || !active || loading) return;
    setLoading(true);

    const form = new FormData();
    form.append("file", file);
    form.append("workItemId", active._id);

    await api.post("/documents", form);
    await fetchDocs();

    setFile(null);
    setLoading(false);
  };

  const runAI = async () => {
    if (!active) return;
    await api.post("/ai/extract-metrics", { workItemId: active._id });
    await fetchDocs();
    alert("AI processing started. Document status will update automatically.");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (loading) return;
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  };

  const statusIcon = (status) => {
    if (status === "processing") return <Clock size={14} color="var(--accent)" />;
    if (status === "processed") return <CheckCircle size={14} color="var(--primary)" />;
    if (status === "error") return <AlertTriangle size={14} color="var(--accent)" />;
    return <CheckCircle size={14} color="var(--muted)" />;
  };

  const statusLabel = (status) => {
    if (status === "processing") return "Processing";
    if (status === "processed") return "Processed";
    if (status === "error") return "Error";
    return "Uploaded";
  };

  return (
    <Layout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Documents</h1>

        <select
          value={active?._id || ""}
          onChange={(e) => setActive(workItems.find((w) => w._id === e.target.value))}
        >
          {workItems.map((w) => (
            <option key={w._id} value={w._id}>
              {w.title}
            </option>
          ))}
        </select>
      </div>

      {/* Upload zone */}
      <motion.div
        whileHover={{ scale: loading ? 1 : 1.01 }}
        className="card"
        style={{
          border: `2px dashed ${dragging ? "var(--primary)" : "var(--border)"}`,
          textAlign: "center",
          padding: 40,
          cursor: loading ? "not-allowed" : "pointer",
          background: dragging ? "rgba(124,124,255,0.06)" : "transparent",
          opacity: loading ? 0.6 : 1
        }}
        onClick={() => !loading && fileInputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!loading) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <UploadCloud size={40} />
        <p style={{ marginTop: 12 }}>Drag & drop or click to upload</p>
        <p className="muted">PDF, Excel, images, contracts, resumes, etc</p>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(e) => setFile(e.target.files[0])}
        />

        {file && (
          <div
            style={{ marginTop: 16, display: "flex", gap: 12, justifyContent: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            <span>{file.name}</span>

            <button className="btn" onClick={upload} disabled={loading}>
              {loading ? "Uploading…" : "Upload"}
            </button>

            <button className="btn-outline" onClick={() => setFile(null)}>
              <X size={14} />
            </button>
          </div>
        )}
      </motion.div>

      {/* Files */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Files</h2>
          <button className="btn-outline" onClick={runAI}>
            <Brain size={16} /> Analyze documents
          </button>
        </div>

        {documents.length === 0 && (
          <div className="card muted" style={{ textAlign: "center", marginTop: 16 }}>
            No documents uploaded yet
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
            marginTop: 16
          }}
        >
          {documents.map((doc) => (
            <div key={doc._id} className="card">
              <FileText size={28} />
              <div style={{ fontWeight: 600 }}>{doc.fileName}</div>

              <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
                {statusIcon(doc.status)}
                <span className="muted">{statusLabel(doc.status)}</span>
              </div>

              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
                style={{ marginTop: 12 }}
              >
                Open
              </a>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}