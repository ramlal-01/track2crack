const express = require('express');
const router = express.Router();
const {
  getTheoryTopicsBySubject,
  updateTheoryProgress,
  getUserTheoryProgress
} = require('../controllers/theoryController');

const verifyToken = require('../middleware/verifyToken'); // ✅ Import

// Public route
router.get('/topics', getTheoryTopicsBySubject);

// ✅ Protected routes
router.post('/progress', verifyToken, updateTheoryProgress);
router.get('/progress/:userId', verifyToken, getUserTheoryProgress);

module.exports = router;
