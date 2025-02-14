import cron from "node-cron";
import Ticket from "./models/ticketModel.js";
import sendEventReminderNotification from "./notifications/sendEventReminderNotification.js";

// ⏳ 매 10분마다 실행됨
cron.schedule("*/10 * * * *", async () => {
  console.log("⏳ 이벤트 시작 1시간 전 알림 체크 중...");

  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // 1시간 후

  // 1시간 후 시작되는 이벤트 찾기
  const upcomingEvents = await Ticket.find({
    eventStartTime: {
      $gte: now,
      $lte: oneHourLater,
    },
  });

  // 해당 이벤트의 참가자들에게 알림 보내기
  upcomingEvents.forEach((event) => {
    sendEventReminderNotification(event._id);
  });
});

console.log("✅ 이벤트 알림 크론 작업 실행 중...");
