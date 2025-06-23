const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  created_on: {
    type: Date,
    default: Date.now
  },
  starts_at: {
    type: Date,
    required: true
  },
  ends_at: {
    type: Date,
    required: true
  },
  questions: [
    {
      question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
      },
      platform_question_id: { type: String }, // e.g., LeetCode slug
      platform: {
        type: String,
        enum: ["leetcode", "codeforces", "gfg", "hackerrank"],
        required: true
      }
    }
  ],
  status: {
    type: String,
    enum: ["pending", "running", "completed", "cancelled"],
    default: "pending"
  }
});

module.exports = mongoose.model("Contest", contestSchema);
