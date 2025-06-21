import express from "express";
import { paymentListController } from "../../controllers/payment/paymentListController.js";

const router = express.Router();

router.get("/list", paymentListController);

export default router;
