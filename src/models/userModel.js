import mongoose from "mongoose";
import db from "../config/db.js"; // 통합 DB 연결 import

const userSchema = new mongoose.Schema(
  {
    name: String,
    studentId: String,
    major: String,
    gradeLevel: String,
    tickets: [String],
    refunds: [String],
    admin: { type: Boolean, default: false },
    fcmToken: { type: String, default: null },
  },
  { timestamps: true }
);

// db 연결에서 모델 생성
const User = db.model("User", userSchema);

export default User;
