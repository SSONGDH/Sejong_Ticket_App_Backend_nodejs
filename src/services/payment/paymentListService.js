import Payment from "../../models/paymentModel.js";
import Ticket from "../../models/ticketModel.js";
import User from "../../models/userModel.js";

/**
 * 주어진 studentId와 affiliationId를 기준으로 admin 권한의 결제 목록 조회
 * root 계정이면 모든 결제 내역 반환
 * @param {string} studentId
 * @param {string} affiliationId
 * @returns {Array} payments
 */
export const getPaymentListByAdmin = async (studentId, affiliationId) => {
  // 1. 유저 조회
  const user = await User.findOne({ studentId });
  if (!user) return [];

  // 📌 root면 모든 결제 내역 조회
  if (user.root === true) {
    const payments = await Payment.find({});
    if (!payments.length) return [];

    return payments.map((payment) => ({
      ticketId: payment.ticketId,
      paymentId: payment._id,
      name: payment.name,
      studentId: payment.studentId,
      paymentPermissionStatus: payment.paymentPermissionStatus,
    }));
  }

  // 2. id가 일치하는 소속 찾기
  const targetAffiliation = (user.affiliations || []).find(
    (aff) => aff.id === affiliationId
  );

  if (!targetAffiliation) return [];

  // 3. 해당 소속의 name 으로 티켓 조회
  const tickets = await Ticket.find({
    affiliation: targetAffiliation.name,
  });
  if (!tickets.length) return [];

  const ticketIds = tickets.map((t) => t._id);

  // 4. 티켓 ID로 결제 조회
  const payments = await Payment.find({
    ticketId: { $in: ticketIds },
  });
  if (!payments.length) return [];

  // 5. 필요한 필드만 반환
  return payments.map((payment) => ({
    ticketId: payment.ticketId,
    paymentId: payment._id,
    name: payment.name,
    studentId: payment.studentId,
    paymentPermissionStatus: payment.paymentPermissionStatus,
  }));
};
