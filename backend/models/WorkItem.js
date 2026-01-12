import mongoose from "mongoose";

const workItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    status: {
      type: String,
      default: "todo"
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Business intelligence
    revenue: Number,
    expenses: Number,
    fundingRequired: Number,
    runwayMonths: Number,
    riskLevel: String,

    // AI audit trail
    aiSummary: String,
    lastAnalyzedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("WorkItem", workItemSchema);