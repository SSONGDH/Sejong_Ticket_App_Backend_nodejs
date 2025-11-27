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
  cron.schedule("*/1 * * * *", async () => {
    const now = moment().tz("Asia/Seoul");
    const upcomingEvents = await Ticket.find();

    for (const event of upcomingEvents) {
      const eventStartDate = moment.tz(
        `${event.eventDay} ${event.eventStartTime}`,
        "YYYY-MM-DD HH:mm:ss",
        "Asia/Seoul"
      );

      const diffMinutes = eventStartDate.diff(now, "minutes");
      if (!event.reminderSent && diffMinutes <= 60 && diffMinutes > 0) {
        try {
          await sendEventReminderNotification(event._id);
          event.reminderSent = true;
          await event.save();
        } catch (err) {
          console.error(
            now.format("YYYY-MM-DD HH:mm:ss"),
            `알림 전송 실패: ${event.eventTitle} - ${err.message}`
          );
        }
      }
    }
  });

  cron.schedule("*/1 * * * *", async () => {
    try {
      const pendingRequests = await AffiliationRequest.find({
        status: "pending",
        adminNotified: false,
      });

      for (const req of pendingRequests) {
        const rootUsers = await User.find({
          root: true,
          notification: true,
          fcmToken: { $ne: null },
        });

        if (rootUsers.length === 0) {
          continue;
        }

        const tokens = rootUsers.map((u) => u.fcmToken);

        await sendAdminAffiliationRequestNotification(tokens, req);

        req.adminNotified = true;
        await req.save();
      }
    } catch (err) {
      console.error("root 소속 신청 알림 처리 실패:", err);
    }
  });

  cron.schedule("0 0 * * *", async () => {
    const now = moment().tz("Asia/Seoul");

    try {
      const allTickets = await Ticket.find();

      for (const ticket of allTickets) {
        const eventEndDate = moment.tz(
          `${ticket.eventDay} ${ticket.eventEndTime}`,
          "YYYY-MM-DD HH:mm:ss",
          "Asia/Seoul"
        );

        const diffDays = now.diff(eventEndDate, "days");

        if (diffDays >= 14) {
          await Refund.deleteMany({ ticketId: ticket._id });
          await Payment.deleteMany({ ticketId: ticket._id });
          await Ticket.deleteOne({ _id: ticket._id });
        }
      }

      const twoDaysAgo = now.clone().subtract(2, "days").startOf("day");
      const oldApprovedRequests = await AffiliationRequest.find({
        status: "approved",
        updatedAt: { $lte: twoDaysAgo.toDate() },
      });

      for (const req of oldApprovedRequests) {
        await AffiliationRequest.deleteOne({ _id: req._id });
      }
    } catch (err) {
      console.error(
        now.format("YYYY-MM-DD HH:mm:ss"),
        "만료 티켓/승인 요청 삭제 실패:",
        err
      );
    }
  });
};

export default startCronJob;
