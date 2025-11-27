import mongoose from "mongoose";
import db from "../config/db.js";

const paymentSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true },
    name: { type: String, required: true },
    studentId: { type: String, required: true },
    phone: { type: String, required: true },
    major: { type: String, required: true },
    paymentPicture: { type: String },
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
