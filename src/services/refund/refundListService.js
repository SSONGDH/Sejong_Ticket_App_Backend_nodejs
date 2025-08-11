import Refund from "../../models/refundModel.js";
import Ticket from "../../models/ticketModel.js";
import User from "../../models/userModel.js";

export const getRefundListByAdmin = async (studentId) => {
  // 1. 유저 조회
  const user = await User.findOne({ studentId });
  if (!user) return [];

  // 2. admin 권한 있는 소속 이름 목록 추출
  const adminAffiliationNames = (user.affiliations || [])
    .filter((aff) => aff.admin)
    .map((aff) => aff.name);

  if (adminAffiliationNames.length === 0) return [];

  // 3. 해당 소속 이름으로 티켓 조회
  const tickets = await Ticket.find({
    affiliation: { $in: adminAffiliationNames },
  });
  if (!tickets.length) return [];

  const ticketIds = tickets.map((t) => t._id);

  // 4. 티켓 ID로 환불 조회
  const refunds = await Refund.find({
    ticketId: { $in: ticketIds },
  });
  if (!refunds.length) return [];

  // 5. 티켓 정보 붙여서 결과 반환
  const result = refunds.map((refund) => {
    const ticket = tickets.find((t) => t._id.equals(refund.ticketId));
    const eventName = ticket ? ticket.eventTitle : "이벤트 정보 없음";

    return {
      name: refund.name,
      eventName,
      visitDate: refund.visitDate,
      visitTime: refund.visitTime,
      refundPermissionStatus: refund.refundPermissionStatus ? "TRUE" : "FALSE",
      refundReason: refund.refundReason,
      _id: refund._id,
    };
  });

  return result;
};
