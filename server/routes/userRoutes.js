const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");

router.get("/test-user", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("abc123", 10); // Hashing plain password

    const dummyUser = new User({
      username: "priyanshu",
      email: "priyanshu@example.com",
      passwordHash: hashedPassword,
      preferred_language: "cpp",
      role: "user",
      joined_on: new Date("2024-06-01T12:00:00Z"),

      settings: {
        contest_frequency_days: 7,
        include_bookmarks: true,
        include_retention_questions: true
      },

      platform_usernames: {
        leetcode: "tusharLC",
        codeforces: "tusharCF",
        gfg: "tusharGFG",
        hackerrank: "tusharHR"
      },

      platforms: {
        leetcode: {
          synced: true,
          last_sync: new Date("2024-06-20T14:00:00Z")
        },
        codeforces: { synced: false },
        gfg: { synced: true },
        hackerrank: { synced: false }
      }
    });

    await dummyUser.save();
    res.send("✅ Dummy user saved to MongoDB");

  } catch (error) {
    console.error("❌ Error saving dummy user:", error);
    res.status(500).send("❌ Failed to create dummy user");
  }
});

module.exports = router;
