import express from "express";
// import cookieParser ... (삭제: index.js에 전역 설정됨)
import { ticketAddController } from "../../controllers/ticket/ticketAddController.js";
import { authenticate } from "../../middlewares/authMiddleware.js"; // ★ 미들웨어 추가

const router = express.Router();
// router.use(cookieParser()); (삭제)

// [변경] authenticate 미들웨어를 통과해야만(로그인 해야만) 컨트롤러가 실행됨
router.post("/add", authenticate, ticketAddController);

export default router;
