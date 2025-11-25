import express from "express";
import multer from "multer";
// import cookieParser ... (삭제: JWT는 헤더를 쓰므로 불필요)
import { paymentPostController } from "../../controllers/payment/paymentPostController.js";
import { authenticate } from "../../middlewares/authMiddleware.js"; // ★ 미들웨어 추가

const router = express.Router();
// router.use(cookieParser()); (삭제)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/paymentPictures");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// [변경] 순서 중요!
// 1. authenticate (로그인 확인) -> 2. upload (이미지 저장) -> 3. controller (DB 저장)
router.post(
  "/post",
  authenticate,
  upload.single("paymentPicture"),
  paymentPostController
);

export default router;
