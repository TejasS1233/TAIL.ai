import mongoose from "mongoose";

const threadSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    imageUrl: String,
    userName: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userRole: {
      type: String,
      enum: ["citizen", "worker", "officer", "admin"],
      required: true,
    },
    topic: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Thread", default: null },
    tags: [String],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pinned: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "hidden", "archived", "in progress", "completed", "pending review"], // Added missing statuses
      default: "active",
    },
  },
  { timestamps: true }
);

const Thread = mongoose.model("Thread", threadSchema);
export { Thread };