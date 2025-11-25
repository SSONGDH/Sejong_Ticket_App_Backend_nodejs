import express from "express";
// import cookieParser ... (삭제: src/index.js에 전역 설정 되어 있음)
import { ticketMainController } from "../../controllers/ticket/ticketMainController.js";
import { authenticate } from "../../middlewares/authMiddleware.js"; // ★ 미들웨어 추가

const router = express.Router();
// router.use(cookieParser()); (삭제)

// [변경] 내 티켓 목록을 보려면 로그인이 필요함
router.get("/main", authenticate, ticketMainController);

export default router;
