const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, verificationURL) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD.replace(/\s/g, ""), // 🔥 IMPORTANT
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    await transporter.sendMail({
      from: `"Track2Crack" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Verify your Track2Crack account",
      html: `
        <h2>Welcome to Track2Crack 👋</h2>
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationURL}" target="_blank">Verify Email</a>
        <p>This link will expire soon. If you didn’t register, ignore this email.</p>
      `,
    });

    console.log(`✅ Verification email sent to ${email}`);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    throw new Error("Could not send verification email");
  }
};

module.exports = sendVerificationEmail;
