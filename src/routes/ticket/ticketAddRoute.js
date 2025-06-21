import express from "express";
import cookieParser from "cookie-parser";
import { ticketAddController } from "../../controllers/ticket/ticketAddController.js";

const router = express.Router();
router.use(cookieParser());

router.post("/add", ticketAddController);

export default router;
