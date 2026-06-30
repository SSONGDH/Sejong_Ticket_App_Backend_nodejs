import Payment from "../../models/paymentModel.js";

export const countPaymentsByTicketIds = async (ticketIds) => {
  const normalizedTicketIds = ticketIds.map(String);

  if (!normalizedTicketIds.length) {
    return {};
  }

  const paymentCounts = await Payment.aggregate([
    { $addFields: { ticketIdStr: { $toString: "$ticketId" } } },
    { $match: { ticketIdStr: { $in: normalizedTicketIds } } },
    {
      $group: {
        _id: "$ticketIdStr",
        totalCount: { $sum: 1 },
        pendingCount: {
          $sum: {
            $cond: [{ $eq: ["$paymentPermissionStatus", false] }, 1, 0],
          },
        },
      },
    },
  ]);

  return Object.fromEntries(
    paymentCounts.map((item) => [String(item._id), item])
  );
};

export const findPaymentsByTicketIds = async (ticketIds) => {
  const normalizedTicketIds = ticketIds.map(String);

  if (!normalizedTicketIds.length) {
    return [];
  }

  return Payment.aggregate([
    { $addFields: { ticketIdStr: { $toString: "$ticketId" } } },
    { $match: { ticketIdStr: { $in: normalizedTicketIds } } },
  ]);
};
