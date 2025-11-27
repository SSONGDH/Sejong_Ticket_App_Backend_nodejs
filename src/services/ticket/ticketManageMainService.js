import Ticket from "../../models/ticketModel.js";
import Refund from "../../models/refundModel.js";
import Payment from "../../models/paymentModel.js";
import User from "../../models/userModel.js";
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
  const user = await User.findOne({ studentId });
  if (!user) return [];

  let tickets = [];

  if (user.root === true) {
    tickets = await Ticket.find({});
  } else {
    const adminAffiliationNames = (user.affiliations || [])
      .filter((aff) => aff.admin === true)
      .map((aff) => aff.name);

    if (!adminAffiliationNames.length) return [];

    tickets = await Ticket.find({
      affiliation: { $in: adminAffiliationNames },
    });
  }

  if (!tickets.length) return [];

  const ticketStatuses = await Promise.all(
    tickets.map(async (ticket) => {
      const status = await getTicketStatus(ticket._id);

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
