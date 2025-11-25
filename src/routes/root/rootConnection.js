import express from "express";
import { rootConnection } from "../../controllers/root/rootConnectionController.js";
import { authenticate } from "../../middlewares/authMiddleware.js"; // ★ 미들웨어 추가

const router = express.Router();

// [변경] Root 접속 체크도 당연히 로그인이 선행되어야 함
router.get("/connection", authenticate, rootConnection);

export default router;
