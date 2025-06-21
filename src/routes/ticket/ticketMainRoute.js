import express from "express";
import cookieParser from "cookie-parser";
import { ticketMainController } from "../../controllers/ticket/ticketMainController.js";

const router = express.Router();
router.use(cookieParser());

router.get("/main", ticketMainController);

export default router;
