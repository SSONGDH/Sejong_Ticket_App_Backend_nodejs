import { getNotificationStatusBySSO } from "../../services/user/notificationStatusService.js";

export const getNotificationStatus = async (req, res) => {
  const ssotoken = req.cookies.ssotoken;

  try {
    const result = await getNotificationStatusBySSO(ssotoken);

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
