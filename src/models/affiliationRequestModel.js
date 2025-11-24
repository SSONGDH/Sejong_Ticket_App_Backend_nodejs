import mongoose from "mongoose";
import db from "../config/db.js";

const affiliationRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // 신청자 이름 (SSO)
    major: { type: String, required: true }, // 학과 (SSO)
    studentId: { type: String, required: true }, // 학번 (SSO)
    phone: { type: String, required: true }, // 입력 받음
    affiliationName: { type: String, required: true }, // 만들고자 하는 소속 이름
    createAffiliation: { type: Boolean, required: true },
    requestAdmin: { type: Boolean, required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // 📌 root에게 알림을 보냈는지 여부
    adminNotified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AffiliationRequest = db.model(
  "AffiliationRequest",
  affiliationRequestSchema
);

export default AffiliationRequest;
