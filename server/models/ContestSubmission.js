const mongoose = require("mongoose");

const contestSubmissionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  contest_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contest",
    required: true
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true
  },
  platform_question_id: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ["leetcode", "codeforces", "gfg", "hackerrank"],
    required: true
  },
  tags: [String],

  status: {
    type: String,
    enum: [
      "Not Attempted",
      "Accepted",
      "Wrong Answer",
      "Time Limit Exceeded",
      "Runtime Error",
      "Compilation Error"
    ],
    default: "Not Attempted"
  },

  solved: { type: Boolean, default: false },
  solved_in_time: { type: Boolean, default: false },

  submission_time: Date,
  time_taken_seconds: Number,
  opened_at: Date
});

module.exports = mongoose.model("ContestSubmission", contestSubmissionSchema);
