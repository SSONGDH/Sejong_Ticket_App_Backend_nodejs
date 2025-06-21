import mongoose from "mongoose";
import db from "../config/db.js"; // 단일 통합 DB 연결 import

const paymentSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true },
    name: { type: String, required: true },
    studentId: { type: String, required: true },
    phone: { type: String, required: true },
    major: { type: String, required: true },
    paymentPicture: { type: String }, // 이미지 URL 저장
    paymentPermissionStatus: {
      type: Boolean,
      default: false,
    },
    etc: String,
  },
  { timestamps: true }
);

const Payment = db.model("Payment", paymentSchema);

export default Payment;
