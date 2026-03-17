import nodemailer from "nodemailer";
import "dotenv/config";

export const verifyEmail = async (token, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // App Password
      },
    });

    const verifyLink = `${process.env.FRONTEND_URL}/verify/${token}`;

    const mailOptions = {
      from: `"HOMESPACE" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Email Verification</h2>
          <p>Click the button below to verify your email:</p>
          <a 
            href="${verifyLink}"
            style="
              display: inline-block;
              padding: 10px 18px;
              background-color: #000;
              color: #fff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Verify Email
          </a>
          <p style="margin-top: 16px; font-size: 14px; color: #555;">
            If you didn’t request this, you can safely ignore this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};
