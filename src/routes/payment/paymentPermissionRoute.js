import express from "express";
import { paymentPermissionController } from "../../controllers/payment/paymentPermissionController.js";

const router = express.Router();

router.put("/permission", paymentPermissionController);

export default router;
