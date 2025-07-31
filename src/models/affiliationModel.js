import mongoose from "mongoose";
import db from "../config/db.js";

const affiliationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // 소속 이름
    membersCount: { type: Number, default: 0 }, // 멤버 수
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 관리자 유저 리스트
  },
  { timestamps: true }
);

const Affiliation = db.model("Affiliation", affiliationSchema);

export default Affiliation;
