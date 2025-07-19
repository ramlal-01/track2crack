const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  createReminder,
  getNotifications,
  markAsSeen,
  deleteNotification
} = require("../controllers/notificationController");

// Create + send notification
router.post("/create", verifyToken, createReminder);

// Get latest 50 notifications for user
router.get("/:userId", verifyToken, getNotifications);

// Mark as seen
router.patch("/:id/mark-seen", verifyToken, markAsSeen);

// Delete notification
router.delete("/:id", verifyToken, deleteNotification);

module.exports = router;
