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
    kakaoplace, // ✅ 추가
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
    kakaoplace: kakaoplace || null, // ✅ 추가
  });

  const savedTicket = await newTicket.save();

  return {
    status: 201,
    code: "SUCCESS-0000",
    message: "이벤트가 성공적으로 생성되었습니다.",
    result: savedTicket,
  };
};
