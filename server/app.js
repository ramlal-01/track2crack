const express = require("express");
const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/leetcode", require("./routes/leetcodeFetcher")); // ✅ Added LeetCode fetch route
app.use("/api/leetcode-submissions", require("./routes/leetcodeSubmissionFetcher"));
// Root test route
app.get("/", (req, res) => {
  res.send("Track2Crack backend is running");
});

module.exports = app;
