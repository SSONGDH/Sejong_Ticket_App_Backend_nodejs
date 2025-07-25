import moment from "moment-timezone";
import admin from "../../config/firebaseConfig.js";
import User from "../../models/userModel.js";
import Ticket from "../../models/ticketModel.js";

const sendEventReminderNotification = async (eventId) => {
  try {
    console.log(
      moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
      `📅 이벤트 알림 함수 호출됨: ${eventId}`
    );

    const ticket = await Ticket.findById(eventId);
    if (!ticket) {
      console.log(
        moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
        `❌ 이벤트를 찾을 수 없습니다: ${eventId}`
      );
      return;
    }

    const users = await User.find({ tickets: eventId });
    console.log(
      moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
      `👥 알림 대상 사용자 수: ${users.length}`
    );

    for (const user of users) {
      if (!user.fcmToken) {
        console.log(
          moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
          `⚠️ 사용자 ${user.name}의 FCM 토큰이 없습니다.`
        );
        continue;
      }

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

      try {
        await admin.messaging().send(message);
        console.log(
          moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
          `✅ ${user.name}에게 이벤트 알림   전송 완료`
        );
      } catch (sendError) {
        console.error(
          moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
          `❌ ${user.name} 알림 전송 실패:`,
          sendError
        );
      }
    }
  } catch (error) {
    console.error(
      moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
      "❌ 이벤트 알림 전송 전체 실패:",
      error
    );
    throw error; // 필요시 상위 호출부로 에러 전달
  }
};

export default sendEventReminderNotification;
