import admin from "../../config/firebaseConfig.js";
import User from "../../models/userModel.js";

const sendTicketApprovalNotification = async (userId, eventTitle) => {
  try {
    console.log(
      `✅ 티켓 승인 알림 전송 요청: userId=${userId}, eventTitle=${eventTitle}`
    );

    const user = await User.findById(userId);
    if (!user || !user.fcmToken) {
      console.log(
        `❌ FCM 토큰이 없거나 유저를 찾을 수 없습니다. userId=${userId}`
      );
      return;
    }

    const message = {
      token: user.fcmToken,
      notification: {
        title: "티켓 승인 완료",
        body: `티켓(${eventTitle})이 승인되었습니다!`,
      },
      data: {
        type: "TICKET_APPROVED",
        userId: user._id.toString(),
        eventTitle,
      },
    };

    await admin.messaging().send(message);
    console.log(`✅ ${user.name}에게 티켓 승인 알림 전송 완료`);
  } catch (error) {
    console.error("❌ 티켓 승인 알림 전송 실패:", error);
    throw error;
  }
};

export default sendTicketApprovalNotification;
