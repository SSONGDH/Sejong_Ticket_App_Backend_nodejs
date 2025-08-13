import express from "express";
import { getNotificationStatus } from "../../controllers/user/notificationStatusController.js";

const router = express.Router();

router.get("/setting", getNotificationStatus);

export default router;

getNotificationStatus;
