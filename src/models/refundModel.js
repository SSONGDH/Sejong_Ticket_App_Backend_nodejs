import mongoose from "mongoose";

// financeDB에 연결하기 위한 연결 객체 생성
const financeDB = mongoose.createConnection(process.env.MONGO_FINANCE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// refundSchema에서 _id는 그대로 두고 ticketId 추가
const refundSchema = new mongoose.Schema(
  {
    ticketId: {
      // 중복 가능한 ticketId 추가
      type: String,
      required: true, // 필수 항목
    },
    name: {
      type: String,
      required: true, // 필수 항목
    },
    studentId: {
      type: String,
      required: true, // 필수 항목
    },
    phone: {
      type: String,
      required: true, // 필수 항목
    },
    refundReason: {
      type: String,
      required: true, // 필수 항목
    },
    visitDate: {
      type: String,
      required: true, // 필수 항목
    },
    visitTime: {
      type: String,
      required: true, // 필수 항목
    },
    refundPermissionStatus: {
      type: Boolean, // bool 타입
      default: false, // 기본값을 false로 설정 (승인되지 않음)
    },
  },
  { timestamps: true }
);

// refund 모델 생성
const Refund = financeDB.model("Refund", refundSchema);

export default Refund;
