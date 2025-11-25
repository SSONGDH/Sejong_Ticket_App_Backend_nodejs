import express from "express";
import { getMyAdminAffilliaions } from "../../controllers/user/adminAffiliationController.js";
import { authenticate } from "../../middlewares/authMiddleware.js"; // ★ 미들웨어 추가

const router = express.Router();

// [변경] 관리자 소속 조회는 당연히 로그인 필요
router.get("/adminAffilliation/list", authenticate, getMyAdminAffilliaions);

export default router;
