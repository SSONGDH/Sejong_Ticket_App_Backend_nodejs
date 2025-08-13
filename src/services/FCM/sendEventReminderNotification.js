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

    // reminderSent가 false인 티켓만 조회
    const ticket = await Ticket.findOne({ _id: eventId, reminderSent: false });
    if (!ticket) {
      console.log(
        moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
        `❌ 이벤트를 찾을 수 없거나 이미 알림이 전송됨: ${eventId}`
      );
      return;
    }

    const users = await User.find({ tickets: eventId });
    console.log(
      moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
      `👥 알림 대상 사용자 수: ${users.length}`
    );

    for (const user of users) {
      if (!user.fcmToken || user.notification !== true) {
        console.log(
          moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
          `⚠️ 사용자 ${user.name}은 알림 설정이 꺼져있거나 FCM 토큰이 없습니다.`
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
          `✅ ${user.name}에게 이벤트 알림 전송 완료`
        );
      } catch (sendError) {
        console.error(
          moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
          `❌ ${user.name} 알림 전송 실패:`,
          sendError
        );
      }
    }

    // 알림 전송 완료 후 reminderSent를 true로 업데이트
    ticket.reminderSent = true;
    await ticket.save();
    console.log(
      moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
      `🔔 티켓 ${ticket._id} reminderSent 업데이트 완료`
    );
  } catch (error) {
    console.error(
      moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
      "❌ 이벤트 알림 전송 전체 실패:",
      error
    );
    throw error;
  }
};

export default sendEventReminderNotification;
