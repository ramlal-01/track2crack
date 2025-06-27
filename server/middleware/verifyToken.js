const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  // DEBUG: Hardcode secret to test
  const hardcodedSecret = "track2crack_secret_key";

  console.log("TOKEN:", token);
  console.log("SECRET:", hardcodedSecret);

  try {
    const decoded = jwt.verify(token, hardcodedSecret); // Use hardcoded secret
    req.user = decoded;
    next();
  } catch (err) {
  console.error("JWT VERIFY ERROR:", err); // full error
  return res.status(403).json({ message: "Invalid or expired token", error: err.message });
}
};

module.exports = verifyToken;
