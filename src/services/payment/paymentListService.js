import Payment from "../../models/paymentModel.js";
import Ticket from "../../models/ticketModel.js";
import User from "../../models/userModel.js";
import { findPaymentsByTicketIds } from "./paymentCountService.js";
import {
  findUserAffiliation,
  hasHostPermission,
} from "../../utils/affiliationRole.js";

export const getPaymentsByAdmin = async (studentId, affiliationId) => {
  const user = await User.findOne({ studentId });
  if (!user) return [];

  if (user.root === true) {
    return Payment.find({});
  }

  const targetAffiliation = findUserAffiliation(user, affiliationId);

  if (!targetAffiliation || !hasHostPermission(targetAffiliation)) return [];

  const tickets = await Ticket.find({
    affiliation: targetAffiliation.name,
  });

  const ticketIds = tickets.map((t) => t._id.toString());

  return findPaymentsByTicketIds(ticketIds);
};

export const getPaymentListByAdmin = async (studentId, affiliationId) => {
  const payments = await getPaymentsByAdmin(studentId, affiliationId);

  return payments.map((payment) => ({
    ticketId: payment.ticketId,
    paymentId: payment._id,
    name: payment.name,
    studentId: payment.studentId,
    major: payment.major,
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
