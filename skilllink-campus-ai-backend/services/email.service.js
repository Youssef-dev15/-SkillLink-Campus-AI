import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const link = `http://localhost:5000/api/auth/verify-email/${token}`;

  await transporter.sendMail({
    from: "SkillLink <no-reply@skilllink.com>",
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Welcome to SkillLink 👋</h2>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${link}">Verify Email</a>
    `
  });
};
