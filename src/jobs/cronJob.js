// cron.js
import cron from "node-cron";
import moment from "moment";
import sendEventReminderNotification from "../routes/FCM/sendEventReminderNotification.js";
import deleteExpiredTicketsFromUsers from "../service/deleteExpiredTickets.js";
import deleteExpiredTickets from "../service/deleteExpiredTickets.js";
import Ticket from "../models/ticketModel.js";

const startCronJob = () => {
  // 매 10분마다 이벤트 시작 1시간 전 알림
  cron.schedule("*/10 * * * *", async () => {
    console.log("⏳ 이벤트 시작 1시간 전 알림 체크 중...");
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const upcomingEvents = await Ticket.find();

    upcomingEvents.forEach((event) => {
      const eventStartDate = moment(
        `${event.eventDay} ${event.eventStartTime}`,
        "YYYY-MM-DD HH:mm:ss"
      ).toDate();
      if (eventStartDate >= now && eventStartDate <= oneHourLater) {
        sendEventReminderNotification(event._id);
      }
    });
  });

  // 매일 자정에 종료된 티켓 제거
  cron.schedule("0 0 * * *", async () => {
    console.log("🌙 [CRON] 자정 - 만료 티켓 삭제 작업 시작");
    await deleteExpiredTickets();
  });

  console.log("✅ 크론 작업 실행 중...");
};

export default startCronJob;
