const Notification = require("../models/Notification");
const User = require("../models/User");
const admin = require("../utils/firebaseAdmin");

// 📌 1. Create reminder + send FCM
exports.createReminder = async (req, res) => {
  const { userId, title, link } = req.body;

  try {
    const newNotification = new Notification({
      userId,
      title,
      link,
      type: "reminder"
    });
    await newNotification.save();

    const user = await User.findById(userId);
    if (user?.fcmToken) {
      await admin.messaging().send({
        token: user.fcmToken,
        notification: {
          title: "Reminder Alert",
          body: `Your reminder for ${title} is due!`,
        },
        data: {
          link: link || "/",
          type: "reminder"
        }
      });
    }

    res.status(201).json({ message: "Reminder created and notification sent!" });
  } catch (error) {
    console.error("Reminder error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📥 2. Get notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ triggeredAt: -1 })
      .limit(50);

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 👁️ 3. Mark one as seen
exports.markAsSeen = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isSeen: true });
    res.status(200).json({ message: "Marked as seen" });
  } catch (err) {
    console.error("Mark seen error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🗑️ 4. Delete one
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
