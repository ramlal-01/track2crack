const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', registerUser);

// ✅ Add this:
router.post('/login', loginUser);

module.exports = router;
