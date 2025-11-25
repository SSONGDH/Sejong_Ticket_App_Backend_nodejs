import express from "express";
import { refundListController } from "../../controllers/refund/refundListController.js";
import { authenticate } from "../../middlewares/authMiddleware.js"; // ★ 미들웨어 추가

const router = express.Router();

// [변경] 관리자 기능이므로 로그인이 필수입니다. authenticate 추가!
router.get("/list", authenticate, refundListController);

export default router;
