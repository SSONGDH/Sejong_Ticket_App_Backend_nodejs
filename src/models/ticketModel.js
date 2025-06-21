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
    eventPlacePicture: String,
    status: String,
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Ticket = db.model("Ticket", ticketSchema);

export default Ticket;
