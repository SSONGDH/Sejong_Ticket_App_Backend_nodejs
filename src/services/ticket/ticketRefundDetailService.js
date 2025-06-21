import Refund from "../../models/refundModel.js";
import Ticket from "../../models/ticketModel.js";
import User from "../../models/userModel.js";

export const getTicketRefundDetail = async (ticketId) => {
  // 1️⃣ 환불 내역 조회
  const refund = await Refund.findOne({ ticketId });
  if (!refund) return { error: "refund_not_found" };

  // 2️⃣ 티켓 정보 조회
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return { error: "ticket_not_found" };

  // 3️⃣ 환불 요청자 이름으로 유저 조회
  const user = await User.findOne({ name: refund.name });
  if (!user) return { error: "user_not_found" };

  // 4️⃣ 환불 상세 정보 조합 반환
  return {
    name: refund.name,
    studentId: user.studentId,
    major: user.major,
    eventName: ticket.eventTitle,
    visitDate: refund.visitDate,
    visitTime: refund.visitTime,
    refundPermissionStatus: refund.refundPermissionStatus ? "승인됨" : "미승인",
    refundReason: refund.refundReason,
    _id: refund._id,
  };
};
