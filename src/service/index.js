// index.js
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { ticketDB, userDB, financeDB } from "../config/db.js"; // db.js에서 export한 ticketDB, userDB, financeDB 가져오기
import authRouter from "../routes/authRoute.js";
import ticketMainRoutes from "../routes/ticketMain.js";
import ticketDetailRoutes from "../routes/ticketDetail.js";
import createTicketRoutes from "../routes/createTicket.js";
import ticketAddRoutes from "../routes/ticketAdd.js";
import ticketAddNFCRoutes from "../routes/ticketAddNFC.js";
import ticketListRoutes from "../routes/ticketList.js";
import modifyTikcetRoutes from "../routes/modifyTicket.js";
import refundRequestRoutes from "../routes/refundRequest.js";
import refundListRoutes from "../routes/refundList.js";
import refundDetailRoutes from "../routes/refundDetail.js";
import refundPermissionRoutes from "../routes/refundPermission.js";
import paymentPostRoutes from "../routes/paymentPost.js";
import paymentListRoutes from "../routes/paymentList.js";
import paymentDetailRoutes from "../routes/paymentDetail.js";
import paymentPermissionRoutes from "../routes/paymentPermission.js";
import adminConnectionRoutes from "../routes/adminConnection.js";
import fcmTokenRoutes from "../routes/fcmTokenAdd.js"; // ✅ FCM 토큰 저장 API 추가
import cronJob from "./jobs/cronJob.js"; // ✅ 크론 작업 실행

// dotenv 환경 변수 로드
dotenv.config();

cronJob(); // ✅ 크론 작업 실행 코드 추가

// ticketDB와 userDB, financeDB 연결이 성공한 후 서버 실행
ticketDB.once("open", () => {
  console.log("✅ Connected to ticketDB");

  userDB.once("open", () => {
    console.log("✅ Connected to userDB");

    financeDB.once("open", () => {
      console.log("✅ Connected to financeDB");

      // DB 연결이 성공한 후에만 서버 시작
      const app = express();
      const port = 3000;

      app.use(bodyParser.json());

      // 라우트 등록
      app.use(authRouter);
      app.use(ticketMainRoutes);
      app.use(ticketDetailRoutes);
      app.use(createTicketRoutes);
      app.use(ticketAddRoutes);
      app.use(ticketListRoutes);
      app.use(modifyTikcetRoutes);
      app.use(refundRequestRoutes);
      app.use(refundListRoutes);
      app.use(refundDetailRoutes);
      app.use(refundPermissionRoutes);
      app.use(paymentPostRoutes);
      app.use(paymentListRoutes);
      app.use(paymentDetailRoutes);
      app.use(paymentPermissionRoutes);
      app.use(adminConnectionRoutes);
      app.use(ticketAddNFCRoutes);
      app.use(fcmTokenRoutes);

      app.listen(port, () => {
        console.log(`🚀 Server is running on http://localhost:${port}`);
      });
    });

    financeDB.on("error", (err) => {
      console.error("Error connecting to financeDB:", err);
    });
  });

  userDB.on("error", (err) => {
    console.error("Error connecting to userDB:", err);
  });
});

ticketDB.on("error", (err) => {
  console.error("Error connecting to ticketDB:", err);
});
