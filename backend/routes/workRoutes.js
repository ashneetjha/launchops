import express from "express";
import { createWorkItem, getMyWorkItems } from "../controllers/workController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createWorkItem);
router.get("/", protect, getMyWorkItems);

export default router;