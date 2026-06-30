import User from "../../models/userModel.js";
import Ticket from "../../models/ticketModel.js";
import moment from "moment";
import "moment/locale/ko.js";
import {
  getTicketStatus,
  getUserTicketsWithStatus,
} from "../ticket/ticketMainService.js";

moment.locale("ko");

const PARTICIPATED_STATUSES = new Set(["사용 가능", "만료됨"]);

const emptyCounts = () => ({
  participatedCount: 0,
  totalCount: 0,
  pendingCount: 0,
  refundCount: 0,
});

const formatParticipatedEvent = (ticket) => ({
  ticketId: ticket._id,
  eventTitle: ticket.eventTitle,
  eventDay: ticket.eventDay,
  eventStartTime: ticket.eventStartTime,
  eventEndTime: ticket.eventEndTime,
  eventPlace: ticket.eventPlace,
  affiliation: ticket.affiliation,
  status: ticket.status,
});

export const getUserParticipatedEventCount = async (studentId) => {
  const user = await User.findOne({ studentId }).select("tickets");

  if (!user?.tickets?.length) {
    return emptyCounts();
  }

  const tickets = await Ticket.find({ _id: { $in: user.tickets } });

  if (!tickets.length) {
    return emptyCounts();
  }

  let participatedCount = 0;
  let pendingCount = 0;
  let refundCount = 0;

  for (const ticket of tickets) {
    const status = await getTicketStatus(ticket._id, studentId);

    if (status === "사용 가능" || status === "만료됨") {
      participatedCount += 1;
    } else if (status === "사용 불가") {
      pendingCount += 1;
    } else if (status === "환불중" || status === "환불됨") {
      refundCount += 1;
    }
  }

  return {
    participatedCount,
    totalCount: tickets.length,
    pendingCount,
    refundCount,
  };
};

export const getUserParticipatedEventList = async (studentId) => {
  const tickets = await getUserTicketsWithStatus(studentId);

  if (!tickets?.length) {
    return [];
  }

  return tickets
    .filter((ticket) => PARTICIPATED_STATUSES.has(ticket.status))
    .map(formatParticipatedEvent)
    .sort(
      (a, b) =>
        moment(b.eventDay, "YYYY.MM.DD(ddd)").valueOf() -
        moment(a.eventDay, "YYYY.MM.DD(ddd)").valueOf()
    );
};
