import Refund from "../../models/refundModel.js";
import Ticket from "../../models/ticketModel.js";

export const getRefundList = async () => {
  const refunds = await Refund.find();

  if (!refunds || refunds.length === 0) {
    return null;
  }

  const result = await Promise.all(
    refunds.map(async (refund) => {
      const ticket = await Ticket.findById(refund.ticketId);
      const eventName = ticket ? ticket.eventTitle : "이벤트 정보 없음";

      return {
        name: refund.name,
        eventName,
        visitDate: refund.visitDate,
        visitTime: refund.visitTime,
        refundPermissionStatus: refund.refundPermissionStatus
          ? "TRUE"
          : "FALSE",
        refundReason: refund.refundReason,
        _id: refund._id,
      };
    })
  );

  return result;
};
