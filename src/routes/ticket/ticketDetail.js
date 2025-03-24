import express from "express";
import Ticket from "../../models/ticketModel.js"; // 티켓 모델 불러오기

const router = express.Router();

router.get("/ticket/detail", async (req, res) => {
  const ticketId = req.query.ticketId; // 쿼리 파라미터에서 ticketId 받기

  if (!ticketId) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0003",
      message: "티켓 ID가 누락되었습니다.",
      result: [],
    });
  }

  try {
    // DB에서 특정 티켓 데이터 조회
    const ticket = await Ticket.findById(ticketId, {
      eventTitle: 1,
      eventDay: 1,
      eventStartTime: 1, // ⏰ 시작 시간 추가
      eventEndTime: 1, // ⏰ 종료 시간 추가
      eventPlace: 1,
      eventComment: 1,
      eventPlaceComment: 1,
      eventPlacePicture: 1, // 📸 이미지 URL 추가
    });

    if (!ticket) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0004",
        message: "해당 티켓을 찾을 수 없습니다.",
        result: [],
      });
    }

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "요청에 성공하였습니다.",
      result: ticket,
    });
  } catch (error) {
    console.error("❌ 티켓 조회 중 오류 발생:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0002",
      message: "서버 오류",
      result: [],
    });
  }
});

export default router;
