import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPMail = async (otp, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,   // Gmail
        pass: process.env.MAIL_PASS,   // Gmail App Password
      }
    });

    const mailConfigurations = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <p>Your OTP for password reset is: <b>${otp}</b></p>
        <p>This OTP expires in 10 minutes.</p>
      `,
    };

    const info = await transporter.sendMail(mailConfigurations);
    console.log("OTP Sent Successfully:", info.response || info);
    return info;

  } catch (error) {
    console.error(" sendOTPMail error:", error);
    throw new Error("Failed to send OTP email");
  }
};
