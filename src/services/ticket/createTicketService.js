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

export const createTicket = async (body) => {
  let {
    eventTitle,
    eventDay,
    eventStartTime,
    eventEndTime,
    eventPlace,
    eventPlaceComment,
    eventComment,
    eventCode,
    affiliation,
    kakaoPlace,
  } = body;

  // 누락 필드 리스트 만들기
  const missingFields = [];
  if (!eventTitle) missingFields.push("eventTitle");
  if (!eventDay) missingFields.push("eventDay");
  if (!eventStartTime) missingFields.push("eventStartTime");
  if (!eventEndTime) missingFields.push("eventEndTime");
  if (!eventPlace) missingFields.push("eventPlace");
  if (!eventPlaceComment) missingFields.push("eventPlaceComment");
  if (!eventComment) missingFields.push("eventComment");
  if (!affiliation) missingFields.push("affiliation");

  if (missingFields.length > 0) {
    console.error(`❗ 필수 필드 누락: [${missingFields.join(", ")}]`);
    return {
      status: 400,
      code: "ERROR-0003",
      message: `다음 필드를 채워주세요: ${missingFields.join(", ")}`,
    };
  }

  // kakaoPlace가 문자열이면 JSON.parse로 변환
  if (typeof kakaoPlace === "string") {
    try {
      kakaoPlace = JSON.parse(kakaoPlace);
    } catch (error) {
      console.error("⚠️ kakaoPlace JSON 파싱 오류:", error);
      kakaoPlace = null;
    }
  }

  // 이벤트 코드 생성 또는 중복 검사
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

  // 시간 포맷팅
  const formattedEventStartTime = moment(eventStartTime, "HH:mm:ss").format(
    "HH:mm:ss"
  );
  const formattedEventEndTime = moment(eventEndTime, "HH:mm:ss").format(
    "HH:mm:ss"
  );

  // 새 티켓 생성
  const newTicket = new Ticket({
    eventTitle,
    eventDay,
    eventStartTime: formattedEventStartTime,
    eventEndTime: formattedEventEndTime,
    eventPlace,
    eventPlaceComment,
    eventComment,
    eventCode: finalEventCode,
    affiliation,
    kakaoPlace,
  });

  const savedTicket = await newTicket.save();

  return {
    status: 201,
    code: "SUCCESS-0000",
    message: "이벤트가 성공적으로 생성되었습니다.",
    result: savedTicket,
  };
};
