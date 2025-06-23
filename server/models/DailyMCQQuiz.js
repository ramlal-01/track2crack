const mongoose = require("mongoose");

const dailyMCQQuizSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  date: {
    type: String,
    required: true,
    default: () => {
      const today = new Date();
      return today.toISOString().split("T")[0];
    }
  },

  language: {
    type: String,
    enum: ["cpp", "java", "python"],
    required: true
  },

  questions: [
    {
      question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MCQQuestion",
        required: true
      },
      selected_option_index: { type: Number },
      is_correct: { type: Boolean }
    }
  ],

  score: {
    type: Number,
    default: 0
  },

  completed: {
    type: Boolean,
    default: false
  },

  submitted_at: {
    type: Date
  }
});

module.exports = mongoose.model("DailyMCQQuiz", dailyMCQQuizSchema);
