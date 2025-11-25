import User from "../../models/userModel.js";
// import verifySSOService ... (삭제)

/**
 * 학번으로 유저의 notification 상태 반환 (JWT 버전)
 * @param {string} studentId
 * @returns {Object} { status, notification, message }
 */
export const getNotificationStatusByStudentId = async (studentId) => {
  // [삭제됨] ssotoken 검사 및 verifySSOService 호출 로직

  const user = await User.findOne({ studentId }).select("notification");

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
