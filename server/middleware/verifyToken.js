const jwt = require('jsonwebtoken');
require('dotenv').config(); // ⬅ force .env loading

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; 

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("⛔ No token provided or wrong format");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    req.user = {
      userId: decoded.userId
    };
    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message); // ✅ Step 4: Log verification failure
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
