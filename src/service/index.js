import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors"; // CORS 미들웨어 추가
import { ticketDB, userDB, financeDB } from "../config/db.js"; // DB 연결 객체
import authRouter from "../routes/login/authRoute.js";
import ticketMainRoutes from "../routes/ticket/ticketMain.js";
import ticketDetailRoutes from "../routes/ticket/ticketDetail.js";
import createTicketRoutes from "../routes/ticket/createTicket.js";
import ticketAddRoutes from "../routes/ticket/ticketAdd.js";
import ticketAddNFCRoutes from "../routes/ticket/ticketAddNFC.js";
import ticketListRoutes from "../routes/ticket/ticketList.js";
import modifyTikcetRoutes from "../routes/ticket/modifyTicket.js";
import refundRequestRoutes from "../routes/refund/refundRequest.js";
import refundListRoutes from "../routes/refund/refundList.js";
import refundDetailRoutes from "../routes/refund/refundDetail.js";
import refundPermissionRoutes from "../routes/refund/refundPermission.js";
import paymentPostRoutes from "../routes/payment/paymentPost.js";
import paymentListRoutes from "../routes/payment/paymentList.js";
import paymentDetailRoutes from "../routes/payment/paymentDetail.js";
import paymentPermissionRoutes from "../routes/payment/paymentPermission.js";
import adminConnectionRoutes from "../routes/admin/adminConnection.js";
import refundDenyRoutes from "../routes/refund/refundDeny.js";
import paymentDenyRoutes from "../routes/payment/paymentDeny.js";
import ticketRefundDetailRoutes from "../routes/ticket/ticketRefundDetail.js";
import modifyTicketDetailRoutes from "../routes/ticket/modifyTicketDetail.js";
import ticketDeleteRoutes from "../routes/ticket/ticketDelete.js";
import fcmTokenRoutes from "../routes/FCM/fcmTokenAdd.js"; // ✅ FCM 토큰 저장 API 추가
import cronJob from "../jobs/cronJob.js"; // ✅ 크론 작업 실행
import cookieParser from "cookie-parser"; // 쿠키 파서 미들웨어
import { swaggerUi, specs } from "../../swagger/swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//console.log("✅ Swagger apis 경로:", path.join(__dirname, "../routes/**/*.js"));

// dotenv 환경 변수 로드
dotenv.config();

// ✅ 서버 설정
const app = express();
const port = 3000;

// ✅ CORS 설정
app.use(cors()); // 모든 도메인에서의 요청 허용

// ✅ 미들웨어 설정
app.use(bodyParser.json());

app.use(
  "/eventUploads",
  express.static(
    path.join(__dirname, "..", "..", "uploads", "eventPlacePictures")
  )
);

app.use(
  "/paymentPictures",
  express.static(path.join(__dirname, "..", "..", "uploads", "paymentPictures"))
);

app.use(cookieParser()); // cookie-parser 미들웨어 사용
// ✅ Swagger 라우트 설정
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

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
app.use(refundDenyRoutes);
app.use(paymentDenyRoutes);
app.use(ticketRefundDetailRoutes);
app.use(modifyTicketDetailRoutes);
app.use(ticketDeleteRoutes);
app.use(fcmTokenRoutes);

cronJob(); // ✅ 크론 작업 실행

// ✅ 서버 시작
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);

  // DB 연결 시도
  connectToDatabases();
});

// ✅ DB 연결 함수
const connectToDatabases = () => {
  // ticketDB 연결
  ticketDB.once("open", () => {
    console.log("✅ Connected to ticketDB");
  });
  ticketDB.on("error", (err) => {
    console.error("❌ Error connecting to ticketDB:", err);
  });

  // userDB 연결
  userDB.once("open", () => {
    console.log("✅ Connected to userDB");
  });
  userDB.on("error", (err) => {
    console.error("❌ Error connecting to userDB:", err);
  });

  // financeDB 연결
  financeDB.once("open", () => {
    console.log("✅ Connected to financeDB");
  });
  financeDB.on("error", (err) => {
    console.error("❌ Error connecting to financeDB:", err);
  });
};
