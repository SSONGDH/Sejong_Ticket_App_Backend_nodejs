import express from "express";
import multer from "multer";
import cookieParser from "cookie-parser";
import { paymentPostController } from "../../controllers/payment/paymentPostController.js";

const router = express.Router();
router.use(cookieParser());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/paymentPictures");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/post", upload.single("paymentPicture"), paymentPostController);

export default router;
