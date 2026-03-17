import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, cc }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Homespace Support" <${process.env.MAIL_USER}>`,
    to,
    cc, // CC yourself automatically
    subject,
    text,
  });
};
