const express = require("express");
const router = express.Router();
const User = require("../models/User");
const sendPushNotification = require("../utils/sendPushNotification");

router.get("/test-push", async (req, res) => {
  try {
    const user = await User.findOne({ email: "ramlal0801@gmail.com" }); // Or use ID

    if (!user?.fcmToken) {
      return res.status(404).json({ message: "User or FCM token not found" });
    }

    await sendPushNotification(user.fcmToken, {
      title: "Test Push",
      body: "🔔 This is a native push test",
      data: {
        link: "/dashboard/theory",
        type: "reminder",
      },
    });

    res.json({ message: "Push sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
