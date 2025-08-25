import Refund from "../../models/refundModel.js";
import Ticket from "../../models/ticketModel.js";
import User from "../../models/userModel.js";

/**
 * 특정 소속 ID에 해당하는 환불 내역을 반환 (root는 전체 반환)
 * @param {string} studentId - 유저 학번
 * @param {string} affiliationId - 필터링할 소속 ID
 */
export const getRefundListByAdmin = async (studentId, affiliationId) => {
  // 1. 유저 조회
  const user = await User.findOne({ studentId });
  if (!user) return [];

  // 📌 root면 모든 환불 내역 반환
  if (user.root === true) {
    const refunds = await Refund.find({});
    if (!refunds.length) return [];

    // 티켓 정보 조회
    const tickets = await Ticket.find({
      _id: { $in: refunds.map((r) => r.ticketId) },
    });

    return refunds.map((refund) => {
      const ticket = tickets.find((t) => t._id.equals(refund.ticketId));
      const eventName = ticket ? ticket.eventTitle : "이벤트 정보 없음";

      return {
        name: refund.name,
        studentId: refund.studentId, // 🔹 학번 추가
        eventName,
        visitDate: refund.visitDate,
        visitTime: refund.visitTime,
        refundPermissionStatus: refund.refundPermissionStatus
          ? "TRUE"
          : "FALSE",
        refundReason: refund.refundReason,
        _id: refund._id,
      };
    });
  }

  //2. id가 일치하는 소속만 필터
  const targetAffiliation = (user.affiliations || []).find(
    (aff) => aff.id === affiliationId
  );

  if (!targetAffiliation) return [];

  // 3. 해당 소속 이름으로 티켓 조회
  const tickets = await Ticket.find({
    affiliation: targetAffiliation.name,
  });
  if (!tickets.length) return [];

  const ticketIds = tickets.map((t) => t._id);

  // 4. 티켓 ID로 환불 조회
  const refunds = await Refund.find({
    ticketId: { $in: ticketIds },
  });
  if (!refunds.length) return [];

  // 5. 티켓 정보 붙여서 결과 반환
  return refunds.map((refund) => {
    const ticket = tickets.find((t) => t._id.equals(refund.ticketId));
    const eventName = ticket ? ticket.eventTitle : "이벤트 정보 없음";

    return {
      name: refund.name,
      studentId: refund.studentId, // 🔹 학번 추가
      eventName,
      visitDate: refund.visitDate,
      visitTime: refund.visitTime,
      refundPermissionStatus: refund.refundPermissionStatus ? "TRUE" : "FALSE",
      refundReason: refund.refundReason,
      _id: refund._id,
    };
  });
};
