import express from "express";
import { approveAffiliationRequest } from "../controllers/affiliationApproveController.js";

const router = express.Router();

// 승인 요청 처리 라우트
router.post("/approve/:requestId", approveAffiliationRequest);

export default router;
