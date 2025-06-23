const mongoose = require("mongoose");

const mcqQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correct_option_index: { type: Number, required: true },
  explanation: { type: String },

  tags: [String],
  language: {
    type: String,
    enum: ["cpp", "java", "python"],
    required: true
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy"
  },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MCQQuestion", mcqQuestionSchema);
