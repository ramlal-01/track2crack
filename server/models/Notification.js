const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  is_read: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ["contest", "quiz", "reminder", "error", "sync", "system"],
    default: "system"
  },
  related_contest_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contest"
  },
  created_at: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 30 // ⏱ auto-delete after 30 days
  }
});

module.exports = mongoose.model("Notification", notificationSchema);
