import axios from "axios";
import Groq from "groq-sdk";
import Document from "../models/Document.js";
import WorkItem from "../models/WorkItem.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/* =========================
   Helper: Safe JSON Parser
========================= */
const extractJSON = (text) => {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
};

/* =========================
   1️⃣ Extract Metrics
========================= */
export const extractMetrics = async (req, res) => {
  const { workItemId } = req.body;

  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!workItemId) {
      return res.status(400).json({ message: "workItemId required" });
    }

    /* Load documents */
    const docs = await Document.find({
      workItem: workItemId,
      owner: req.userId
    });

    if (!docs.length) {
      return res.status(404).json({ message: "No documents uploaded" });
    }

    /* Mark documents as processing */
    await Document.updateMany(
      { workItem: workItemId, owner: req.userId },
      { status: "processing", processedAt: null }
    );

    /* Read all text */
    let combinedText = "";

    for (const doc of docs) {
      try {
        const response = await axios.get(doc.fileUrl, {
          responseType: "text",
          timeout: 15000
        });

        if (typeof response.data === "string") {
          combinedText += response.data + "\n\n";
        }
      } catch {
        console.warn("Unreadable:", doc.fileUrl);
      }
    }

    if (!combinedText.trim()) {
      await Document.updateMany(
        { workItem: workItemId, owner: req.userId },
        { status: "error" }
      );
      return res.status(400).json({ message: "No readable content in documents" });
    }

    /* AI Prompt */
    const prompt = `
You are a venture capital financial analyst.

Extract from the text:
- revenue
- expenses
- fundingRequired
- riskLevel (LOW, MEDIUM, HIGH)

Return ONLY valid JSON:
{
  "revenue": 250000,
  "expenses": 120000,
  "fundingRequired": 500000,
  "riskLevel": "HIGH"
}

Text:
${combinedText}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0,
      messages: [{ role: "user", content: prompt }]
    });

    const raw = completion.choices?.[0]?.message?.content || "";

    const parsed = extractJSON(raw);

    if (!parsed) {
      await Document.updateMany(
        { workItem: workItemId, owner: req.userId },
        { status: "error" }
      );
      return res.status(500).json({ message: "AI returned invalid JSON" });
    }

    /* Sanitize numbers */
    const revenue = Number(parsed.revenue) || 0;
    const expenses = Number(parsed.expenses) || 0;

    const runwayMonths =
      expenses > 0 ? Math.round((revenue / expenses) * 10) / 10 : null;

    /* Update WorkItem */
    const updated = await WorkItem.findOneAndUpdate(
      { _id: workItemId, owner: req.userId },
      {
        revenue,
        expenses,
        fundingRequired: Number(parsed.fundingRequired) || 0,
        riskLevel: parsed.riskLevel || "UNKNOWN",
        runwayMonths,
        aiSummary: parsed,
        lastAnalyzedAt: new Date()
      },
      { new: true }
    );

    /* Mark documents processed */
    await Document.updateMany(
      { workItem: workItemId, owner: req.userId },
      { status: "processed", processedAt: new Date() }
    );

    res.json(updated);
  } catch (err) {
    console.error("Metric extraction failed:", err);

    await Document.updateMany(
      { workItem: workItemId, owner: req.userId },
      { status: "error" }
    );

    res.status(500).json({ message: "Metric extraction failed" });
  }
};

/* =========================
   2️⃣ Analyze (Q&A)
========================= */
export const analyze = async (req, res) => {
  res.json({ message: "Analyze endpoint wired" });
};

/* =========================
   3️⃣ Alerts
========================= */
export const alerts = async (req, res) => {
  res.json({ message: "Alerts endpoint wired" });
};

/* =========================
   4️⃣ Insights
========================= */
export const insights = async (req, res) => {
  res.json({ message: "Insights endpoint wired" });
};
