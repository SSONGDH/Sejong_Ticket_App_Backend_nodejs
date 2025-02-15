import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { ticketDB, userDB, financeDB } from "../config/db.js"; // DB 연결 객체
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
import cronJob from "../jobs/cronJob.js"; // ✅ 크론 작업 실행

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv 환경 변수 로드
dotenv.config();

// ✅ 서버 설정
const app = express();
const port = 3000;

// ✅ 미들웨어 설정
app.use(bodyParser.json());
app.use("/eventPlacePictures", express.static(path.join(__dirname, "uploads")));
app.use("/paymentPictures", express.static(path.join(__dirname, "uploads")));

// ✅ 라우트 등록
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
// app.use(fcmTokenRoutes);

cronJob(); // ✅ 크론 작업 실행

// ✅ DB 연결 상태 확인 및 서버 실행
let dbConnectedCount = 0;
const totalDBs = 3;

const checkAndStartServer = () => {
  dbConnectedCount++;
  if (dbConnectedCount === totalDBs) {
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  }
};

// ✅ 독립적으로 DB 연결
ticketDB.once("open", () => {
  console.log("✅ Connected to ticketDB");
  checkAndStartServer();
});
ticketDB.on("error", (err) => {
  console.error("❌ Error connecting to ticketDB:", err);
});

userDB.once("open", () => {
  console.log("✅ Connected to userDB");
  checkAndStartServer();
});
userDB.on("error", (err) => {
  console.error("❌ Error connecting to userDB:", err);
});

financeDB.once("open", () => {
  console.log("✅ Connected to financeDB");
  checkAndStartServer();
});
financeDB.on("error", (err) => {
  console.error("❌ Error connecting to financeDB:", err);
});
