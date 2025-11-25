import express from "express";
import { addFcmToken } from "../../controllers/FCM/fcmTokenAddController.js";
import { authenticate } from "../../middlewares/authMiddleware.js"; // ★ 미들웨어 추가

const router = express.Router();

// [변경] 로그인한 유저만 토큰을 등록할 수 있음
router.post("/tokenAdd", authenticate, addFcmToken);

export default router;
