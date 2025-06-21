import express from "express";
import cookieParser from "cookie-parser";
import { ticketAddNFCController } from "../../controllers/ticket/ticketAddNFCController.js";

const router = express.Router();
router.use(cookieParser());

router.post("/addNFC", ticketAddNFCController);

export default router;
