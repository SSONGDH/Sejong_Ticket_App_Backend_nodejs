import Refund from "../../models/refundModel.js";
import Ticket from "../../models/ticketModel.js";
import User from "../../models/userModel.js";

export const getRefundListByAdmin = async (studentId, affiliationId) => {
  const user = await User.findOne({ studentId });
  if (!user) return [];

  let refunds = [];
  let tickets = [];

  if (user.root === true) {
    refunds = await Refund.find({});

    if (refunds.length > 0) {
      tickets = await Ticket.find({
        _id: { $in: refunds.map((r) => r.ticketId) },
      });
    }
  } else {
    const targetAffiliation = (user.affiliations || []).find(
      (aff) => aff.id === affiliationId
    );

    if (!targetAffiliation) return [];

    tickets = await Ticket.find({
      affiliation: targetAffiliation.name,
    });

    if (tickets.length > 0) {
      const ticketIds = tickets.map((t) => t._id);
      refunds = await Refund.find({
        ticketId: { $in: ticketIds },
      });
    }
  }

  return refunds.map((refund) => {
    const ticket = tickets.find((t) => t._id.equals(refund.ticketId));
    const eventName = ticket ? ticket.eventTitle : "이벤트 정보 없음";

    return {
      name: refund.name,
      studentId: refund.studentId,
      eventName,
      visitDate: refund.visitDate,
      visitTime: refund.visitTime,
      refundPermissionStatus: refund.refundPermissionStatus ? "TRUE" : "FALSE",
      refundReason: refund.refundReason,
      _id: refund._id,
    };
  });
};
