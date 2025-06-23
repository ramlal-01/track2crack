const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true
  },
  bookmarked_at: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ""
  },
  tag: {
    type: String,
    enum: ["important", "doubt", "tricky", "todo", "other"],
    default: "important"
  }
});

module.exports = mongoose.model("Bookmark", bookmarkSchema);
