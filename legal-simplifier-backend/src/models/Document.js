import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    name: String,
    text: String,
    summary: String,
    queryCount: { type: Number, default: 0 },
    summaryCount: { type: Number, default: 0 },
    fileUrl: { type: String, required: true },
    isLegal: {
      type: Boolean,
      default: true
    },
    chunks: [
      {
        text: String,
        embedding: [Number],
      }
    ],
  },

  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);