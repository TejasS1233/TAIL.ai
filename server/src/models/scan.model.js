import mongoose, { Schema } from 'mongoose';

const scanSchema = new Schema(
  {
    filename: { type: String, required: true },
    path: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resourceId: { type: String },
    verdict: { type: String, enum: ['clean', 'suspicious', 'malicious', 'unknown'], default: 'unknown' },
    raw: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Scan = mongoose.models.Scan || mongoose.model('Scan', scanSchema);
