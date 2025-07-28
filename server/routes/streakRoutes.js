const express = require("express");
const router = express.Router();
const { updateStreak } = require("../controllers/streakController");
const verifyToken = require("../middleware/verifyToken");

router.post("/update", verifyToken, updateStreak);

module.exports = router;
