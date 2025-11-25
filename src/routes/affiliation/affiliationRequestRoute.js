import express from "express";
import { postAffiliationRequest } from "../../controllers/affiliation/affiliationRequestController.js";
import { authenticate } from "../../middlewares/authMiddleware.js"; // ★ 미들웨어 추가

const router = express.Router();

// [변경] authenticate 미들웨어 장착
router.post("/request", authenticate, postAffiliationRequest);

export default router;
