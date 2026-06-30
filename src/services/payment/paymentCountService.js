import Payment from "../../models/paymentModel.js";
import User from "../../models/userModel.js";

const createEmptyCounts = () => ({
  totalCount: 0,
  pendingCount: 0,
  approvedCount: 0,
});

export const countPaymentsByTicketIds = async (ticketIds) => {
  const normalizedTicketIds = ticketIds.map(String);

  if (!normalizedTicketIds.length) {
    return {};
  }

  const ticketIdSet = new Set(normalizedTicketIds);
  const countMap = Object.fromEntries(
    normalizedTicketIds.map((id) => [id, createEmptyCounts()])
  );
  const memberIdsByTicket = Object.fromEntries(
    normalizedTicketIds.map((id) => [id, new Set()])
  );

  const payments = await Payment.find(
    {},
    { ticketId: 1, studentId: 1, paymentPermissionStatus: 1 }
  );

  for (const payment of payments) {
    const ticketId = String(payment.ticketId);
    if (!ticketIdSet.has(ticketId)) continue;

    memberIdsByTicket[ticketId].add(payment.studentId);

    if (payment.paymentPermissionStatus === false) {
      countMap[ticketId].pendingCount += 1;
    }
  }

  const users = await User.find(
    { tickets: { $in: normalizedTicketIds } },
    { studentId: 1, tickets: 1 }
  );

  for (const user of users) {
    for (const ticketRef of user.tickets || []) {
      const ticketId = String(ticketRef);
      if (!ticketIdSet.has(ticketId)) continue;
      memberIdsByTicket[ticketId].add(user.studentId);
    }
  }

  for (const ticketId of normalizedTicketIds) {
    const totalCount = memberIdsByTicket[ticketId].size;
    const pendingCount = countMap[ticketId].pendingCount;

    countMap[ticketId] = {
      totalCount,
      pendingCount,
      approvedCount: Math.max(totalCount - pendingCount, 0),
    };
  }

  return countMap;
};

export const findPaymentsByTicketIds = async (ticketIds) => {
  const normalizedTicketIds = ticketIds.map(String);

  if (!normalizedTicketIds.length) {
    return [];
  }

  const ticketIdSet = new Set(normalizedTicketIds);
  const payments = await Payment.find({});

  return payments.filter((payment) =>
    ticketIdSet.has(String(payment.ticketId))
  );
};
