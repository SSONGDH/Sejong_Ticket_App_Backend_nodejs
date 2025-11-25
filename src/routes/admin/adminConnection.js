import express from "express";
import { adminConnection } from "../../controllers/admin/adminConnectionController.js";
import { authenticate } from "../../middlewares/authMiddleware.js"; // ★ 미들웨어 추가

const router = express.Router();

// [변경 핵심] 요청이 들어오면 'authenticate'가 먼저 검사하고, 통과하면 컨트롤러로 이동
router.get("/connection", authenticate, adminConnection);

export default router;
