import express from "express";
import multer from "multer";
import path from "path";
import cookieParser from "cookie-parser"; // ✅ 쿠키 파싱 미들웨어 추가
import Payment from "../../models/paymentModel.js"; // payment 모델 불러오기
import verifySSOService from "../../service/ssoAuth.js"; // SSO 인증 서비스

const router = express.Router();
router.use(cookieParser()); // ✅ 쿠키 사용 설정

// ✅ 이미지 업로드를 위한 multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 서버의 'uploads/' 폴더에 저장
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // 고유한 파일명 생성
  },
});

const upload = multer({ storage: storage });

// ✅ 결제 정보 저장 API
router.post(
  "/payment/paymentpost",
  upload.single("paymentPicture"),
  async (req, res) => {
    try {
      const { ticketId, phone } = req.body;

      // SSO 토큰을 쿠키에서 가져오기
      const ssotoken = req.cookies.ssotoken; // ✅ HTTP-Only 쿠키에서 SSO 토큰 가져오기

      if (!ssotoken) {
        return res.status(400).json({
          isSuccess: false,
          code: "ERROR-0001",
          message: "SSO 토큰이 없습니다.",
          result: [],
        });
      }

      // SSO 토큰을 사용하여 유저 정보 가져오기
      const userProfile = await verifySSOService.verifySSOToken(ssotoken);

      const { name, studentId, major } = userProfile;

      // 필수 데이터 확인
      if (!ticketId || !name || !studentId || !phone || !req.file) {
        return res.status(400).json({
          isSuccess: false,
          code: "ERROR-0002",
          message: "필수 데이터가 누락되었습니다.",
          result: [],
        });
      }

      // 저장된 이미지 파일 경로 생성
      const imageUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/paymentPictures${req.file.filename}`;

      // 결제 정보 생성 및 DB 저장
      const newPayment = new Payment({
        ticketId,
        name,
        studentId,
        phone,
        major, // 전공 추가
        paymentPicture: imageUrl, // DB에는 URL 저장
      });

      await newPayment.save();

      return res.status(200).json({
        isSuccess: true,
        code: "SUCCESS-0000",
        message: "납부내역이 성공적으로 저장되었습니다.",
        result: newPayment,
      });
    } catch (error) {
      console.error("❌ 결제 저장 오류:", error);
      return res.status(500).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "서버 오류",
        result: [],
      });
    }
  }
);

export default router;
