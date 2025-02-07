import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv"; // dotenv 패키지 추가
import authRouter from "../routes/authRoute.js";
import ticketMainRoutes from "../routes/ticketMain";
import ticketDetailRoutes from "../routes/ticketDetail";
import createTicketRoutes from "../routes/createTicket.js";

// dotenv 환경 변수 로드
dotenv.config();

const app = express();
const port = 3000;

// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(bodyParser.json());
app.use(authRouter);
app.use(ticketMainRoutes);
app.use(ticketDetailRoutes);
app.use(createTicketRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
