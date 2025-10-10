import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema(
  {
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {
    _id: true,
  }
);

const VoteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    voteType: {
      type: String,
      enum: ["upvote", "downvote"],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  }
);

const ReportSchema = new Schema(
  {
    citizenId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    category: {
      type: String,
      required: true,
      enum: ["garbage", "pothole", "streetlight", "water", "public works", "safety", "other"],
    },
    customCategory: {
      type: String,
      default: null,
    },
    department: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["submitted", "acknowledged", "assigned", "in_progress", "resolved", "rejected"],
      default: "submitted",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },
    assignedTo: {
      staffId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      assignedAt: {
        type: Date,
      },
      dueDate: {
        type: Date,
      },
      notes: {
        type: String,
      },
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    vote: {
      type: Number,
      default: 0,
    },
    votes: [VoteSchema],
    history: [
      {
        status: String,
        updatedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        notes: String,
      },
    ],
    comments: [CommentSchema],
    duplicateOf: { type: Schema.Types.ObjectId, ref: "Report", default: null },
  },
  {
    timestamps: true,
  }
);

ReportSchema.index({
  location: "2dsphere",
});

ReportSchema.index({ "votes.userId": 1 });

export const Report = mongoose.model("Report", ReportSchema);
