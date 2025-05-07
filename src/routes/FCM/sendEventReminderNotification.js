import admin from "../../config/firebaseConfig.js";
import User from "../../models/userModel.js"; // 유저 모델
import Ticket from "../../models/ticketModel.js"; // 티켓 모델

const sendEventReminderNotification = async (eventId) => {
  try {
    console.log(`📅 이벤트 알림 함수 호출됨: ${eventId}`); // 호출 여부 확인용 로그

    // 해당 이벤트의 티켓 정보 가져오기
    const ticket = await Ticket.findById(eventId);
    if (!ticket) return;

    // 해당 이벤트에 등록된 모든 유저 찾기
    const users = await User.find({ tickets: eventId });

    // 유저들에게 알림 전송
    users.forEach(async (user) => {
      if (!user.fcmToken) return;

      const message = {
        token: user.fcmToken,
        notification: {
          title: "이벤트 시작 1시간 전!",
          body: `${ticket.eventTitle}이(가) 곧 시작됩니다. 준비하세요!`,
        },
        data: {
          type: "EVENT_REMINDER",
          userId: user._id.toString(),
          eventTitle: ticket.eventTitle,
        },
      };

      await admin.messaging().send(message);
      console.log(`✅ ${user.name}에게 이벤트 알림 전송 완료`);
    });
  } catch (error) {
    console.error("❌ 이벤트 알림 전송 실패:", error);
  }
};

export default sendEventReminderNotification;
