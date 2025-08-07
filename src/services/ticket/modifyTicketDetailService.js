import Ticket from "../../models/ticketModel.js";
import moment from "moment";

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
    kakaoPlace, // 전체 객체를 받음
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

  // kakaoPlace는 optional이지만, 만약 들어온다면 구조 체크 (간단히)
  const validKakaoPlace =
    kakaoPlace &&
    typeof kakaoPlace === "object" &&
    kakaoPlace.place_name &&
    kakaoPlace.address_name &&
    kakaoPlace.x &&
    kakaoPlace.y;

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
    kakaoPlace: validKakaoPlace ? kakaoPlace : null,
  });

  const savedTicket = await newTicket.save();

  return {
    status: 201,
    code: "SUCCESS-0000",
    message: "이벤트가 성공적으로 생성되었습니다.",
    result: savedTicket,
  };
};
