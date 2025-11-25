import express from "express";
import { getNotificationStatus } from "../../controllers/user/notificationStatusController.js";
import { authenticate } from "../../middlewares/authMiddleware.js"; // ★ 미들웨어 추가

const router = express.Router();

// [변경] 알림 설정 확인은 로그인 필수
router.get("/setting", authenticate, getNotificationStatus);

export default router;
