import express from "express";
import { uploadDocument, getDocumentsByWorkItem } from "../controllers/documentController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* Upload file */
router.post("/", protect, upload.single("file"), uploadDocument);

/* Fetch documents for a work item */
router.get("/workitem/:id", protect, getDocumentsByWorkItem);

export default router;
