const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  getUserDashboard,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  changePassword,
  deleteAccount
} = require('../controllers/userController');
const upload = require('../middleware/multerConfig');
// Already existing
router.get('/dashboard/:userId', verifyToken, getUserDashboard);

// New: Profile View
router.get('/profile/:userId', verifyToken, getUserProfile);

// New: Profile Edit
router.put('/profile/:userId', verifyToken, updateUserProfile);

// New (Optional): Avatar Upload
router.post('/avatar/:userId',verifyToken, upload.single('avatar'),uploadAvatar);


router.post("/change-password", verifyToken, changePassword);

router.delete("/:userId", verifyToken, deleteAccount);

module.exports = router;
