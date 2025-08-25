// route/affiliation/affiliationRequestsListRoute.js
import express from "express";
import { affiliationRequestsListController } from "../../controllers/affiliation/affiliationRequestListController.js";

const router = express.Router();

// 소속 신청 리스트 조회
router.get("/affiliationRequestsList", affiliationRequestsListController);

export default router;
