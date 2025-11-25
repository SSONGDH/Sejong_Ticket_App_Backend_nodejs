// [변경] 함수 이름 변경 (BySSO -> ByStudentId)
import { getNotificationStatusByStudentId } from "../../services/user/notificationStatusService.js";

export const getNotificationStatus = async (req, res) => {
  try {
    // [변경] 쿠키(ssotoken) 대신 미들웨어가 준 학번 사용
    const { studentId } = req.user;

    // [변경] 서비스 호출 (토큰 대신 학번 전달)
    const result = await getNotificationStatusByStudentId(studentId);

    return res.status(result.status).json({
      code: result.code,
      message: result.message,
      notification: result.notification,
    });
  } catch (error) {
    console.error("❌ 알림 상태 조회 중 오류:", error);
    return res.status(500).json({
      code: "ERROR-9999",
      message: "서버 오류",
      notification: null,
    });
  }
};
