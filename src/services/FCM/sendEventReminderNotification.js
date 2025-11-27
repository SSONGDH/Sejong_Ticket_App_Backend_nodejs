import moment from "moment-timezone";
import admin from "../../config/firebaseConfig.js";
import User from "../../models/userModel.js";
import Ticket from "../../models/ticketModel.js";

const sendEventReminderNotification = async (eventId) => {
  try {
    const ticket = await Ticket.findOne({ _id: eventId, reminderSent: false });
    if (!ticket) {
      return;
    }

    const users = await User.find({ tickets: eventId });

    for (const user of users) {
      if (!user.fcmToken || user.notification !== true) {
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
      } catch (sendError) {
        console.error(
          moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
          `❌ ${user.name} 알림 전송 실패:`,
          sendError
        );
      }
    }

    ticket.reminderSent = true;
    await ticket.save();
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
