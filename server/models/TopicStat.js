const mongoose = require("mongoose");

const topicStatSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic_name: { type: String, required: true },
  total_attempted: { type: Number, default: 0 },
  total_correct: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  last_updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TopicStat", topicStatSchema);
