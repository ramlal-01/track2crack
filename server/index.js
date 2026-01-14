require("dotenv").config(); // ✅ Load .env variables
const app = require("./app");
const connectDB = require("./config/db"); 

// Use PORT from environment or default to 3000
const PORT = process.env.PORT || 5000;

// Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

const cleanupExpiredResetTokens = require('./cronJobs/cleanupResetTokens');
cleanupExpiredResetTokens(); // 🔁 Start the cron job

const sendVerificationEmail = require('./utils/sendVerificationEmail');

app.get("/api/test-email", async (req, res) => {
  try {
    await sendVerificationEmail(
      "ramlal0801@gmail.com",
      "https://www.track2crack.com"
    );
    res.send("Email sent");
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
});

// const runReminderJob = require("./cronJobs/dailyReminderJob");

// // Manually trigger for testing
// runReminderJob(); // 🔥 Temporary — remove after verifying

 
