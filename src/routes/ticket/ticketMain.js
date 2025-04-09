import express from "express";
import cookieParser from "cookie-parser"; // 쿠키 파싱 미들웨어 추가
import Ticket from "../../models/ticketModel.js"; // 티켓 모델 불러오기
import User from "../../models/userModel.js"; // 유저 모델 불러오기
import Refund from "../../models/refundModel.js"; // 환불 DB 모델 불러오기
import Payment from "../../models/paymentModel.js"; // 결제 DB 모델 불러오기
import verifySSOService from "../../service/ssoAuth.js"; // SSO 인증 서비스 불러오기

const router = express.Router();
router.use(cookieParser()); // 쿠키 사용 설정

// 티켓 상태별로 조회하여 반환하는 함수
async function getTicketStatus(ticketId) {
  // 1️⃣ Refunds DB에서 해당 티켓의 환불 상태 조회
  const refund = await Refund.findOne({ ticketId });

  if (refund) {
    // 환불중 상태
    if (refund.refundPermissionStatus === false) {
      return "환불중";
    }
    // 환불됨 상태
    if (refund.refundPermissionStatus === true) {
      return "환불됨";
    }
  }

  // 2️⃣ Payments DB에서 해당 티켓의 결제 상태 조회
  const payment = await Payment.findOne({ ticketId });

  if (payment) {
    // 미승인 상태
    if (payment.paymentPermissionStatus === false) {
      return "미승인";
    }
    // 승인됨 상태
    if (payment.paymentPermissionStatus === true) {
      return "승인됨";
    }
  }

  // 상태가 없을 경우 기본값
  return "상태 없음";
}

router.get("/ticket/main", async (req, res) => {
  const ssotoken = req.cookies.ssotoken; // ✅ HTTP-Only 쿠키에서 SSO 토큰 가져오기

  if (!ssotoken) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0001",
      message: "SSO 토큰이 없습니다.",
      result: [],
    });
  }

  try {
    // 1️⃣ SSO 토큰을 검증하여 유저 프로필 가져오기
    const userProfile = await verifySSOService.verifySSOToken(ssotoken);

    if (!userProfile || !userProfile.studentId) {
      return res.status(401).json({
        isSuccess: false,
        code: "ERROR-0002",
        message: "SSO 인증 실패",
        result: [],
      });
    }

    // 2️⃣ 유저 DB에서 학번(studentId)으로 유저 찾기
    const user = await User.findOne({ studentId: userProfile.studentId });

    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "유저 정보를 찾을 수 없습니다.",
        result: [],
      });
    }

    // 3️⃣ 유저가 등록한 티켓 목록 조회
    const ticketIds = user.tickets;

    if (!ticketIds || ticketIds.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "등록된 티켓 데이터가 없습니다.",
        result: [],
      });
    }

    // 4️⃣ 티켓 ID를 기반으로 티켓 데이터 조회
    const tickets = await Ticket.find({
      _id: { $in: ticketIds },
    });

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0004",
        message: "등록된 티켓 데이터가 없습니다.",
        result: [],
      });
    }

    // 5️⃣ 각 티켓의 상태를 가져오기
    const ticketStatuses = await Promise.all(
      tickets.map(async (ticket) => {
        const status = await getTicketStatus(ticket._id);
        return { ...ticket.toObject(), status };
      })
    );

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "요청에 성공하였습니다.",
      result: ticketStatuses.map((ticket) => ({
        _id: ticket._id,
        eventTitle: ticket.eventTitle,
        eventDay: ticket.eventDay,
        eventStartTime: ticket.eventStartTime,
        eventEndTime: ticket.eventEndTime,
        eventPlace: ticket.eventPlace,
        status: ticket.status, // 상태 추가
      })),
    });
  } catch (error) {
    console.error("❌ 티켓 조회 중 오류 발생:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0005",
      message: "서버 오류",
      result: [],
    });
  }
});

export default router;
