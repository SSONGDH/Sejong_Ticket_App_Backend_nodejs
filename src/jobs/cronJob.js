// cron/startCronJob.js
import cron from "node-cron";
import moment from "moment-timezone";
import sendEventReminderNotification from "../services/FCM/sendEventReminderNotification.js";
import Ticket from "../models/ticketModel.js";
import Refund from "../models/refundModel.js";
import Payment from "../models/paymentModel.js";
import AffiliationRequest from "../models/affiliationRequestModel.js"; // 추가

const startCronJob = () => {
  // 🕙 매 1분마다 실행 - 이벤트 시작 1시간 전 알림
  cron.schedule("*/1 * * * *", async () => {
    const now = moment().tz("Asia/Seoul");
    console.log(
      now.format("YYYY-MM-DD HH:mm:ss"),
      "이벤트 시작 1시간 전 알림 체크 중..."
    );

    const upcomingEvents = await Ticket.find();

    for (const event of upcomingEvents) {
      const eventStartDate = moment.tz(
        `${event.eventDay} ${event.eventStartTime}`,
        "YYYY-MM-DD HH:mm:ss",
        "Asia/Seoul"
      );

      // 🔔 알림 전송 조건: 이벤트 시작 1시간 전 && 아직 알림 미전송
      const diffMinutes = eventStartDate.diff(now, "minutes");
      if (!event.reminderSent && diffMinutes <= 60 && diffMinutes > 0) {
        try {
          await sendEventReminderNotification(event._id);
          event.reminderSent = true;
          await event.save();
          console.log(
            now.format("YYYY-MM-DD HH:mm:ss"),
            `알림 전송 완료: ${event.eventTitle}`
          );
        } catch (err) {
          console.error(
            now.format("YYYY-MM-DD HH:mm:ss"),
            `알림 전송 실패: ${event.eventTitle} - ${err.message}`
          );
        }
      }
    }
  });

  // 🌙 매일 자정에 만료 티켓 + 관련 환불/납부 내역 + 승인된 affiliation request 삭제
  cron.schedule("0 0 * * *", async () => {
    const now = moment().tz("Asia/Seoul");
    console.log(
      now.format("YYYY-MM-DD HH:mm:ss"),
      "만료 티켓/승인 요청 삭제 작업 시작"
    );

    try {
      // 1️⃣ 만료 티켓 삭제
      const expiredTickets = await Ticket.find({
        eventDay: { $lt: now.format("YYYY-MM-DD") },
      });

      for (const ticket of expiredTickets) {
        await Refund.deleteMany({ ticketId: ticket._id });
        await Payment.deleteMany({ ticketId: ticket._id });
        await Ticket.deleteOne({ _id: ticket._id });

        console.log(
          now.format("YYYY-MM-DD HH:mm:ss"),
          `삭제 완료: 티켓 ${ticket._id} 및 관련 환불/납부 내역`
        );
      }

      // 2️⃣ 승인된 affiliation request 중 2일 지난 것 삭제
      const twoDaysAgo = now.clone().subtract(2, "days").startOf("day");
      const oldApprovedRequests = await AffiliationRequest.find({
        status: "approved",
        updatedAt: { $lte: twoDaysAgo.toDate() },
      });

      for (const req of oldApprovedRequests) {
        await AffiliationRequest.deleteOne({ _id: req._id });
        console.log(
          now.format("YYYY-MM-DD HH:mm:ss"),
          `삭제 완료: 승인된 affiliation request ${req._id}`
        );
      }
    } catch (err) {
      console.error(
        now.format("YYYY-MM-DD HH:mm:ss"),
        "만료 티켓/승인 요청 삭제 실패:",
        err
      );
    }
  });

  console.log(
    moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
    "✅ 크론 작업 실행 중..."
  );
};

export default startCronJob;
