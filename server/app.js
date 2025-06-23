const express = require("express");
const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));

// Root test route
app.get("/", (req, res) => {
  res.send("Track2Crack backend is running");
});

module.exports = app;
