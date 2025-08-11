import Payment from "../../models/paymentModel.js";
import Ticket from "../../models/ticketModel.js";
import User from "../../models/userModel.js";

/**
 * 주어진 studentId를 가진 유저가 admin 권한을 가진 소속의 결제 목록을 조회하는 함수
 * @param {string} studentId
 * @returns {Array} payments
 */
export const getPaymentListByAdmin = async (studentId) => {
  // 1. 유저 조회
  const user = await User.findOne({ studentId });
  if (!user) return [];

  // 2. admin 권한 있는 소속 이름 목록 추출
  const adminAffiliationNames = (user.affiliations || [])
    .filter((aff) => aff.admin)
    .map((aff) => aff.name);

  if (adminAffiliationNames.length === 0) return [];

  // 3. 소속 이름으로 티켓 조회
  const tickets = await Ticket.find({
    affiliation: { $in: adminAffiliationNames },
  });
  if (!tickets.length) return [];

  const ticketIds = tickets.map((t) => t._id);

  // 4. 티켓 ID에 해당하는 결제 조회
  const payments = await Payment.find({
    ticketId: { $in: ticketIds },
  });

  if (!payments.length) return [];

  // 5. 필요한 필드만 맵핑해서 반환
  return payments.map((payment) => ({
    ticketId: payment.ticketId,
    paymentId: payment._id,
    name: payment.name,
    studentId: payment.studentId,
    paymentPermissionStatus: payment.paymentPermissionStatus,
  }));
};
