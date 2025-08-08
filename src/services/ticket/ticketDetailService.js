import Ticket from "../../models/ticketModel.js";
import moment from "moment";
import "moment/locale/ko.js"; // 한글 요일 지원

moment.locale("ko"); // 한글 요일 출력 설정

export const getTicketDetail = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId, {
    eventTitle: 1,
    eventDay: 1,
    eventStartTime: 1,
    eventEndTime: 1,
    eventPlace: 1,
    eventComment: 1,
    eventPlaceComment: 1,

    affiliation: 1, // ✅ 추가
    kakaoPlace: 1, // ✅ 추가
  });

  if (!ticket) {
    return {
      status: 404,
      code: "ERROR-0004",
      message: "해당 티켓을 찾을 수 없습니다.",
      result: [],
    };
  }

  // 날짜와 시간 포맷 변경
  const formattedEventDay = moment(ticket.eventDay).format("YYYY.MM.DD(ddd)");
  const formattedStartTime = moment(ticket.eventStartTime, [
    "HH:mm:ss",
    "HH:mm",
  ]).format("HH:mm");
  const formattedEndTime = moment(ticket.eventEndTime, [
    "HH:mm:ss",
    "HH:mm",
  ]).format("HH:mm");

  const formattedTicket = {
    ...ticket.toObject(),
    eventDay: formattedEventDay,
    eventStartTime: formattedStartTime,
    eventEndTime: formattedEndTime,
  };

  return {
    status: 200,
    code: "SUCCESS-0000",
    message: "요청에 성공하였습니다.",
    result: formattedTicket,
  };
};
