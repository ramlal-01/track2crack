const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, verificationURL) => {
  await resend.emails.send({
    from: "Track2Crack <no-reply@track2crack.com>",
    to: email,
    subject: "Verify your Track2Crack account",
    html: `
      <h2>Welcome to Track2Crack 👋</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationURL}">${verificationURL}</a>
      <p>If you didn’t create an account, ignore this email.</p>
    `,
  });

  console.log(`✅ Verification email sent to ${email}`);
};

module.exports = sendVerificationEmail;
