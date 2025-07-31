import express from "express";
import { approveAffiliationRequest } from "../../controllers/affiliation/affiliationApproveController.js";

const router = express.Router();

// 쿼리 파라미터로 받도록 경로 수정
router.post("/approve", approveAffiliationRequest);

export default router;
