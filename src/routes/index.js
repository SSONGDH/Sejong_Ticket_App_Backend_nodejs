// src/routes/index.js
import express from "express";

import authRouter from "./login/authRoute.js";

import ticketMainRoutes from "./ticket/ticketMainRoute.js";
import ticketDetailRoutes from "./ticket/ticketDetailRoute.js";
import createTicketRoutes from "./ticket/createTicketRoute.js";
import ticketAddRoute from "./ticket/ticketAddRoute.js";
import ticketAddNFCRoutes from "./ticket/ticketAddNFCRoute.js";
import ticketListRoutes from "./ticket/ticketListRoute.js";
import modifyTicketRoutes from "./ticket/modifyTicketRoute.js";
import ticketRefundDetailRoutes from "./ticket/ticketRefundDetailRoute.js";
import modifyTicketDetailRoutes from "./ticket/modifyTicketDetailRoute.js";
import ticketDeleteRoutes from "./ticket/ticketDeleteRoute.js";

import refundRequestRoutes from "./refund/refundRequestRoute.js";
import refundListRoutes from "./refund/refundListRoute.js";
import refundDetailRoutes from "./refund/refundDetailRoute.js";
import refundPermissionRoutes from "./refund/refundPermissionRoute.js";
import refundDenyRoutes from "./refund/refundDenyRoute.js";

import paymentPostRoutes from "./payment/paymentPostRoute.js";
import paymentListRoutes from "./payment/paymentListRoute.js";
import paymentDetailRoutes from "./payment/paymentDetailRoute.js";
import paymentPermissionRoutes from "./payment/paymentPermissionRoute.js";
import paymentDenyRoutes from "./payment/paymentDenyRoute.js";

import adminConnectionRoutes from "./admin/adminConnection.js";
import fcmTokenRoutes from "./FCM/fcmTokenAddRoute.js";

import mypageRoutes from "./user/mypageRoute.js";
import userAffiliationUpdate from "./user/userAffiliationUpdate.js";

import affiliationRequestRoutes from "./affiliation/affiliationRequestRoute.js";

const router = express.Router();

// auth
router.use("/auth", authRouter);

// ticket
router.use("/ticket", ticketMainRoutes);
router.use("/ticket", ticketDetailRoutes);
router.use("/ticket", createTicketRoutes);
router.use("/ticket", ticketAddRoute);
router.use("/ticket", ticketAddNFCRoutes);
router.use("/ticket", ticketListRoutes);
router.use("/ticket", modifyTicketRoutes);
router.use("/ticket", ticketRefundDetailRoutes);
router.use("/ticket", modifyTicketDetailRoutes);
router.use("/ticket", ticketDeleteRoutes);

// refund
router.use("/refund", refundRequestRoutes);
router.use("/refund", refundListRoutes);
router.use("/refund", refundDetailRoutes);
router.use("/refund", refundPermissionRoutes);
router.use("/refund", refundDenyRoutes);

// payment
router.use("/payment", paymentPostRoutes);
router.use("/payment", paymentListRoutes);
router.use("/payment", paymentDetailRoutes);
router.use("/payment", paymentPermissionRoutes);
router.use("/payment", paymentDenyRoutes);

// admin
router.use("/admin", adminConnectionRoutes);

// FCM
router.use("/fcm", fcmTokenRoutes);

router.use("/user", mypageRoutes);
router.use("/user", userAffiliationUpdate);

router.post("/affiliation", affiliationRequestRoutes);

export default router;
