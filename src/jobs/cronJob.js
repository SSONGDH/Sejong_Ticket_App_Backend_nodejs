import cron from "node-cron";
import moment from "moment-timezone";
import sendEventReminderNotification from "../routes/FCM/fcmNotificationRoute.js";
import deleteExpiredTickets from "../services/deleteExpiredTickets.js";
import Ticket from "../models/ticketModel.js";

const startCronJob = () => {
  // 시작 시 DB에 있는 이벤트 제목과 시작시간 로그 출력
  (async () => {
    const events = await Ticket.find();
    console.log(
      moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
      `📋 DB에 저장된 이벤트 총 ${events.length}개:`
    );
    events.forEach((event) => {
      const startTime = moment
        .tz(
          `${event.eventDay} ${event.eventStartTime}`,
          "YYYY-MM-DD HH:mm:ss",
          "Asia/Seoul"
        )
        .format("YYYY-MM-DD HH:mm:ss");
      console.log(`- ${event.eventTitle} | 시작시간: ${startTime}`);
    });
  })();

  // 🕙 매 1분마다 실행
  cron.schedule("*/1 * * * *", async () => {
    const now = moment().tz("Asia/Seoul");
    const oneHourLater = now.clone().add(1, "hour");

    console.log(
      now.format("YYYY-MM-DD HH:mm:ss"),
      "⏳ [CRON] 이벤트 시작 1시간 전 알림 체크 중..."
    );

    const upcomingEvents = await Ticket.find();
    let notifiedAny = false;

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

      if (
        !event.reminderSent &&
        eventStartDate.isSameOrAfter(now) &&
        eventStartDate.isSameOrBefore(oneHourLater)
      ) {
        try {
          await sendEventReminderNotification(event._id);
          event.reminderSent = true;
          await event.save();
          console.log(
            moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
            `📨 [CRON] 알림 전송 완료: ${event.eventTitle}`
          );
          notifiedAny = true;
        } catch (err) {
          console.error(
            moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
            `❌ [CRON] 알림 전송 실패: ${event.eventTitle} - ${err.message}`
          );
        }
      } else {
        if (event.reminderSent) {
          console.log(
            moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
            `🔕 [SKIP] 이미 알림 전송됨: ${event.eventTitle}`
          );
        } else if (eventStartDate.isBefore(now)) {
          console.log(
            moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
            `⏱️ [SKIP] 이미 시작된 이벤트: ${event.eventTitle}`
          );
        } else if (eventStartDate.isAfter(oneHourLater)) {
          console.log(
            moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
            `⌛ [SKIP] 1시간 이상 남은 이벤트: ${event.eventTitle}`
          );
        }
      }

      if (eventEndDate.isBefore(now) && event.status !== "만료됨") {
        event.status = "만료됨";
        await event.save();
        console.log(
          moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
          `📛 [CRON] 티켓 종료 처리 완료: ${event.eventTitle}`
        );
      }
    }

    if (!notifiedAny) {
      console.log(
        moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
        "📭 [CRON] 조건에 맞는 이벤트가 없어 알림 없음"
      );
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
