const express = require('express');
const router = express.Router();
const { submitFeedback } = require('../controllers/feedbackController');

// Middleware to verify JWT token
const verifyToken = require('../middleware/verifyToken');

// POST Route with token check
router.post('/submit', verifyToken, submitFeedback);

module.exports = router;
