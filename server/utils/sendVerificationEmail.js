const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, verificationURL) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,      // 👉 your Gmail or SMTP email
        pass: process.env.SMTP_PASSWORD   // App password, not your Gmail login
      }
    });

    const mailOptions = {
      from: `Track2Crack <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your Track2Crack account',
      html: `
        <h2>Welcome to Track2Crack 👋</h2>
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationURL}" target="_blank">Verify Email</a>
        <p>This link will expire soon. If you didn’t register, ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
  } catch (err) {
    console.error('❌ Email sending failed:', err);
    throw new Error('Could not send verification email');
  }
};

module.exports = sendVerificationEmail;
