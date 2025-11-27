import Ticket from "../models/ticketModel.js";
import User from "../models/userModel.js";
import Payment from "../models/paymentModel.js";
import Refund from "../models/refundModel.js";
import moment from "moment";

const deleteExpiredTickets = async () => {
  try {
    const threeDaysAgo = moment().subtract(14, "days").startOf("day");
    const allTickets = await Ticket.find();

    for (const ticket of allTickets) {
      const eventDate = moment(ticket.eventDay, "YYYY-MM-DD");

      if (eventDate.isBefore(threeDaysAgo)) {
        const ticketId = ticket._id.toString();

        await Ticket.findByIdAndDelete(ticketId);

        await User.updateMany(
          { tickets: ticketId },
          { $pull: { tickets: ticketId } }
        );

        await Payment.deleteMany({ ticketId });

        const relatedRefunds = await Refund.find({ ticketId });

        if (relatedRefunds.length > 0) {
          const refundIds = relatedRefunds.map((r) => r._id.toString());

          await User.updateMany(
            { refunds: { $in: refundIds } },
            { $pull: { refunds: { $in: refundIds } } }
          );

          await Refund.deleteMany({ _id: { $in: refundIds } });
        }
      }
    }
  } catch (error) {
    console.error("❌ 만료 티켓 삭제 중 오류:", error);
  }
};

export default deleteExpiredTickets;
