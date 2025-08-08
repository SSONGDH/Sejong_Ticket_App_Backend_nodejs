import express from "express";
import { getAffiliationListController } from "../../controllers/affiliation/affiliationListController.js";

const router = express.Router();

// 쿼리 파라미터로 받도록 경로 수정
router.get("/List", getAffiliationListController);

export default router;
