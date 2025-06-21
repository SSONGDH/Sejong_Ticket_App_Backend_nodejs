import Ticket from "../models/ticketModel.js";
import User from "../models/userModel.js";
import Payment from "../models/paymentModel.js";
import Refund from "../models/refundModel.js";
import moment from "moment";

const deleteExpiredTickets = async () => {
  try {
    const threeDaysAgo = moment().subtract(3, "days").startOf("day");

    const allTickets = await Ticket.find();

    for (const ticket of allTickets) {
      const eventDate = moment(ticket.eventDay, "YYYY-MM-DD");

      // 🔥 eventDay가 3일 전보다 이전이면 삭제
      if (eventDate.isBefore(threeDaysAgo)) {
        const ticketId = ticket._id.toString();

        // 1️⃣ Ticket 삭제
        await Ticket.findByIdAndDelete(ticketId);

        // 2️⃣ User에서 tickets 배열에서 제거
        await User.updateMany(
          { tickets: ticketId },
          { $pull: { tickets: ticketId } }
        );

        // 3️⃣ Payment 삭제
        await Payment.deleteMany({ ticketId });

        // 4️⃣ Refund 관련 삭제
        const relatedRefunds = await Refund.find({ ticketId });

        if (relatedRefunds.length > 0) {
          const refundIds = relatedRefunds.map((r) => r._id.toString());

          // 4-1️⃣ User refunds 배열에서 제거
          await User.updateMany(
            { refunds: { $in: refundIds } },
            { $pull: { refunds: { $in: refundIds } } }
          );

          // 4-2️⃣ Refund 삭제
          await Refund.deleteMany({ _id: { $in: refundIds } });
        }

        console.log(`🗑️  삭제 완료: 티켓 ${ticketId}`);
      }
    }

    console.log("✅ 3일 이상 지난 티켓 정리 완료 (eventDay 기준)");
  } catch (error) {
    console.error("❌ 만료 티켓 삭제 중 오류:", error);
  }
};

export default deleteExpiredTickets;
