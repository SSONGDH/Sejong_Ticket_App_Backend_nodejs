import express from "express";
import cookieParser from "cookie-parser";
import { refundRequestController } from "../../controllers/refund/refundRequestController.js";

const router = express.Router();
router.use(cookieParser());

router.post("/request", refundRequestController);

export default router;
