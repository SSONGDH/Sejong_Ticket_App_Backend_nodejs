// src/routes/affiliation/affiliationRequestsListRoute.js
import express from "express";
import {
  affiliationRequestListController,
  affiliationRequestDetailController,
} from "../../controllers/affiliation/affiliationRequestListController.js";

const router = express.Router();

// 전체 소속 신청 목록 조회
// GET /affiliation/affiliationRequestsList?status=pending
router.get("/affiliationRequestsList", affiliationRequestListController);

// 특정 소속 신청 상세 조회
// GET /affiliation/affiliationRequests/:id
router.get("/affiliationRequests/:id", affiliationRequestDetailController);

export default router;
