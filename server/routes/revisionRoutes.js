const express = require('express');
const router = express.Router();
const { getReminderItems } = require('../controllers/revisionController');
const verifyToken = require('../middleware/verifyToken');
// GET /api/revision/reminders/:userId
router.get('/reminders/:userId',verifyToken, getReminderItems);

module.exports = router;
