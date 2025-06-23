import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // 이 줄이 꼭 필요합니다!!

const mongoURI = process.env.MONGO_URI;

const db = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default db;
