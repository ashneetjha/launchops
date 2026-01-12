import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String,
      required: true
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
    }
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);