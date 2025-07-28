const nodemailer = require('nodemailer');

const sendResetEmail = async (email, resetURL) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or SMTP config if you're using domain mail
    auth: {
      user: process.env.SMTP_EMAIL,      // 👉 your Gmail or SMTP email
      pass: process.env.SMTP_PASSWORD    // 👉 app password or SMTP key
    }
  });

  const mailOptions = {
    from: '"Track2Crack Support" <no-reply@track2crack.com>',
    to: email,
    subject: 'Reset your Track2Crack password',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <a href="${resetURL}" style="color: blue;">${resetURL}</a>
        <p>This link will expire in 15 minutes. If you didn’t request this, just ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;
