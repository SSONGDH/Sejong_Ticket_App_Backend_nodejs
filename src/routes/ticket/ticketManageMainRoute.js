import express from "express";
import { getAdminTickets } from "../../controllers/ticket/ticketManageMainController.js";
import { authenticate } from "../../middlewares/authMiddleware.js"; // ★ 미들웨어 추가

const router = express.Router();

// [변경] 관리자 메뉴 접근이므로 로그인 필수
router.get("/manageList", authenticate, getAdminTickets);

export default router;
