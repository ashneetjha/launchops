import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String,
      required: true
    },

    fileName: {
      type: String,
      required: true
    },

    mimeType: {
      type: String
    },

    workItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Work",
      required: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // AI pipeline status
    status: {
      type: String,
      enum: ["uploaded", "processing", "processed", "failed"],
      default: "uploaded"
    },

    extractedText: {
      type: String // OCR / parsed text
    },

    extractedMetrics: {
      type: Object // revenue, burn, runway, etc
    }
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);