import express from "express";
import { refundListController } from "../../controllers/refund/refundListController.js";

const router = express.Router();

router.get("/list", refundListController);

export default router;
