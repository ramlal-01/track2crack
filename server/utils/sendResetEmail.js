const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendResetEmail = async (email, resetURL) => {
  await resend.emails.send({
    from: "Track2Crack <no-reply@track2crack.com>",
    to: email,
    subject: "Reset your Track2Crack password",
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetURL}">${resetURL}</a>
      <p>This link expires in 15 minutes.</p>
    `,
  });

  console.log(`✅ Reset email sent to ${email}`);
};

module.exports = sendResetEmail;
