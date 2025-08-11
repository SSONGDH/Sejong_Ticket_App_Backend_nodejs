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
    root: { type: Boolean, default: false }, // 시스템 전체 최고 관리자
    fcmToken: { type: String, default: null },
    affiliations: [
      {
        id: String, // 소속 ID (예: "1", "2")
        name: String, // 소속 이름 (선택)
        admin: { type: Boolean, default: false }, // 해당 소속에서의 관리자 여부
      },
    ],
    notification: { type: Boolean, default: true },
  },
  { timestamps: true }
);  

// db 연결에서 모델 생성
const User = db.model("User", userSchema);

export default User;
