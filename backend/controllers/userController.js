
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../emailVerify/sendOTPMail.js";

/* ================= REGISTER ================= */


export const register = async (req, res) => {
  console.log("🔥 REGISTER CONTROLLER HIT");

  try {
    const { firstName, lastName, email, password } = req.body;

    console.log("Step 1");

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    console.log("Step 2");

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      isVerified: false,
    });

    console.log("Step 3 USER CREATED");

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    console.log("🔥 VERIFY TOKEN:", token); // IMPORTANT

    return res.status(201).json({
      success: true,
      message: "User registered",
    });

  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= VERIFY EMAIL ================= */
export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Token missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(400).json({ success: false, message: "Token expired" });
      }
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10d",
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= RE-VERIFY ================= */
export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ success: false, message: "Already verified" });

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    await verifyEmail(token, email);

    return res.status(200).json({
      success: true,
      message: "Verification email sent",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await existingUser.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (!existingUser.isVerified) {
      return res.status(400).json({ success: false, message: "Verify your email first" });
    }

    const accessToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "10d" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    // Optional session
    await Session.deleteMany({ userId: existingUser._id });
    await Session.create({ userId: existingUser._id });

    const user = await User.findById(existingUser._id).select(
      "-password -otp -otpExpiry"
    );

    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.firstName}`,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= LOGOUT ================= */
export const logout = async (req, res) => {
  try {
    const userId = req.id;

    await Session.deleteMany({ userId });

    res.clearCookie("accessToken");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTPMail(otp, email);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ success: false, message: "User not found" });

    if (!user.otp || !user.otpExpiry)
      return res.status(400).json({ success: false, message: "OTP not generated" });

    if (user.otpExpiry < new Date())
      return res.status(400).json({ success: false, message: "OTP expired" });

    if (otp !== user.otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= CHANGE PASSWORD ================= */
export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const email = req.params.email;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ success: false, message: "User not found" });

    if (!newPassword || !confirmPassword)
      return res.status(400).json({ success: false, message: "All fields required" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ success: false, message: "Passwords do not match" });

    user.password = newPassword; // ✅ pre-save hook will hash
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= ADMIN ================= */
export const allUser = async (req, res) => {
  try {
    const users = await User.find().select("-password -otp -otpExpiry");
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "-password -otp -otpExpiry"
    );

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
