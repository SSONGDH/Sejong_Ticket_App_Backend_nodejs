import mongoose from "mongoose";
import db from "../config/db.js";

const affiliationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // 소속 이름
    membersCount: { type: Number, default: 0 }, // 멤버 수
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 모든 멤버
  },
  { timestamps: true }
);

const Affiliation = db.model("Affiliation", affiliationSchema);

export default Affiliation;
