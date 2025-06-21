import Payment from "../../models/paymentModel.js";

export const savePaymentData = async ({
  ticketId,
  name,
  studentId,
  phone,
  major,
  imageUrl,
}) => {
  const newPayment = new Payment({
    ticketId,
    name,
    studentId,
    phone,
    major,
    paymentPicture: imageUrl,
  });

  await newPayment.save();
  return newPayment;
};
