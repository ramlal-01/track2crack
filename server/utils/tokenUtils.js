const jwt = require('jsonwebtoken');

exports.generateTokens = (userId) => {
  // 🧪 Debug check for missing .env 

  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
 

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};
