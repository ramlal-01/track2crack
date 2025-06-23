const mongoose = require("mongoose");

const contestResultSchema = new mongoose.Schema({
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
  score: Number,
  total_questions: Number,
  accuracy: Number,
  avg_time_per_question: Number,
  fastest_topic: String,
  most_struggled_topic: String,
  consistency_score: Number
});

module.exports = mongoose.model("ContestResult", contestResultSchema);
