import Ticket from "../../models/ticketModel.js";
import Refund from "../../models/refundModel.js";
import Payment from "../../models/paymentModel.js";
import User from "../../models/userModel.js";
import Affiliation from "../../models/affiliationModel.js";
import moment from "moment";
import "moment/locale/ko.js";

moment.locale("ko");

const getTicketStatus = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return "상태 없음";

  if (ticket.status === "만료됨") return "만료됨";

  const refund = await Refund.findOne({ ticketId });
  if (refund) {
    if (refund.refundPermissionStatus === false) return "환불중";
    if (refund.refundPermissionStatus === true) return "환불됨";
  }

  const payment = await Payment.findOne({ ticketId });
  if (payment) {
    if (payment.paymentPermissionStatus === false) return "사용 불가";
    if (payment.paymentPermissionStatus === true) return "사용 가능";
  }

  return "상태 없음";
};

export const getAdminTicketsWithStatus = async (studentId) => {
  // 1. 유저 찾기
  const user = await User.findOne({ studentId });
  if (!user) return [];

  // 2. 유저가 관리자인 소속 ID 목록
  const adminAffiliations = await Affiliation.find({ admins: user._id });
  if (!adminAffiliations.length) return [];

  const adminAffiliationIds = adminAffiliations.map((a) => a._id);

  // 3. 티켓 조회 (해당 affiliationId만)
  const tickets = await Ticket.find({
    affiliationId: { $in: adminAffiliationIds },
  });

  if (!tickets.length) return [];

  // 4. 상태, 날짜 포맷
  const ticketStatuses = await Promise.all(
    tickets.map(async (ticket) => {
      const status = await getTicketStatus(ticket._id);

      return {
        ...ticket.toObject(),
        eventDay: moment(ticket.eventDay).format("YYYY.MM.DD(ddd)"),
        eventStartTime: moment(ticket.eventStartTime, [
          "HH:mm:ss",
          "HH:mm",
        ]).format("HH:mm"),
        eventEndTime: moment(ticket.eventEndTime, ["HH:mm:ss", "HH:mm"]).format(
          "HH:mm"
        ),
        status,
      };
    })
  );

  return ticketStatuses;
};
