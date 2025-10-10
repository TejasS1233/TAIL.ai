import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["reportUpdate", "assignment", "reminder", "system"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedReportId: {
      type: Schema.Types.ObjectId,
      ref: "Report",
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model("Notification", NotificationSchema);