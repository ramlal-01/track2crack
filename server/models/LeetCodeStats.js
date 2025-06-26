// models/LeetCodeStats.js
const mongoose = require('mongoose');

const leetCodeStatsSchema = new mongoose.Schema({
  user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    platform: {
      type: String,
      enum: ["leetcode"],
      required: true
    },
    platform_question_id: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error", "Compilation Error"],
      required: true
    },
    submitted_at: {
      type: Date,
      required: true
    },
    language: {
      type: String,
      enum: ["cpp", "java", "python"],
      required: true
    },
    tags: [String] // E.g., ["DP", "Greedy"]
});

module.exports = mongoose.model('LeetCodeStats', leetCodeStatsSchema);
