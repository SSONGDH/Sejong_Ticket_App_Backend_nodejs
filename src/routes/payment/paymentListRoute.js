import express from "express";
import { paymentListController } from "../../controllers/payment/paymentListController.js";
import { authenticate } from "../../middlewares/authMiddleware.js"; // ★ 미들웨어 추가

const router = express.Router();

// [변경] 관리자 기능이므로 로그인이 필수입니다. authenticate 추가!
router.get("/list", authenticate, paymentListController);

export default router;
