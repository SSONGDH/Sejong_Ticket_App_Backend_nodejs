import express from "express";
import { getAdminTickets } from "../controllers/ticketManageMainController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// 관리자 소속 티켓 조회
router.get("/manageList", authMiddleware, getAdminTickets);

export default router;
