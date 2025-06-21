import mongoose from "mongoose";
import db from "../config/db.js"; // 통합 DB 연결 import

const refundSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    major: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    refundReason: {
      type: String,
      required: true,
    },
    visitDate: {
      type: String,
      required: true,
    },
    visitTime: {
      type: String,
      required: true,
    },
    refundPermissionStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Refund = db.model("Refund", refundSchema);

export default Refund;
