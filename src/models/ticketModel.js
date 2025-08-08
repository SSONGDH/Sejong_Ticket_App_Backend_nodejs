import mongoose from "mongoose";
import db from "../config/db.js"; // 통합 DB 연결 import

const ticketSchema = new mongoose.Schema(
  {
    eventTitle: String,
    eventDay: String,
    eventStartTime: String,
    eventEndTime: String,
    eventPlace: String,
    eventPlaceComment: String,
    eventComment: String,
    eventCode: String,
    status: String,
    affiliation: {
      type: String,
      required: true,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    kakaoPlace: {
      place_name: String,
      address_name: String,
      x: String, // 또는 Number로 저장하고 싶으면 Number로 변경 가능
      y: String,
    },
  },
  { timestamps: true }
);

const Ticket = db.model("Ticket", ticketSchema);

export default Ticket;
