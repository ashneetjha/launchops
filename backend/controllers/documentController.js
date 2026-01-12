import cloudinary from "../config/cloudinary.js";
import Document from "../models/Document.js";

export const uploadDocument = async (req, res) => {
  try {
    const { workItemId } = req.body;

    if (!workItemId) {
      return res.status(400).json({ message: "workItemId required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto"
    });

    const doc = await Document.create({
      fileUrl: result.secure_url,
      workItem: workItemId,
      owner: req.userId
    });

    res.status(201).json({
      message: "Document uploaded",
      document: doc
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};