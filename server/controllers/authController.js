require('dotenv').config(); // ⬅ force .env loading

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendResetEmail = require('../utils/sendResetEmail');
const sendVerificationEmail = require('../utils/sendVerificationEmail');
const { generateTokens } = require('../utils/tokenUtils');

const FRONTEND_URL = process.env.USE_PROD_URL === "true"
  ? process.env.FRONTEND_URL_PROD
  : process.env.FRONTEND_URL_DEV;


// POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiry = Date.now() + 15 * 60 * 1000; // 15 min

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      isVerified: false,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: expiry
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
 
    const encodedToken = encodeURIComponent(rawToken);
    const verificationURL = `${FRONTEND_URL}/verify-email/${encodedToken}`;

    
    sendVerificationEmail(email, verificationURL).catch(err =>
      console.error("Email send failed:", err.message)
    );
 
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      },
      token
    });

     

  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'   
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken, // still send access token in body
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};


// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ message: 'Reset link sent if email exists' });
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiry = Date.now() + 15 * 60 * 1000;

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = expiry;
  await user.save();

  const resetURL = `${FRONTEND_URL}/reset-password/${rawToken}`;
  await sendResetEmail(email, resetURL);

  res.status(200).json({ message: 'Reset link sent if email exists' });
};

// POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successful. You can now log in.' });
};

// GET /api/auth/verify-email/:token
exports.verifyEmail = async (req, res) => {
  const rawToken = decodeURIComponent(req.params.token);
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  try {
    const user = await User.findOne({ emailVerificationToken: hashedToken });

    // Token not found and user not verified
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link' });
    }

    // User already verified (even if token is cleared)
    if (user.isVerified) {
      return res.status(200).json({ message: 'Email already verified', alreadyVerified: true });
    }

    // Token expired
    if (user.emailVerificationExpires < Date.now()) {
      return res.status(400).json({ message: 'Verification link expired' });
    }

    // Proceed to verify
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    console.log("✅ Verifying user:", user.email);

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
};


exports.resendVerification = async (req, res) => {
  const { email } = req.body;
  console.log("🔁 Resend requested for:", email);

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    console.log("❌ User not found");
    return res.status(404).json({ message: "User not found" });
  }

  if (user.isVerified) {
    console.log("✅ Already verified");
    return res.status(400).json({ message: "Email is already verified" });
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiry = Date.now() + 15 * 60 * 1000;

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = expiry;
  await user.save();

  const verificationURL = `${FRONTEND_URL}/verify-email/${encodeURIComponent(rawToken)}`;
  console.log("📧 Sending verification to:", email);
  console.log("🔗 Link:", verificationURL);

  await sendVerificationEmail(email, verificationURL);

  res.status(200).json({ message: "Verification email resent successfully" });
};




// POST /api/auth/social-login
exports.socialLogin = async (req, res) => {
  try {
    const { email, uid, name, provider, avatarUrl, emailVerified } = req.body;

    if (!email || !uid || !provider) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name: name || 'No Name',
        email,
        avatarUrl: avatarUrl || '',
        isVerified: emailVerified || false,
        password: crypto.randomBytes(32).toString("hex"),
        username: email.split('@')[0] + Math.floor(Math.random() * 10000),
      });
      await user.save();
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'  // << universal scope
    });

    res.json({
      message: "Social login successful",
      user,
      accessToken,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// GET /api/auth/refresh 
exports.refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.status(200).json({ token: accessToken });

  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

