import Payment from "../../models/paymentModel.js";
import Ticket from "../../models/ticketModel.js";
import User from "../../models/userModel.js";

export const getPaymentsByAdmin = async (studentId, affiliationId) => {
  const user = await User.findOne({ studentId });
  if (!user) return [];

  if (user.root === true) {
    return Payment.find({});
  }

  const targetAffiliation = (user.affiliations || []).find(
    (aff) => aff.id === affiliationId
  );

  if (!targetAffiliation) return [];

  const tickets = await Ticket.find({
    affiliation: targetAffiliation.name,
  });

  const ticketIds = tickets.map((t) => t._id);

  return Payment.find({
    ticketId: { $in: ticketIds },
  });
};

export const getPaymentListByAdmin = async (studentId, affiliationId) => {
  const payments = await getPaymentsByAdmin(studentId, affiliationId);

  return payments.map((payment) => ({
    ticketId: payment.ticketId,
    paymentId: payment._id,
    name: payment.name,
    studentId: payment.studentId,
    paymentPermissionStatus: payment.paymentPermissionStatus,
  }));
};

export const getPaymentCountByAdmin = async (studentId, affiliationId) => {
  const payments = await getPaymentsByAdmin(studentId, affiliationId);
  return { totalCount: payments.length };
};
