const express = require("express");
const app = express();

// Middlewares
app.use(express.json());

// Routes

// 1
app.use('/api/auth', require('./routes/authRoutes'));

// app.use("/api/leetcode-submissions", require("./routes/leetcodeSubmissionFetcher"));

// Root test route
app.get("/", (req, res) => {
  res.send("Track2Crack backend is running");
});

module.exports = app;
