const cron = require("node-cron");
const moment = require("moment-timezone");
const Notification = require("../models/Notification");
const User = require("../models/User");
const sendPushNotification = require("../utils/sendPushNotification");

const UserDSAProgress = require("../models/UserDSAProgress");
const UserCoreProgress = require("../models/UserCoreProgress");
const UserTheoryProgress = require("../models/UserTheoryProgress");

const runReminderJob = async () => {
  const today = moment().tz("Asia/Kolkata").startOf("day").toDate();
  console.log("🔔 Running daily reminder job at", today);

  try {
    const [dsaItems, coreItems, theoryItems] = await Promise.all([
      UserDSAProgress.find({ remindOn: { $lte: today }, isCompleted: false }).populate("questionId"),
      UserCoreProgress.find({ remindOn: { $lte: today }, isCompleted: false }).populate("coreTopicId"),
      UserTheoryProgress.find({ remindOn: { $lte: today }, isCompleted: false }).populate("topicId"),
    ]);

    const allItems = [
      ...dsaItems.map(item => ({ ...item._doc, type: "dsa", ref: item.questionId })),
      ...coreItems.map(item => ({ ...item._doc, type: "core", ref: item.coreTopicId })),
      ...theoryItems.map(item => ({ ...item._doc, type: "theory", ref: item.topicId }))
    ];

    for (const item of allItems) {
      const user = await User.findById(item.userId);
      if (!user) continue;

      let title = "Your reminder";
      let link = "/dashboard/revision-Planner";

      if (item.type === "dsa") {
        title = item.ref?.title || "DSA Question Reminder";
        link = "/dashboard/dsa";
      } else if (item.type === "core") {
        title = item.ref?.title || "Core Subject Topic Reminder";
        link = "/dashboard/core";
      } else if (item.type === "theory") {
        title = item.ref?.title || "Theory Concept Reminder";
        link = "/dashboard/theory";
      }

      // Save in MongoDB notifications collection
      await Notification.create({
        userId: user._id,
        title,
        link,
        type: "reminder",
        triggeredAt: new Date(),
        isSeen: false,
      });

      // Push notification via FCM
      if (user.fcmToken) {
        await sendPushNotification(user.fcmToken, {
          title: "Reminder Alert",
          body: `📌 ${title} is due!`,
          data: {
            link,
            type: "reminder",
          },
        });
      }
    }

    console.log("✅ Total reminders processed:", allItems.length);
  } catch (error) {
    console.error("❌ Error running reminder job:", error);
  }
};

// ⏰ Cron: Run every day at 8:00 AM IST
cron.schedule("0 8 * * *", runReminderJob, {
  timezone: "Asia/Kolkata",
});

module.exports = runReminderJob;
