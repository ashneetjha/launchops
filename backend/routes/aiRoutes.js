import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  analyzeWorkItem,
  extractMetrics,
  generateAlerts,
  generateInsights
} from "../controllers/aiController.js";

const router = express.Router();

// Ask questions about uploaded documents
router.post("/analyze", protect, analyzeWorkItem);

// Extract financial metrics and save them into MongoDB
router.post("/extract-metrics", protect, extractMetrics);

// Generate founder risk & alert report
router.post("/alerts", protect, generateAlerts);

// Generate investor-grade strategic insights
router.post("/insights", protect, generateInsights);

export default router;