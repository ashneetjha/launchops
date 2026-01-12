import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";
import axios from "axios";
import Document from "../models/Document.js";
import WorkItem from "../models/WorkItem.js";

if (!process.env.GROQ_API_KEY) {
  console.error("GROQ_API_KEY missing in environment");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/* ----------------------------------
   Utility: Load all text from docs
---------------------------------- */
const loadTextFromDocs = async (workItemId, userId) => {
  const docs = await Document.find({
    workItem: workItemId,
    owner: userId
  });

  if (!docs.length) return null;

  let combinedText = "";

  for (const doc of docs) {
    try {
      const response = await axios.get(doc.fileUrl, {
        responseType: "text"
      });
      combinedText += response.data + "\n\n";
    } catch (e) {
      console.warn("Skipping unreadable file:", doc.fileUrl);
    }
  }

  return combinedText.trim() ? combinedText : null;
};

/* ----------------------------------
   1️⃣  AI Q&A
---------------------------------- */
export const analyzeWorkItem = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { workItemId, question } = req.body;
    if (!workItemId || !question) {
      return res.status(400).json({ message: "Missing workItemId or question" });
    }

    const combinedText = await loadTextFromDocs(workItemId, req.userId);
    if (!combinedText) {
      return res.status(404).json({ message: "No readable documents found" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a startup financial and risk analyst reading internal company documents."
        },
        {
          role: "user",
          content: `Documents:\n${combinedText}\n\nQuestion: ${question}`
        }
      ]
    });

    res.json({ answer: completion.choices[0].message.content });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ message: "AI analysis failed" });
  }
};

/* ----------------------------------
   2️⃣  Financial Metric Extractor
---------------------------------- */
export const extractMetrics = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const { workItemId } = req.body;
    if (!workItemId) return res.status(400).json({ message: "workItemId required" });

    const combinedText = await loadTextFromDocs(workItemId, req.userId);
    if (!combinedText) return res.status(404).json({ message: "No readable documents found" });

    const prompt = `
You are a venture capital financial analyst.

From the document below extract:
- revenue
- expenses
- fundingRequired
- riskLevel (LOW, MEDIUM, HIGH)

Return STRICT JSON only:
{
  "revenue": 250000,
  "expenses": 120000,
  "fundingRequired": 500000,
  "riskLevel": "HIGH"
}

Document:
${combinedText}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    });

    const raw = completion.choices[0].message.content.trim();
    const parsed = JSON.parse(raw);

    const runwayMonths =
      parsed.expenses > 0 ? parsed.revenue / parsed.expenses : null;

    const updated = await WorkItem.findOneAndUpdate(
      { _id: workItemId, owner: req.userId },
      {
        revenue: parsed.revenue,
        expenses: parsed.expenses,
        fundingRequired: parsed.fundingRequired,
        riskLevel: parsed.riskLevel,
        runwayMonths,
        aiSummary: parsed,
        lastAnalyzedAt: new Date()
      },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.error("Metric AI Error:", err);
    res.status(500).json({ message: "Metric extraction failed" });
  }
};

/* ----------------------------------
   3️⃣  AI Risk Alerts
---------------------------------- */
export const generateAlerts = async (req, res) => {
  try {
    const docs = await Document.find({ owner: req.userId });
    if (!docs.length) return res.status(400).json({ message: "No documents" });

    let combinedText = "";
    for (const doc of docs) {
      try {
        const r = await axios.get(doc.fileUrl);
        combinedText += r.data + "\n\n";
      } catch {}
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a startup risk advisor." },
        { role: "user", content: combinedText }
      ]
    });

    res.json({ alerts: completion.choices[0].message.content });

  } catch (err) {
    console.error("Alert AI Error:", err);
    res.status(500).json({ message: "Alert generation failed" });
  }
};

/* ----------------------------------
   4️⃣  Investor-Grade Insights
---------------------------------- */
export const generateInsights = async (req, res) => {
  try {
    const workItems = await WorkItem.find({ owner: req.userId });
    const docs = await Document.find({ owner: req.userId });

    let metrics = "";
    for (const w of workItems) {
      if (w.aiSummary) metrics += JSON.stringify(w.aiSummary) + "\n";
    }

    let text = "";
    for (const d of docs) {
      try {
        const r = await axios.get(d.fileUrl);
        text += r.data + "\n\n";
      } catch {}
    }

    const prompt = `
You are a venture capitalist.

Metrics:
${metrics}

Documents:
${text}

Give 5 clear actions this founder should take.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({ insights: completion.choices[0].message.content });

  } catch (err) {
    console.error("Insight AI Error:", err);
    res.status(500).json({ message: "Insights generation failed" });
  }
};