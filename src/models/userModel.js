import mongoose from "mongoose";
import db from "../config/db.js";

const userSchema = new mongoose.Schema(
  {
    name: String,
    studentId: String,
    major: String,
    gradeLevel: String,
    tickets: [String],
    refunds: [String],
    root: { type: Boolean, default: false },
    fcmToken: { type: String, default: null },
    affiliations: [
      {
        name: String,
        admin: { type: Boolean, default: false },
      },
    ],
    notification: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = db.model("User", userSchema);

export default User;
