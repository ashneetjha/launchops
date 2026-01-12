import WorkItem from "../models/WorkItem.js";
import Document from "../models/Document.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    const workItems = await WorkItem.find({ owner: userId });
    const documents = await Document.find({ owner: userId });

    let revenue = 0;
    let expenses = 0;
    let riskLevel = "UNKNOWN";
    let runwayMonths = null;

    for (const item of workItems) {
      if (item.aiSummary) {
        revenue += item.aiSummary.revenue || 0;
        expenses += item.aiSummary.expenses || 0;
        if (item.aiSummary.riskLevel) {
          riskLevel = item.aiSummary.riskLevel;
        }
        if (item.aiSummary.runwayMonths) {
          runwayMonths = item.aiSummary.runwayMonths;
        }
      }
    }

    const burnRate = expenses;

    const openTasks = workItems.filter(w => w.status !== "done").length;

    res.json({
      revenue,
      expenses,
      burnRate,
      runwayMonths,
      riskLevel,
      openTasks,
      documents: documents.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard failed" });
  }
};