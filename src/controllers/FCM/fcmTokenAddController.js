import { saveFcmToken } from "../../services/FCM/fcmTokenService.js";
import verifySSOService from "../../services/ssoAuth.js";

export const addFcmToken = async (req, res) => {
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

    const result = await saveFcmToken(userProfile.studentId, fcmToken);

    if (!result) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0004",
        message: "유저 정보를 찾을 수 없습니다.",
      });
    }

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
};
