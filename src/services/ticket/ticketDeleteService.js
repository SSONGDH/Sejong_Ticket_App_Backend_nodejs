import Ticket from "../../models/ticketModel.js";
import User from "../../models/userModel.js";
import Payment from "../../models/paymentModel.js";
import Refund from "../../models/refundModel.js";

export const deleteTicketAndRelatedData = async (ticketId) => {
  // 1. 티켓 삭제
  const deletedTicket = await Ticket.findByIdAndDelete(ticketId);
  if (!deletedTicket) {
    return {
      status: 404,
      code: "ERROR-0002",
      message: "해당 티켓을 찾을 수 없습니다.",
    };
  }

  // 2. User 컬렉션에서 tickets 배열에서 ticketId 제거
  await User.updateMany(
    { tickets: ticketId },
    { $pull: { tickets: ticketId } }
  );

  // 3. Payment 컬렉션에서 해당 ticketId 삭제
  await Payment.deleteMany({ ticketId });

  // 4. Refund 컬렉션에서 ticketId 관련 환불들 찾기 및 삭제
  const relatedRefunds = await Refund.find({ ticketId });

  if (relatedRefunds.length > 0) {
    const refundIds = relatedRefunds.map((r) => r._id.toString());

    // 4-1. User 컬렉션에서 refunds 배열에서 해당 refundId들 제거
    await User.updateMany(
      { refunds: { $in: refundIds } },
      { $pull: { refunds: { $in: refundIds } } }
    );

    // 4-2. Refund 컬렉션에서 해당 refundId들 삭제
    await Refund.deleteMany({ _id: { $in: refundIds } });
  }

  return {
    status: 200,
    code: "SUCCESS-0001",
    message:
      "티켓이 성공적으로 삭제되었으며 관련 유저, 결제, 환불 정보도 정리되었습니다.",
    result: deletedTicket,
  };
};
