import express from "express";
import Ticket from "../models/ticketModel.js"; // 티켓 모델 불러오기

const router = express.Router();

router.put("/ticket/modifyTicket", async (req, res) => {
  const {
    _id,
    eventTitle,
    eventDay,
    eventStartTime, // ⏰ 시작 시간 추가
    eventEndTime, // ⏰ 종료 시간 추가
    eventPlace,
    eventPlaceComment,
    eventComment,
  } = req.body;

  if (!_id) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0001",
      message: "수정할 티켓의 _id가 없습니다.",
      result: [],
    });
  }

  try {
    // 해당 _id를 가진 티켓 업데이트
    const updatedTicket = await Ticket.findByIdAndUpdate(
      _id,
      {
        eventTitle,
        eventDay,
        eventStartTime, // ⏰ 반영
        eventEndTime, // ⏰ 반영
        eventPlace,
        eventPlaceComment,
        eventComment,
      },
      { new: true } // 업데이트 후 변경된 문서 반환
    );

    if (!updatedTicket) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "해당 _id의 티켓을 찾을 수 없습니다.",
        result: [],
      });
    }

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "티켓 정보가 성공적으로 수정되었습니다.",
      result: updatedTicket,
    });
  } catch (error) {
    console.error("❌ 티켓 수정 중 오류 발생:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0002",
      message: "서버 오류",
      result: [],
    });
  }
});

export default router;
