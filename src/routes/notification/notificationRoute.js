import express from "express";
import { toggleNotification } from "../../controllers/notification/notificationController.js";
import { authenticate } from "../../middlewares/authMiddleware.js"; // ★ 미들웨어 추가

const router = express.Router();

// [변경] 알림 설정을 바꾸려면 로그인이 되어 있어야 함
router.patch("/toggle", authenticate, toggleNotification);

export default router;
