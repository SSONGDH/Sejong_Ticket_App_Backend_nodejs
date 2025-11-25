import express from "express";
// import cookieParser ... (삭제)
import { refundRequestController } from "../../controllers/refund/refundRequestController.js";
import { authenticate } from "../../middlewares/authMiddleware.js"; // ★ 미들웨어 추가

const router = express.Router();
// router.use(cookieParser()); (삭제)

// [변경] 환불 요청은 로그인한 유저만 가능
router.post("/request", authenticate, refundRequestController);

export default router;