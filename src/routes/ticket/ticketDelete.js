import express from "express";
import Ticket from "../../models/ticketModel.js";
import User from "../../models/userModel.js";
import Payment from "../../models/paymentModel.js";
import Refund from "../../models/refundModel.js";

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
    // 1️⃣ Ticket 삭제
    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

    if (!deletedTicket) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0002",
        message: "해당 티켓을 찾을 수 없습니다.",
      });
    }

    // 2️⃣ User 컬렉션에서 tickets 배열에서 ticketId 제거
    await User.updateMany(
      { tickets: ticketId },
      { $pull: { tickets: ticketId } }
    );

    // 3️⃣ Payment 컬렉션에서 해당 ticketId 삭제
    await Payment.deleteMany({ ticketId });

    // 4️⃣ Refund 컬렉션에서 해당 ticketId에 해당하는 환불들 찾아 삭제
    const relatedRefunds = await Refund.find({ ticketId });

    if (relatedRefunds.length > 0) {
      const refundIds = relatedRefunds.map((r) => r._id.toString());

      // 4-1️⃣ User 컬렉션에서 refunds 배열에서 해당 refundId들 제거
      await User.updateMany(
        { refunds: { $in: refundIds } },
        { $pull: { refunds: { $in: refundIds } } }
      );

      // 4-2️⃣ Refund 삭제
      await Refund.deleteMany({ _id: { $in: refundIds } });
    }

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0001",
      message:
        "티켓이 성공적으로 삭제되었으며 관련 유저, 결제, 환불 정보도 정리되었습니다.",
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
