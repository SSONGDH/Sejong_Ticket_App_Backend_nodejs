import { toggleNotificationSetting } from "../../services/notification/notificationService.js";
// import verifySSOService ... (삭제)

export const toggleNotification = async (req, res) => {
  try {
    // [변경 핵심] 미들웨어(authenticate)가 검증한 유저의 학번을 바로 사용
    const { studentId } = req.user;

    /* [삭제된 로직]
       - ssotoken 쿠키 확인
       - verifySSOService 호출
       - profileData 검증
    */

    // 서비스 호출 (기존 로직 유지)
    const updatedUser = await toggleNotificationSetting(studentId);

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
