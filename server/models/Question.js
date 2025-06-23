const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  platform: { type: String, required: true }, // e.g., "leetcode", "codeforces"
  question_id: { type: String, required: true }, // platform-specific ID
  title: { type: String, required: true },
  url: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  tags: { type: [String], default: [] }, // e.g., ["DP", "Greedy"]
  language: {
    type: String,
    enum: ["cpp", "java", "python"]
  }
});

module.exports = mongoose.model("Question", questionSchema);
