import cron from "node-cron";
import moment from "moment-timezone"; // moment-timezone으로 변경
import sendEventReminderNotification from "../routes/FCM/fcmNotificationRoute.js";
import deleteExpiredTickets from "../services/deleteExpiredTickets.js";
import Ticket from "../models/ticketModel.js";

const startCronJob = async () => {
  // 시작 전에 DB에 저장된 이벤트 목록과 시작시간 출력
  const allEvents = await Ticket.find();
  console.log(
    moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
    `📋 DB에 저장된 이벤트 총 ${allEvents.length}개:`
  );
  allEvents.forEach((event) => {
    console.log(
      moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
      `- ${event.eventTitle} | 시작시간: ${event.eventDay} ${event.eventStartTime}`
    );
  });

  // 🕙 매 1분마다 실행
  cron.schedule("*/1 * * * *", async () => {
    console.log(
      moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
      "⏳ [CRON] 이벤트 시작 1시간 전 알림 체크 중..."
    );
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // 현재 시간 + 1시간

    // 모든 티켓 조회
    const upcomingEvents = await Ticket.find();

    for (const event of upcomingEvents) {
      const eventStartDate = moment(
        `${event.eventDay} ${event.eventStartTime}`,
        "YYYY-MM-DD HH:mm:ss"
      );

      let eventEndDate = moment(
        `${event.eventDay} ${event.eventEndTime}`,
        "YYYY-MM-DD HH:mm:ss"
      );

      if (eventEndDate.isBefore(eventStartDate)) {
        eventEndDate.add(1, "days");
      }

      // 1️⃣ 알림을 아직 안 보냈고, 이벤트 시작이 1시간 이내인 경우
      if (
        !event.reminderSent &&
        eventStartDate >= now &&
        eventStartDate <= oneHourLater
      ) {
        await sendEventReminderNotification(event._id);
        event.reminderSent = true; // 알림 보냈음을 표시
        await event.save();
        console.log(
          moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
          `📨 [CRON] 알림 전송 완료: ${event.eventTitle}`
        );
      }

      // 2️⃣ 이벤트가 종료되었으면 상태 변경
      if (eventEndDate < now && event.status !== "만료됨") {
        event.status = "만료됨";
        await event.save();
        console.log(
          moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
          `📛 [CRON] 티켓 종료 처리 완료: ${event.eventTitle}`
        );
      }
    }
  });

  // 🌙 매일 자정에 만료 티켓 삭제
  cron.schedule("0 0 * * *", async () => {
    console.log(
      moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
      "🌙 [CRON] 자정 - 만료 티켓 삭제 작업 시작"
    );
    await deleteExpiredTickets();
  });

  console.log(
    moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
    "✅ 크론 작업 실행 중..."
  );
};

export default startCronJob;
