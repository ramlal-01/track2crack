const express = require('express');
const router = express.Router();
const { getTheoryTopicsBySubject,  updateTheoryProgress, getUserTheoryProgress } = require('../controllers/theoryController')
// GET /api/theory/topics?subject=DSA

router.get('/topics', getTheoryTopicsBySubject);
router.post('/progress', updateTheoryProgress); 
router.get('/progress/:userId', getUserTheoryProgress);
module.exports = router;
