import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api";
import { UploadCloud, FileText, Brain, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Documents() {
  const [workItems, setWorkItems] = useState([]);
  const [active, setActive] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/work").then(res => {
      setWorkItems(res.data);
      if (res.data.length > 0) setActive(res.data[0]);
    });
  }, []);

  useEffect(() => {
    if (!active) return;
    api.get(`/documents?workItemId=${active._id}`).then(res => {
      setDocuments(res.data);
    });
  }, [active]);

  const upload = async () => {
    if (!file || !active) return;
    setLoading(true);

    const form = new FormData();
    form.append("file", file);
    form.append("workItemId", active._id);

    await api.post("/documents", form);

    const res = await api.get(`/documents?workItemId=${active._id}`);
    setDocuments(res.data);
    setFile(null);
    setLoading(false);
  };

  const runAI = async () => {
    await api.post("/ai/extract-metrics", { workItemId: active._id });
    alert("AI processing complete. Check Dashboard.");
  };

  return (
    <Layout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Documents</h1>

        <select
          value={active?._id || ""}
          onChange={e =>
            setActive(workItems.find(w => w._id === e.target.value))
          }
        >
          {workItems.map(w => (
            <option key={w._id} value={w._id}>
              {w.title}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Zone */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="card"
        style={{
          border: "2px dashed var(--border)",
          textAlign: "center",
          padding: 40,
          cursor: "pointer"
        }}
        onClick={() => document.getElementById("fileInput").click()}
      >
        <UploadCloud size={40} />
        <p style={{ marginTop: 12 }}>Click to upload or drag & drop</p>
        <p className="muted">PDF, images, or docs</p>

        <input
          id="fileInput"
          type="file"
          hidden
          onChange={e => setFile(e.target.files[0])}
        />

        {file && (
          <button className="btn" style={{ marginTop: 16 }} onClick={upload}>
            {loading ? "Uploading..." : "Upload " + file.name}
          </button>
        )}
      </motion.div>

      {/* Files */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Files</h2>

          <button className="btn-outline" onClick={runAI}>
            <Brain size={16} /> Run AI on documents
          </button>
        </div>

        {documents.length === 0 && (
          <div className="card muted" style={{ textAlign: "center" }}>
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
          {documents.map(doc => (
            <a
              key={doc._id}
              href={doc.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="card"
              style={{
                textDecoration: "none",
                color: "var(--text)",
                display: "flex",
                flexDirection: "column",
                gap: 10
              }}
            >
              <FileText size={32} />
              <div style={{ fontWeight: 600 }}>
                {doc.fileName || "Document"}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle size={14} color="var(--gold)" />
                <span className="muted">Uploaded</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Layout>
  );
}