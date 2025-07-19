const path = require('path');
const express = require("express");
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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
// Root test route
app.get("/", (req, res) => {
  res.send("Track2Crack backend is running");
});


const testRoutes = require("./routes/test");
app.use("/api/test", testRoutes);

// ✅ Start daily reminder cron job
require("./cronJobs/dailyReminderJob");  

module.exports = app;
