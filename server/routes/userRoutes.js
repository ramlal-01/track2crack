const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

// ✅ POST /api/user/create-dummy → Create dummy user with hashed password
router.get('/create-dummy', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("dummy123", 10); // 👈 hash it

    const newUser = new User({
      name: "Ram Lal",
      email: "ramlal0801@gmail.com",
      password: hashedPassword,
      leetcodeUsername: "ramlal_123",
      avatarUrl: "",
      role: "user",
      isVerified: true
    });

    await newUser.save();
    res.status(201).json({ message: "✅ Dummy user created", user: newUser });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to create dummy user", details: err.message });
  }
});
module.exports = router;