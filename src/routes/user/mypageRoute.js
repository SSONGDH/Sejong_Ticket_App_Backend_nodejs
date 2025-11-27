import express from "express";
import {
  getMyPage,
  updateAffiliation,
} from "../../controllers/user/mypageController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/mypage", authenticate, getMyPage);

export default router;
