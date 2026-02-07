//streakController - Manages user streaks: updating and retrieving daily activity streaks.
const User = require("../models/User");

exports.updateStreak = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    console.log("Last Active:", user.lastActive);
console.log("Streak:", user.streak);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const today = new Date();
    const todayStr = today.toLocaleDateString("en-CA"); // YYYY-MM-DD

    const lastActive = user.lastActive ? new Date(user.lastActive) : null;
    const lastActiveStr = lastActive
      ? lastActive.toLocaleDateString("en-CA")
      : null;

    let streak = user.streak || 0;

    if (lastActiveStr === todayStr) {
      // already updated today, return
    } else if (
      lastActiveStr ===
      new Date(today.setDate(today.getDate() - 1)).toLocaleDateString("en-CA")
    ) {
      // continued from yesterday
      streak += 1;
    } else {
      // missed a day
      streak = 1;
    }

    user.lastActive = new Date();
    user.streak = streak;
    await user.save();

    res.json({ streak });
  } catch (err) {
    console.error("❌ Streak update failed:", err.message);
    res.status(500).json({ error: "Failed to update streak" });
  }
};
