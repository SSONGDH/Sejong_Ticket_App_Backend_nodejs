import express from "express";
import { approveAffiliationList } from "../../controllers/affiliation/affiliationListController.js";

const router = express.Router();

// 쿼리 파라미터로 받도록 경로 수정
router.post("/List", approveAffiliationList);

export default router;
