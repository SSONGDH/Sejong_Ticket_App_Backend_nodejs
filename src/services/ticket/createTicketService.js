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
    affiliation, // ✅ 소속 필드
    naverPlace, // ✅ 네이버 장소 필드
  } = body;

  console.log("naverPlace 타입:", typeof naverPlace);
  console.log("📍 naverPlace 값:", naverPlace); // <-- 여기에 추가
  // 필수값 검사
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

  // 중복 이벤트 코드 검사 또는 생성
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

  // 시간 포맷
  const formattedEventStartTime = moment(eventStartTime, "HH:mm:ss").format(
    "HH:mm:ss"
  );
  const formattedEventEndTime = moment(eventEndTime, "HH:mm:ss").format(
    "HH:mm:ss"
  );

  // 이미지 URL
  const eventPlacePicture = file
    ? `${req.protocol}://${req.get("host")}/eventUploads/${file.filename}`
    : null;

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
    eventPlacePicture,
    affiliation,
    naverPlace, // ✅ 네이버 장소 정보 저장
  });

  const savedTicket = await newTicket.save();

  return {
    status: 201,
    code: "SUCCESS-0000",
    message: "이벤트가 성공적으로 생성되었습니다.",
    result: savedTicket,
  };
};
