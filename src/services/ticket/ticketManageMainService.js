import Ticket from "../../models/ticketModel.js";
import User from "../../models/userModel.js";
import moment from "moment";
import "moment/locale/ko.js";

moment.locale("ko");

const getAdminTicketStatus = (ticket) => {
  if (ticket.status === "만료됨") {
    return "만료됨";
  }
  return "사용 가능";
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

  const ticketStatuses = tickets.map((ticket) => {
    const status = getAdminTicketStatus(ticket);

    const formattedEventDay = moment(ticket.eventDay).format("YYYY.MM.DD(ddd)");
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
  });

  return ticketStatuses;
};
