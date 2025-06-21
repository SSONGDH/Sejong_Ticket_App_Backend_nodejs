import express from "express";
import multer from "multer";
import { modifyTicketController } from "../../controllers/ticket/modifyTicketController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/eventPlacePictures/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.put(
  "/modifyTicket",
  upload.single("eventPlacePicture"),
  modifyTicketController
);

export default router;
