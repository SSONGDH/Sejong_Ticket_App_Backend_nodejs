import Refund from "../../models/refundModel.js";
import User from "../../models/userModel.js";

export const createRefundRequest = async (userProfile, body) => {
  const { refundReason, visitDate, visitTime, ticketId, phone } = body;

  const { major, studentId, name } = userProfile;

  if (!refundReason || !visitDate || !visitTime || !ticketId) {
    return { status: 400, code: "ERROR-0002", message: "필수 데이터가 누락되었습니다." };
  }

  const user = await User.findOne({ studentId });

  if (!user) {
    return { status: 404, code: "ERROR-0003", message: "해당 사용자를 찾을 수 없습니다." };
  }

  if (!user.tickets.includes(ticketId)) {
    return {
      status: 404,
      code: "ERROR-0006",
      message: "현재 환불하려는 티켓은 없는 티켓입니다.",
    };
  }

  const newRefund = new Refund({
    ticketId,
    name,
    studentId,
    phone,
    refundReason,
    visitDate,
    visitTime,
    major,
    refundPermissionStatus: false,
  });

  const savedRefund = await newRefund.save();

  user.refunds.push(savedRefund._id);
  await user.save();

  return {
    status: 200,
    code: "SUCCESS-0000",
    message: "환불 요청이 성공적으로 처리되었습니다.",
    result: savedRefund,
  };
};
    