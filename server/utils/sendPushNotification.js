// utils/sendPushNotification.js
const admin = require("../utils/firebaseAdmin");

const sendPushNotification = async (token, notification) => {
  const message = {
    token,
    notification: {
      title: notification.title,
      body: notification.body,
    },
    data: notification.data || {},
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ Push notification sent:", response); 

  } catch (error) {
    console.error("❌ Failed to send push notification:", error);
  }
};

module.exports = sendPushNotification;
