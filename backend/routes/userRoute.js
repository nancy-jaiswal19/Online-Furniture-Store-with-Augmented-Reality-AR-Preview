
import express from "express";
import { User } from "../models/userModel.js";
import { isAuthenticated, isAdmin } from "../middlewares/isAuthenticated.js";
import {
  register,
  verify,
  reVerify,
  login,
  logout,
  forgotPassword,
  verifyOTP,
  changePassword,
  allUser,
  getUserById,
} from "../controllers/userController.js";

const router = express.Router();

/* ================= AUTH ================= */
router.post("/register", register);
router.post("/verify", verify);
router.post("/reVerify", reVerify);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);

/* ================= PROFILE ================= */

// Get current user
router.get("/me", isAuthenticated, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// Update basic info
router.put("/update", isAuthenticated, async (req, res) => {
  try {
    const { firstName, lastName, phoneNo } = req.body;

    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ success: false, message: "First name and last name required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phoneNo },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update address
router.put("/address", isAuthenticated, async (req, res) => {
  try {
    const { address, city, zipCode } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { address, city, zipCode },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Change password
router.put("/change-password", isAuthenticated, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect current password" });
    }

    user.password = newPassword; // pre-save hook will hash
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ================= ADMIN ================= */

// Get all users
router.get("/all-users", isAuthenticated, isAdmin, allUser);

// Get single user
router.get(
  "/get-user/:userId",
  isAuthenticated,
  isAdmin,
  getUserById
);

export default router;

