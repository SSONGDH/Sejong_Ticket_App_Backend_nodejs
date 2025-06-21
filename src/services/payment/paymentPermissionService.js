import Payment from "../../models/paymentModel.js";
import User from "../../models/userModel.js";
import Ticket from "../../models/ticketModel.js";
import sendTicketApprovalNotification from "../FCM/sendTicketApprovalNotification.js";

export const approvePayment = async (paymentId) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) return { error: "PAYMENT_NOT_FOUND" };

  payment.paymentPermissionStatus = true;
  await payment.save();

  const user = await User.findOne({ studentId: payment.studentId });
  if (!user) return { error: "USER_NOT_FOUND" };

  if (!user.tickets.includes(payment.ticketId)) {
    user.tickets.push(payment.ticketId);
    await user.save();
  }

  const ticket = await Ticket.findById(payment.ticketId);
  const eventTitle = ticket?.eventTitle || "이벤트";

  await sendTicketApprovalNotification(user._id, eventTitle);

  return {
    paymentId: payment._id,
    paymentPermissionStatus: payment.paymentPermissionStatus,
    userId: user._id,
    updatedTickets: user.tickets,
  };
};
