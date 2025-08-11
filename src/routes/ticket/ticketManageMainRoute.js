import express from "express";
import { getAdminTickets } from "../../controllers/ticket/ticketManageMainController.js";

const router = express.Router();

// 관리자 소속 티켓 조회
router.get("/manageList", getAdminTickets);

export default router;
