// index.js
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { ticketDB, userDB } from "../config/db.js"; // db.js에서 export한 ticketDB와 userDB 가져오기
import authRouter from "../routes/authRoute.js";
import ticketMainRoutes from "../routes/ticketMain.js";
import ticketDetailRoutes from "../routes/ticketDetail";
import createTicketRoutes from "../routes/createTicket.js";
import addTicketRoutes from "../routes/addTicket.js";
import ticketListRoutes from "../routes/ticketList.js";
import modifyTikcetRoutes from "../routes/modifyTicket.js";

// dotenv 환경 변수 로드
dotenv.config();

// ticketDB와 userDB 연결이 성공한 후 서버 실행
ticketDB.once("open", () => {
  console.log("✅ Connected to ticketDB");

  userDB.once("open", () => {
    console.log("✅ Connected to userDB");

    // DB 연결이 성공한 후에만 서버 시작
    const app = express();
    const port = 3000;

    app.use(bodyParser.json());

    // 라우트 등록
    app.use(authRouter);
    app.use(ticketMainRoutes);
    app.use(ticketDetailRoutes);
    app.use(createTicketRoutes);
    app.use(addTicketRoutes);
    app.use(ticketListRoutes);
    app.use(modifyTikcetRoutes);

    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  });

  userDB.on("error", (err) => {
    console.error("Error connecting to userDB:", err);
  });
});

ticketDB.on("error", (err) => {
  console.error("Error connecting to ticketDB:", err);
});
