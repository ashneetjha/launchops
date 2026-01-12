import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import Document from "../models/Document.js";

/* ======================================================
   Upload a document
====================================================== */
export const uploadDocument = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { workItemId } = req.body;
    if (!workItemId) {
      return res.status(400).json({ message: "workItemId required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: `launchops/${req.userId}/${workItemId}`,
      use_filename: true,
      unique_filename: false
    });

    try {
      fs.unlinkSync(req.file.path);
    } catch {}

    const doc = await Document.create({
      fileUrl: result.secure_url,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      workItem: workItemId,
      owner: req.userId,
      status: "uploaded",
      processedAt: null
    });

    res.status(201).json(doc);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Document upload failed" });
  }
};

/* ======================================================
   Get all documents for a work item
====================================================== */
export const getDocumentsByWorkItem = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const workItemId = req.params.id;

    if (!workItemId) {
      return res.status(400).json({ message: "workItemId required" });
    }

    const docs = await Document.find({
      workItem: workItemId,
      owner: req.userId
    }).sort({ createdAt: -1 });

    res.json(docs);
  } catch (err) {
    console.error("Fetch documents error:", err);
    res.status(500).json({ message: "Failed to load documents" });
  }
};
