require("dotenv").config();   
const express = require("express");
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
 
const allowedOrigin =
  process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL_PROD
    : process.env.FRONTEND_URL_DEV;

app.use(cors({
  origin: allowedOrigin,
  credentials: true, // Required for sending cookies
}));


// Middlewares 
app.use(express.json());
app.use(cookieParser());

// Routes

// 1
app.use('/api/auth', require('./routes/authRoutes'));

//2
app.use('/api/dsa', require('./routes/dsaRoutes'));

// 3 
app.use('/api/core', require('./routes/coreRoutes'));

// 4 , theoryRoutes 
app.use('/api/theory',  require('./routes/theoryRoutes'));

// 5 . quizRoutes 
app.use('/api/quiz', require('./routes/quizRoutes')); 

// 6.  revisionRoutes  
app.use('/api/revision', require('./routes/revisionRoutes'));

// 7. Dashboard route
app.use('/api/users', require('./routes/userRoutes'));

//8.
app.use('/api/bookmarks', require('./routes/bookmarks'));


// 9
app.use("/api/notifications", require('./routes/notificationRoutes'));

// 10. Streak route
app.use('/api/streak', require('./routes/streakRoutes'));

// 11. feedback 
app.use('/api/feedback', require('./routes/feedbackRoutes'));

// Root test route
app.get("/", (req, res) => {
  res.send("Track2Crack backend is running");
});


// 12. Ping route for uptime monitoring
app.use("/api", require("./routes/ping"));



const testRoutes = require("./routes/test");
app.use("/api/test", testRoutes);

// ✅ Start daily reminder cron job
require("./cronJobs/dailyReminderJob");  

const sendVerificationEmail = require('./utils/sendVerificationEmail');

app.get("/api/test-email", async (req, res) => {
  try {
    await sendVerificationEmail(
      "ramlakhanvims@gmail.com",
      "https://www.track2crack.com"
    );
    res.send("Email sent");
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
});

module.exports = app;
