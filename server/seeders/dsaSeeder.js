// seeders/dsaSeeder.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/db"); // Your existing DB config
const DSAQuestion = require("../models/DSAQuestion"); // Your schema
const data = require("../data/dsa.json"); // Formatted data

dotenv.config();

(async () => {
  try {
    await connectDB(); // Connect to MongoDB Atlas
    console.log("🌐 MongoDB Connected");

    await DSAQuestion.deleteMany(); // Optional: clear old data
    await DSAQuestion.insertMany(data); // Insert new data

    console.log(`✅ Seeded ${data.length} DSA questions`);
    process.exit();
  } catch (err) {
    console.error("❌ Seeding Failed:", err);
    process.exit(1);
  }
})();
