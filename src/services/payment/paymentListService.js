import Payment from "../../models/paymentModel.js";

export const getPaymentList = async () => {
  const payments = await Payment.find();
  if (payments.length === 0) return null;

  return payments.map((payment) => ({
    ticketId: payment.ticketId,
    paymentId: payment._id,
    name: payment.name,
    studentId: payment.studentId,
    paymentPermissionStatus: payment.paymentPermissionStatus,
  }));
};
