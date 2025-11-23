// Notification Model-Defines the schema for user notifications
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String, // e.g., "reminder", "quiz", etc.
    default: "reminder",
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
  triggeredAt: {
    type: Date,
    default: Date.now,
  },
  link: {
    type: String, // optional → to redirect user when clicked
  }
});

module.exports = mongoose.model("Notification", notificationSchema);
