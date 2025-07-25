import mongoose from "mongoose";

const affiliationRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // 신청자 이름 (SSO)
    major: { type: String, required: true }, // 학과 (SSO)
    studentId: { type: String, required: true }, // 학번 (SSO)
    phone: { type: String, required: true }, // 입력 받음
    affiliationName: { type: String, required: true }, // 만들고자 하는 소속 이름
    createAffiliation: { type: Boolean, required: true },
    requestAdmin: { type: Boolean, required: true },
    comment: { type: String, default: "" }, // 비고
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const AffiliationRequest = mongoose.model(
  "AffiliationRequest",
  affiliationRequestSchema
);
export default AffiliationRequest;
