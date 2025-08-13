import User from "../../models/userModel.js";
import verifySSOService from "../ssoAuth.js";

/**
 * SSO 토큰으로 유저를 인증하고 notification 상태 반환
 * @param {string} ssotoken
 * @returns {Object} { status, notification, message }
 */
export const getNotificationStatusBySSO = async (ssotoken) => {
  if (!ssotoken) {
    return {
      status: 400,
      code: "ERROR-0001",
      message: "SSO 토큰이 제공되지 않았습니다.",
      notification: null,
    };
  }

  const userProfile = await verifySSOService.verifySSOToken(ssotoken);

  if (!userProfile || !userProfile.studentId) {
    return {
      status: 401,
      code: "ERROR-0002",
      message: "유효하지 않은 SSO 토큰입니다.",
      notification: null,
    };
  }

  const user = await User.findOne({ studentId: userProfile.studentId }).select(
    "notification"
  );

  if (!user) {
    return {
      status: 404,
      code: "ERROR-0003",
      message: "해당 사용자를 찾을 수 없습니다.",
      notification: null,
    };
  }

  return {
    status: 200,
    code: "SUCCESS-0000",
    message: "유저 알림 상태 조회 성공",
    notification: user.notification,
  };
};
