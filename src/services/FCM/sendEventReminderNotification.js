import admin from "../../config/firebaseConfig.js";
import User from "../../models/userModel.js";
import Ticket from "../../models/ticketModel.js";

const sendEventReminderNotification = async (eventId) => {
  try {
    console.log(`📅 이벤트 알림 함수 호출됨: ${eventId}`);

    const ticket = await Ticket.findById(eventId);
    if (!ticket) return;

    const users = await User.find({ tickets: eventId });

    // forEach 대신 for...of 로 async/await 정확하게 처리
    for (const user of users) {
      if (!user.fcmToken) continue;

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
    }
  } catch (error) {
    console.error("❌ 이벤트 알림 전송 실패:", error);
    throw error; // 에러는 컨트롤러로 전달
  }
};

export default sendEventReminderNotification;
