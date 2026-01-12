import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  analyze,
  extractMetrics,
  alerts,
  insights
} from "../controllers/aiController.js";

const router = express.Router();

// Ask questions about uploaded documents
router.post("/analyze", protect, analyze);

// Extract financial metrics and save them into MongoDB
router.post("/extract-metrics", protect, extractMetrics);

// Generate founder risk & alert report
router.post("/alerts", protect, alerts);

// Generate investor-grade strategic insights
router.post("/insights", protect, insights);

export default router;