import express from "express";
import Ticket from "../../models/ticketModel.js"; // 티켓 모델 불러오기

const router = express.Router();

router.get("/ticket/list", async (req, res) => {
  try {
    // DB에서 모든 티켓 데이터 조회
    const tickets = await Ticket.find();

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "요청에 성공하였습니다.",
      result: tickets,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0002",
      message: "서버 오류",
      result: [],
    });
  }
});

export default router;
