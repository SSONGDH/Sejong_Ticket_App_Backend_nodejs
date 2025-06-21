import express from "express";
import { addFcmToken } from "../../controllers/FCM/fcmTokenAddController.js";

const router = express.Router();

router.post("/tokenAdd", addFcmToken);

export default router;
