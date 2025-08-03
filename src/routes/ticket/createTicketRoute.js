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
  upload.single("eventPlacePicture"),
  (req, res, next) => {
    console.log("Current working directory:", process.cwd());
    console.log("Uploaded file info:", req.file);
    next();
  },
  createTicketController
);
export default router;
