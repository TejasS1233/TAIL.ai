import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const Topic = mongoose.model("Topic", topicSchema);

export { Topic };
