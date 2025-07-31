// cron/startCronJob.js
import cron from "node-cron";
import moment from "moment-timezone";
import sendEventReminderNotification from "../services/FCM/sendEventReminderNotification.js";
import deleteExpiredTickets from "../services/deleteExpiredTickets.js";
import Ticket from "../models/ticketModel.js";

const startCronJob = () => {
  // 🕙 매 1분마다 실행
  cron.schedule("*/1 * * * *", async () => {
    const now = moment().tz("Asia/Seoul");
    const oneHourLater = now.clone().add(1, "hour");

    console.log(
      now.format("YYYY-MM-DD HH:mm:ss"),
      "이벤트 시작 1시간 전 알림 체크 중..."
    );

    const upcomingEvents = await Ticket.find();

    let matchCount = 0;

    for (const event of upcomingEvents) {
      const eventStartDate = moment.tz(
        `${event.eventDay} ${event.eventStartTime}`,
        "YYYY-MM-DD HH:mm:ss",
        "Asia/Seoul"
      );

      let eventEndDate = moment.tz(
        `${event.eventDay} ${event.eventEndTime}`,
        "YYYY-MM-DD HH:mm:ss",
        "Asia/Seoul"
      );

      if (eventEndDate.isBefore(eventStartDate)) {
        eventEndDate.add(1, "days");
      }

      // 🔔 알림 전송 조건 충족
      if (!event.reminderSent) {
        try {
          await sendEventReminderNotification(event._id);
          event.reminderSent = true;
          await event.save();
          console.log(
            moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
            `알림 전송 완료: ${event.eventTitle}`
          );
        } catch (err) {
          console.error(
            moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
            `알림 전송 실패: ${event.eventTitle} - ${err.message}`
          );
        }
        matchCount++;
      }
    }
  });

  // 🌙 매일 자정에 만료 티켓 삭제
  cron.schedule("0 0 * * *", async () => {
    console.log(
      moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
      "만료 티켓 삭제 작업 시작"
    );
    await deleteExpiredTickets();
  });

  console.log(
    moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
    "✅ 크론 작업 실행 중..."
  );
};

export default startCronJob;
