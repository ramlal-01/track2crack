const express = require('express');
const router = express.Router();
const { getAllDSAQuestions, updateDSAProgress, getUserDSAProgress } = require('../controllers/dsaController');

router.get('/questions', getAllDSAQuestions);
 
router.post('/progress', updateDSAProgress);

router.get('/progress/:userId', getUserDSAProgress);

module.exports = router;
