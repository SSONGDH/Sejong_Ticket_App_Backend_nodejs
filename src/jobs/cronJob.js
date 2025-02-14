import cron from "node-cron";
import Ticket from "../models/ticketModel.js";
import sendEventReminderNotification from "../routes/FCM/sendEventReminderNotification.js";
import removeExpiredTicketsFromUsers from "../service/removeExpiredTickets.js";

// 이벤트 알림 및 종료된 티켓 제거 작업을 하나의 cron 작업에 병합
const startCronJob = () => {
  // 매 10분마다 이벤트 시작 1시간 전 알림 체크
  cron.schedule("*/10 * * * *", async () => {
    console.log("⏳ 이벤트 시작 1시간 전 알림 체크 중...");

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    // 1시간 내에 시작하는 이벤트들 조회
    const upcomingEvents = await Ticket.find({
      eventStartTime: { $gte: now, $lte: oneHourLater },
    });

    upcomingEvents.forEach((event) => {
      sendEventReminderNotification(event._id); // 알림 전송
    });
  });

  // 매일 자정에 종료된 티켓 제거 작업 실행
  cron.schedule("0 0 * * *", () => {
    console.log("🌟 티켓 종료 시간 확인 작업 시작");
    removeExpiredTicketsFromUsers(); // 종료된 티켓 제거
  });

  console.log("✅ 크론 작업 실행 중...");
};

export default startCronJob;
