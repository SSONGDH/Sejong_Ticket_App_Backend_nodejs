// db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

// dotenv 환경 변수 로드
dotenv.config();

// ticketDB와 userDB에 각각 연결하기 위한 URI 환경 변수
const MONGO_TICKET_URI = process.env.MONGO_TICKET_URI;
const MONGO_USER_URI = process.env.MONGO_USER_URI;
const MONGO_FINANCE_URI = process.env.MONGO_FINANCE_URI;

// ticketDB 연결 설정
const ticketDB = mongoose.createConnection(MONGO_TICKET_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// userDB 연결 설정
const userDB = mongoose.createConnection(MONGO_USER_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const financeDB = mongoose.createConnection(MONGO_FINANCE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// DB 객체 export
export { ticketDB, userDB, financeDB };
