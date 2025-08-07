import Ticket from "../../models/ticketModel.js";

export const getTicketDetailById = async (ticketId) => {
  if (!ticketId) {
    return {
      status: 400,
      code: "ERROR-0003",
      message: "티켓 ID가 누락되었습니다.",
    };
  }

  const ticket = await Ticket.findById(ticketId, {
    eventTitle: 1,
    eventDay: 1,
    eventStartTime: 1,
    eventEndTime: 1,
    eventPlace: 1,
    eventComment: 1,
    eventPlaceComment: 1,
    eventPlacePicture: 1,
    eventCode: 1,
    affiliation: 1, // ✅ 소속 추가
    kakaoPlace: 1, // ✅ 카카오 장소 정보 추가
  });

  if (!ticket) {
    return {
      status: 404,
      code: "ERROR-0004",
      message: "해당 티켓을 찾을 수 없습니다.",
    };
  }

  return {
    status: 200,
    code: "SUCCESS-0000",
    message: "요청에 성공하였습니다.",
    result: ticket,
  };
};
