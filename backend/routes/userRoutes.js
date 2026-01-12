import express from "express";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

/* ================================
   GET current user profile
================================ */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("name email createdAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("GET /me error:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

/* ================================
   Change password
================================ */
router.post("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    user.passwordHash = newHash;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Failed to change password" });
  }
});

export default router;