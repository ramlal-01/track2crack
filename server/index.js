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


// const runReminderJob = require("./cronJobs/dailyReminderJob");

// // Manually trigger for testing
// runReminderJob(); // 🔥 Temporary — remove after verifying
 