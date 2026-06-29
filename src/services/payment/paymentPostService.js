import Payment from "../../models/paymentModel.js";

export const savePaymentData = async ({
  ticketId,
  name,
  studentId,
  phone,
  major,
  imageUrl,
}) => {
  const normalizedTicketId = String(ticketId);

  const existingPayment = await Payment.findOne({
    ticketId: normalizedTicketId,
    studentId,
  });

  if (existingPayment) {
    if (existingPayment.paymentPermissionStatus) {
      return {
        error: "ALREADY_APPROVED",
        message: "이미 승인된 행사가 있습니다.",
      };
    }
    return {
      error: "ALREADY_PENDING",
      message: "이미 납부 신청이 접수되었습니다.",
    };
  }

  const newPayment = new Payment({
    ticketId: normalizedTicketId,
    name,
    studentId,
    phone,
    major,
    paymentPicture: imageUrl,
  });

  await newPayment.save();
  return newPayment;
};
