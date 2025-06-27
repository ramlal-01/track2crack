const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log("🟢 VERIFYING TOKEN:", token);
    const decoded = jwt.verify(token, "track2crack_secret_key"); // hardcoded for now
    console.log("✅ TOKEN VERIFIED", decoded);

    req.user = decoded;

    // ✅ Add this log
    console.log("➡️ Calling next()");
    next();

  } catch (err) {
    console.error("❌ JWT VERIFY ERROR:", err);
    return res.status(403).json({ message: "Invalid or expired token", error: err.message });
  }
};

module.exports = verifyToken;
