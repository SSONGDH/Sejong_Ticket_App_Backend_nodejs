import Ticket from "../../models/ticketModel.js";
import Refund from "../../models/refundModel.js";
import Payment from "../../models/paymentModel.js";
import User from "../../models/userModel.js";
import moment from "moment";
import "moment/locale/ko"; // 한글 요일 지원

moment.locale("ko"); // 전역 로케일 설정

export const getTicketStatus = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return "상태 없음";

  if (ticket.status === "만료됨") {
    return "만료됨";
  }

  const refund = await Refund.findOne({ ticketId });
  if (refund) {
    if (refund.refundPermissionStatus === false) return "환불중";
    if (refund.refundPermissionStatus === true) return "환불됨";
  }

  const payment = await Payment.findOne({ ticketId });
  if (payment) {
    if (payment.paymentPermissionStatus === false) return "미승인";
    if (payment.paymentPermissionStatus === true) return "승인됨";
  }

  return "상태 없음";
};

export const getUserTicketsWithStatus = async (studentId) => {
  const user = await User.findOne({ studentId });

  if (!user || !user.tickets || user.tickets.length === 0) {
    return null;
  }

  const tickets = await Ticket.find({ _id: { $in: user.tickets } });
  if (!tickets || tickets.length === 0) {
    return null;
  }

  const ticketStatuses = await Promise.all(
    tickets.map(async (ticket) => {
      const status = await getTicketStatus(ticket._id);

      // 날짜, 시간 포맷 변경
      const formattedEventDay = moment(ticket.eventDay).format(
        "YYYY.MM.DD(ddd)"
      );
      const formattedStartTime = moment(ticket.eventStartTime, [
        "HH:mm:ss",
        "HH:mm",
      ]).format("HH:mm");
      const formattedEndTime = moment(ticket.eventEndTime, [
        "HH:mm:ss",
        "HH:mm",
      ]).format("HH:mm");

      return {
        ...ticket.toObject(),
        eventDay: formattedEventDay,
        eventStartTime: formattedStartTime,
        eventEndTime: formattedEndTime,
        status,
      };
    })
  );

  return ticketStatuses;
};
