import cron from "node-cron";
import moment from "moment";
import sendEventReminderNotification from "../routes/FCM/sendEventReminderNotification.js";
import deleteExpiredTickets from "../service/deleteExpiredTickets.js";
import Ticket from "../models/ticketModel.js";

const startCronJob = () => {
  // 매 10분마다 이벤트 시작 1시간 전 알림
  cron.schedule("*/10 * * * *", async () => {
    console.log("⏳ [CRON] 이벤트 시작 1시간 전 알림 체크 중...");
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const upcomingEvents = await Ticket.find();

    for (const event of upcomingEvents) {
      const eventStartDate = moment(
        `${event.eventDay} ${event.eventStartTime}`,
        "YYYY-MM-DD HH:mm:ss"
      ).toDate();

      const eventEndDate = moment(
        `${event.eventDay} ${event.eventEndTime}`,
        "YYYY-MM-DD HH:mm:ss"
      ).toDate();

      // 1️⃣ 이벤트 시작 1시간 전이면 알림 전송
      if (eventStartDate >= now && eventStartDate <= oneHourLater) {
        sendEventReminderNotification(event._id);
      }

      // 2️⃣ 이벤트 종료 시간이 현재보다 과거이면 status를 "종료"로 변경
      if (eventEndDate < now && event.status !== "종료") {
        event.status = "종료";
        await event.save();
        console.log(`📛 [CRON] 티켓 종료 처리 완료: ${event.eventTitle}`);
      }
    }
  });

  // 매일 자정에 만료된 티켓을 DB에서 제거
  cron.schedule("0 0 * * *", async () => {
    console.log("🌙 [CRON] 자정 - 만료 티켓 삭제 작업 시작");
    await deleteExpiredTickets();
  });

  console.log("✅ 크론 작업 실행 중...");
};

export default startCronJob;
