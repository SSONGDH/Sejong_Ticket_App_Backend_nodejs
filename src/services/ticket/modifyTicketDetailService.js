import Ticket from "../../models/ticketModel.js";
import moment from "moment";

/**
 * 중복되지 않는 랜덤 eventCode 생성
 */
const generateUniqueEventCode = async () => {
  let uniqueCode;
  let isUnique = false;

  while (!isUnique) {
    uniqueCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const existingTicket = await Ticket.findOne({ eventCode: uniqueCode });
    if (!existingTicket) isUnique = true;
  }

  return uniqueCode;
};

export const createTicket = async (body, file, req) => {
  const {
    eventTitle,
    eventDay,
    eventStartTime,
    eventEndTime,
    eventPlace,
    eventPlaceComment,
    eventComment,
    eventCode,
    affiliation,
    naverPlace, // 전체 객체를 받음
  } = body;

  if (
    !eventTitle ||
    !eventDay ||
    !eventStartTime ||
    !eventEndTime ||
    !eventPlace ||
    !eventPlaceComment ||
    !eventComment ||
    !affiliation
  ) {
    return {
      status: 400,
      code: "ERROR-0003",
      message: "모든 필드를 채워주세요.",
    };
  }

  // naverPlace는 optional이지만, 만약 들어온다면 구조 체크 (간단히)
  const validnaverPlace =
    naverPlace &&
    typeof naverPlace === "object" &&
    naverPlace.place_name &&
    naverPlace.address_name &&
    naverPlace.x &&
    naverPlace.y;

  let finalEventCode = eventCode?.trim() || null;

  if (finalEventCode) {
    const existingTicket = await Ticket.findOne({ eventCode: finalEventCode });
    if (existingTicket) {
      return {
        status: 400,
        code: "ERROR-0004",
        message: "이벤트 코드가 중복됩니다. 다른 코드를 사용해주세요.",
      };
    }
  } else {
    finalEventCode = await generateUniqueEventCode();
  }

  const formattedEventStartTime = moment(eventStartTime, "HH:mm:ss").format(
    "HH:mm:ss"
  );
  const formattedEventEndTime = moment(eventEndTime, "HH:mm:ss").format(
    "HH:mm:ss"
  );

  const eventPlacePicture = file
    ? `${req.protocol}://${req.get("host")}/eventUploads/${file.filename}`
    : null;

  const newTicket = new Ticket({
    eventTitle,
    eventDay,
    eventStartTime: formattedEventStartTime,
    eventEndTime: formattedEventEndTime,
    eventPlace,
    eventPlaceComment,
    eventComment,
    eventCode: finalEventCode,
    eventPlacePicture,
    affiliation,
    naverPlace: validnaverPlace ? naverPlace : null,
  });

  const savedTicket = await newTicket.save();

  return {
    status: 201,
    code: "SUCCESS-0000",
    message: "이벤트가 성공적으로 생성되었습니다.",
    result: savedTicket,
  };
};

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
    affiliation: 1,
    naverPlace: 1,
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
