const cron = require('node-cron');
const User = require('../models/User');

const cleanupExpiredResetTokens = () => {
  cron.schedule('*/15 * * * *', async () => {
    console.log('⏰ CRON job running at', new Date().toISOString());

    try {
      const result = await User.updateMany(
        {
          resetPasswordExpires: { $lt: Date.now() },
          resetPasswordToken: { $ne: null }
        },
        {
          $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 }
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ Expired reset tokens cleaned: ${result.modifiedCount}`);
      }
    } catch (err) {
      console.error('❌ Error during reset token cleanup:', err.message);
    }
  });
};

module.exports = cleanupExpiredResetTokens;
