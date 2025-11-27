import Payment from "../../models/paymentModel.js";
import Ticket from "../../models/ticketModel.js";
import User from "../../models/userModel.js";

export const getPaymentListByAdmin = async (studentId, affiliationId) => {
  const user = await User.findOne({ studentId });
  if (!user) return [];

  let payments = [];

  if (user.root === true) {
    payments = await Payment.find({});
  } else {
    const targetAffiliation = (user.affiliations || []).find(
      (aff) => aff.id === affiliationId
    );

    if (!targetAffiliation) return [];

    const tickets = await Ticket.find({
      affiliation: targetAffiliation.name,
    });

    const ticketIds = tickets.map((t) => t._id);

    payments = await Payment.find({
      ticketId: { $in: ticketIds },
    });
  }

  return payments.map((payment) => ({
    ticketId: payment.ticketId,
    paymentId: payment._id,
    name: payment.name,
    studentId: payment.studentId,
    paymentPermissionStatus: payment.paymentPermissionStatus,
  }));
};
