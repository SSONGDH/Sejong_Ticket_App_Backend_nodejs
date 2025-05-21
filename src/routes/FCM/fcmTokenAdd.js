import express from "express";
import User from "../../models/userModel.js"; // User 모델 불러오기
import verifySSOService from "../../service/ssoAuth.js"; // SSO 인증 서비스

const router = express.Router();
import cookieParser from "cookie-parser"; // 쿠키 파싱 미들웨어 추가

router.use(cookieParser()); // 쿠키 사용 설정

/**
 * ✅ FCM 토큰 저장 API
 * - 클라이언트에서 SSO 토큰과 FCM 토큰을 보내면 DB에 저장
 */
router.post("/fcm/tokenAdd", async (req, res) => {
  // ✅ 쿠키에서 SSO 토큰 가져오기
  const ssotoken = req.cookies.ssotoken;
  const { fcmToken } = req.body;

  if (!ssotoken) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0001",
      message: "SSO 토큰이 없습니다.",
    });
  }

  if (!fcmToken) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0002",
      message: "FCM 토큰이 없습니다.",
    });
  }

  try {
    const userProfile = await verifySSOService.verifySSOToken(ssotoken);

    if (!userProfile || !userProfile.studentId) {
      return res.status(401).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "SSO 인증 실패",
      });
    }

    const user = await User.findOne({ studentId: userProfile.studentId });

    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0004",
        message: "유저 정보를 찾을 수 없습니다.",
      });
    }

    user.fcmToken = fcmToken;
    await user.save();

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "FCM 토큰이 성공적으로 저장되었습니다.",
    });
  } catch (error) {
    console.error("❌ FCM 토큰 저장 중 오류 발생:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0005",
      message: "서버 오류",
    });
  }
});

export default router;
