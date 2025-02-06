import express from "express";
import AuthService from "../service/authService.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { userId, password } = req.body;

  try {
    const userProfile = await AuthService.login(userId, password);
    res.json(userProfile);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Failed to authenticate or fetch profile" });
  }
});

export default router;
