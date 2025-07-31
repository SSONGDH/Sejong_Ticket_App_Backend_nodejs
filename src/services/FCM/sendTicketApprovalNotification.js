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

    // 🔽 알림 설정이 꺼져있는 경우 전송하지 않음
    if (!user.notification) {
      console.log(
        `⚠️ ${user.name}의 알림 설정이 비활성화되어 있어 알림을 전송하지 않습니다.`
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
