import express from "express";
import { Newsletter } from "../models/newsletterModel.js";
import { isAuthenticated, isAdmin } from "../middlewares/isAuthenticated.js";

import { sendWelcomeEmail } from "../utils/sendWelcomeEmail.js";

const router = express.Router();

// GET ALL SUBSCRIBERS (ADMIN ONLY)
router.get(
  "/all",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const subscribers = await Newsletter.find().sort({
        subscribedAt: -1,
      });

      res.status(200).json(subscribers);
    } catch {
      res.status(500).json({ message: "Failed to fetch subscribers" });
    }
  }
);

// SUBSCRIBE
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const exists = await Newsletter.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Already subscribed" });

    //  SAVE TO DB
    await Newsletter.create({ email });

    //  SEND WELCOME EMAIL (THIS WAS MISSING)
    await sendWelcomeEmail(email);

    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error("NEWSLETTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
