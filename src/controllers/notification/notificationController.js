import { toggleNotificationSetting } from "../../services/notification/notificationService.js";
import verifySSOService from "../../services/ssoAuth.js"; // ssotoken 검증용

export const toggleNotification = async (req, res) => {
  try {
    const ssotoken = req.cookies.ssotoken;
    if (!ssotoken) {
      return res.status(401).json({
        isSuccess: false,
        code: "ERROR-0001",
        message: "SSO 토큰이 없습니다.",
      });
    }

    // 토큰 검증 및 프로필 추출
    const profileData = await verifySSOService.verifySSOToken(ssotoken);
    if (!profileData?.studentId) {
      return res.status(401).json({
        isSuccess: false,
        code: "ERROR-0002",
        message: "유효하지 않은 SSO 토큰입니다.",
      });
    }

    const updatedUser = await toggleNotificationSetting(profileData.studentId);

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "알림 설정이 전환되었습니다.",
      notification: updatedUser.notification,
    });
  } catch (error) {
    console.error("알림 설정 전환 중 오류:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0003",
      message: "서버 오류가 발생했습니다.",
    });
  }
};
