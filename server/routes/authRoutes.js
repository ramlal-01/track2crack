const express = require('express');
const router = express.Router();
const { registerUser, loginUser , forgotPassword, resetPassword ,verifyEmail,resendVerification ,socialLogin , refreshToken} = require('../controllers/authController');
const { forgotPasswordLimiter } = require('../middleware/rateLimiter');
// POST /api/auth/register
router.post('/register', registerUser);

// ✅ Add this:
router.post('/login', loginUser);


// ✅ Forgot Password (send reset link)
router.post('/forgot-password',forgotPasswordLimiter, forgotPassword);

// ✅ Reset Password (use token)
router.post('/reset-password/:token', resetPassword);

router.get('/verify-email/:token', verifyEmail);

router.post('/resend-verification' , resendVerification);

// New route for social login
router.post('/social-login', socialLogin);


router.get('/refresh', refreshToken);
module.exports = router;
