import express from "express";
import { paymentListController } from "../../controllers/payment/paymentListController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/list", authenticate, paymentListController);

export default router;
