import Payment from "../../models/paymentModel.js";
import Ticket from "../../models/ticketModel.js";
import User from "../../models/userModel.js";
import { findPaymentsByTicketIds } from "./paymentCountService.js";

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

  const ticketIds = tickets.map((t) => t._id.toString());

  return findPaymentsByTicketIds(ticketIds);
};

export const getPaymentListByAdmin = async (studentId, affiliationId) => {
  const payments = await getPaymentsByAdmin(studentId, affiliationId);

  const ticketIds = [...new Set(payments.map((p) => String(p.ticketId)))];
  const tickets = await Ticket.find({ _id: { $in: ticketIds } });
  const affiliationByTicketId = Object.fromEntries(
    tickets.map((ticket) => [ticket._id.toString(), ticket.affiliation])
  );

  return payments.map((payment) => ({
    ticketId: payment.ticketId,
    paymentId: payment._id,
    name: payment.name,
    studentId: payment.studentId,
    major: payment.major,
    affiliation: affiliationByTicketId[String(payment.ticketId)] ?? null,
    paymentPermissionStatus: payment.paymentPermissionStatus,
  }));
};

export const getPaymentCountByAdmin = async (studentId, affiliationId) => {
  const payments = await getPaymentsByAdmin(studentId, affiliationId);
  const approvedCount = payments.filter((p) => p.paymentPermissionStatus).length;
  const pendingCount = payments.length - approvedCount;

  return {
    totalCount: payments.length,
    approvedCount,
    pendingCount,
  };
};
