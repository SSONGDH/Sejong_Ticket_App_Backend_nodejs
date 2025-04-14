import mongoose from "mongoose";

// financeDB 연결
const financeDB = mongoose.createConnection(process.env.MONGO_FINANCE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 결제 스키마 정의
const paymentSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true },
    name: { type: String, required: true },
    studentId: { type: String, required: true },
    phone: { type: String, required: true },
    major: { type: String, required: true },
    paymentPicture: { type: String }, // 이미지 URL 저장
    paymentPermissionStatus: {
      type: Boolean, // bool 타입
      default: false, // 기본값을 false로 설정 (승인되지 않음)
    },
    etc: String,
  },
  { timestamps: true }
);

// 모델 생성
const Payment = financeDB.model("Payment", paymentSchema);

export default Payment;
