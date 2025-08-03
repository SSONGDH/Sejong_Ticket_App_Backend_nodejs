import express from "express";
import multer from "multer";
import { createTicketController } from "../../controllers/ticket/createTicketController.js";

const router = express.Router();

// 이미지 저장 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/eventPlacePictures/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/createTicket",
  (req, res, next) => {
    console.log("Request received");
    next();
  },
  upload.single("eventPlacePicture"),
  (req, res, next) => {
    console.log("After multer");
    console.log("req.file:", req.file);
    res.json({ message: "Upload received" });
  }
);

export default router;
