import express from "express";
import Ticket from "../../models/ticketModel.js";

const router = express.Router();

// PUT /ticket/delete - 티켓 삭제
router.put("/ticket/delete", async (req, res) => {
  const { ticketId } = req.body;

  if (!ticketId) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0001",
      message: "ticketId가 요청 바디에 없습니다.",
    });
  }

  try {
    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

    if (!deletedTicket) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0002",
        message: "해당 티켓을 찾을 수 없습니다.",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0001",
      message: "티켓이 성공적으로 삭제되었습니다.",
      result: deletedTicket,
    });
  } catch (error) {
    console.error("❌ 티켓 삭제 중 오류 발생:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0003",
      message: "서버 오류 발생",
    });
  }
});

export default router;
