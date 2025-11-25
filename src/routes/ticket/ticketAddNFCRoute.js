import express from "express";
// import cookieParser ... (삭제)
import { ticketAddNFCController } from "../../controllers/ticket/ticketAddNFCController.js";
import { authenticate } from "../../middlewares/authMiddleware.js"; // ★ 미들웨어 추가

const router = express.Router();
// router.use(cookieParser()); (삭제)

// [변경] NFC 티켓 등록은 로그인한 유저만 가능
router.post("/addNFC", authenticate, ticketAddNFCController);

export default router;
