// cron/startCronJob.js
import cron from "node-cron";
import moment from "moment-timezone";
import sendEventReminderNotification from "../services/FCM/sendEventReminderNotification.js";
import sendAdminAffiliationRequestNotification from "../services/FCM/sendAdminAffiliationRequestNotification.js";
import Ticket from "../models/ticketModel.js";
import Refund from "../models/refundModel.js";
import Payment from "../models/paymentModel.js";
import User from "../models/userModel.js";
import AffiliationRequest from "../models/affiliationRequestModel.js";

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

  // 🛎️ 매 1분마다 - pending 소속 신청 → root에게 알림
  cron.schedule("*/1 * * * *", async () => {
    const now = moment().tz("Asia/Seoul");

    try {
      const pendingRequests = await AffiliationRequest.find({
        status: "pending",
        adminNotified: false,
      });

      for (const req of pendingRequests) {
        // root 계정 조회
        const rootUsers = await User.find({
          root: true,
          notification: true,
          fcmToken: { $ne: null },
        });

        if (rootUsers.length === 0) {
          console.log(
            now.format("YYYY-MM-DD HH:mm:ss"),
            "root 계정이 없어 소속 신청 알림을 보낼 수 없음"
          );
          continue;
        }

        const tokens = rootUsers.map((u) => u.fcmToken);

        // 알림 전송
        await sendAdminAffiliationRequestNotification(tokens, req);

        // 중복 알림 방지
        req.adminNotified = true;
        await req.save();

        console.log(
          now.format("YYYY-MM-DD HH:mm:ss"),
          `root(${tokens.length}명)에게 소속 신청 알림 전송 완료`
        );
      }
    } catch (err) {
      console.error("root 소속 신청 알림 처리 실패:", err);
    }
  });

  // 🌙 매일 자정 실행: 종료 후 2주 지난 티켓 삭제 + 승인 요청 삭제
  cron.schedule("0 0 * * *", async () => {
    const now = moment().tz("Asia/Seoul");
    console.log(
      now.format("YYYY-MM-DD HH:mm:ss"),
      "만료 티켓/승인 요청 삭제 작업 시작"
    );

    try {
      // 1️⃣ 행사 종료 후 2주 지난 티켓 삭제
      const allTickets = await Ticket.find();

      for (const ticket of allTickets) {
        // 종료 시각 조합
        const eventEndDate = moment.tz(
          `${ticket.eventDay} ${ticket.eventEndTime}`,
          "YYYY-MM-DD HH:mm:ss",
          "Asia/Seoul"
        );

        // 종료 후 14일(2주) 경과 여부 체크
        const diffDays = now.diff(eventEndDate, "days");

        if (diffDays >= 14) {
          await Refund.deleteMany({ ticketId: ticket._id });
          await Payment.deleteMany({ ticketId: ticket._id });
          await Ticket.deleteOne({ _id: ticket._id });

          console.log(
            now.format("YYYY-MM-DD HH:mm:ss"),
            `삭제 완료(종료 후 2주): 티켓 ${ticket._id} 및 관련 환불/납부 내역`
          );
        }
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
