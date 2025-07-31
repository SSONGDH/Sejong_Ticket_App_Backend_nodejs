import express from "express";
import { toggleNotification } from "../../controllers/notification/notificationController.js";

const router = express.Router();

// 알림 설정 토글
router.patch("/toggle", toggleNotification);

export default router;
