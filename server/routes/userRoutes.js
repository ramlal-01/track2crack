const express = require('express');
const router = express.Router();
const { getUserDashboard } = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');

router.get('/dashboard/:userId', verifyToken, getUserDashboard);

module.exports = router;
