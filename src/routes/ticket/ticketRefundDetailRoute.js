import express from "express";
import { ticketRefundDetailController } from "../../controllers/ticket/ticketRefundDetailController.js";

const router = express.Router();

router.get("/ticketRefundDetail", ticketRefundDetailController);

export default router;
