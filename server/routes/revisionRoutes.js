const express = require('express');
const router = express.Router();
const { getReminderItems , getOverdueReminders, getTodayReminders, getUpcomingReminders,getRemindersByDate,updateReminder,addReminder  } = require('../controllers/revisionController');
const verifyToken = require('../middleware/verifyToken');
// GET /api/revision/reminders/:userId
router.get('/reminders/:userId',verifyToken, getReminderItems);
// GET /api/revision/overdue/:userId
router.get('/overdue/:userId', verifyToken, getOverdueReminders);
router.get('/today/:userId', verifyToken, getTodayReminders);
router.get('/upcoming/:userId', verifyToken, getUpcomingReminders);
router.get('/date/:userId/:date', verifyToken, getRemindersByDate);
router.patch('/reminders/:id', verifyToken, updateReminder);
router.post('/reminders', verifyToken, addReminder);
router.get('/reminders/:userId/by-date', verifyToken, getRemindersByDate);
module.exports = router;
