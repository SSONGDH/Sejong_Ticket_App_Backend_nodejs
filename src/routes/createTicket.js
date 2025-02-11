import express from "express";
import Ticket from "../models/ticketModel.js"; // 티켓 모델

const router = express.Router();

/**
 * 랜덤한 고유 eventCode 생성 (중복 방지)
 */
const generateUniqueEventCode = async () => {
  let uniqueCode;
  let isUnique = false;

  while (!isUnique) {
    uniqueCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const existingTicket = await Ticket.findOne({ eventCode: uniqueCode });
    if (!existingTicket) {
      isUnique = true;
    }
  }

  return uniqueCode;
};

// ✅ 티켓 생성 API
router.post("/ticket/createTicket", async (req, res) => {
  const {
    eventTitle,
    eventDay,
    eventTime,
    eventPlace,
    eventPlaceComment,
    eventComment,
    eventCode, // 클라이언트에서 보낸 eventCode (필수 아님)
  } = req.body;

  // ✅ 필수 필드 확인
  if (
    !eventTitle ||
    !eventDay ||
    !eventTime ||
    !eventPlace ||
    !eventPlaceComment ||
    !eventComment
  ) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0003",
      message: "모든 필드를 채워주세요.",
    });
  }

  try {
    let finalEventCode =
      eventCode && eventCode.trim() !== "" ? eventCode : null;

    // ✅ eventCode 중복 검사
    if (finalEventCode) {
      const existingTicket = await Ticket.findOne({
        eventCode: finalEventCode,
      });

      if (existingTicket) {
        return res.status(400).json({
          isSuccess: false,
          code: "ERROR-0004",
          message: "이벤트 코드가 중복됩니다. 다른 코드를 사용해주세요.",
        });
      }
    } else {
      // ✅ eventCode가 없으면 중복되지 않는 값 생성
      finalEventCode = await generateUniqueEventCode();
    }

    // ✅ 새로운 티켓 생성
    const newTicket = new Ticket({
      eventTitle,
      eventDay,
      eventTime,
      eventPlace,
      eventPlaceComment,
      eventComment,
      eventCode: finalEventCode, // 최종 eventCode 저장
    });

    const savedTicket = await newTicket.save();

    console.log("✅ DB 저장 완료:", savedTicket);

    return res.status(201).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "이벤트가 성공적으로 생성되었습니다.",
      result: savedTicket,
    });
  } catch (error) {
    console.error("❌ 오류 발생:", error);

    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0002",
      message: "서버 오류",
      result: [],
    });
  }
});

export default router;
