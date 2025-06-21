import Ticket from "../../models/ticketModel.js";

export const getTicketDetail = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId, {
    eventTitle: 1,
    eventDay: 1,
    eventStartTime: 1,
    eventEndTime: 1,
    eventPlace: 1,
    eventComment: 1,
    eventPlaceComment: 1,
    eventPlacePicture: 1,
  });

  if (!ticket) {
    return {
      status: 404,
      code: "ERROR-0004",
      message: "해당 티켓을 찾을 수 없습니다.",
      result: [],
    };
  }

  return {
    status: 200,
    code: "SUCCESS-0000",
    message: "요청에 성공하였습니다.",
    result: ticket,
  };
};
