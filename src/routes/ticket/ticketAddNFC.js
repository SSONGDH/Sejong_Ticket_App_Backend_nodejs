import express from "express";
import cookieParser from "cookie-parser";
import Ticket from "../../models/ticketModel.js";
import User from "../../models/userModel.js";
import Payment from "../../models/paymentModel.js"; // ✅ Payment 모델 import
import verifySSOService from "../../service/ssoAuth.js";

const router = express.Router();
router.use(cookieParser());

router.post("/ticket/addNFC", async (req, res) => {
  const { eventCode } = req.body;
  const ssotoken = req.cookies.ssotoken;

  if (!ssotoken) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0003",
      message: "SSO 토큰이 없습니다.",
    });
  }

  if (!eventCode) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0003",
      message: "eventCode가 누락되었습니다.",
    });
  }

  try {
    // 1️⃣ SSO 토큰 검증 및 유저 정보 가져오기
    const userProfile = await verifySSOService.verifySSOToken(ssotoken);
    if (!userProfile) {
      return res.status(401).json({
        isSuccess: false,
        code: "ERROR-0007",
        message: "유효하지 않은 SSO 토큰입니다.",
      });
    }

    // 2️⃣ eventCode로 티켓 찾기
    const ticket = await Ticket.findOne({ eventCode });
    if (!ticket) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0004",
        message: "해당 eventCode의 티켓을 찾을 수 없습니다.",
      });
    }

    // 3️⃣ 유저 찾기
    const user = await User.findOne({ studentId: userProfile.studentId });
    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0005",
        message: "해당 사용자를 찾을 수 없습니다.",
      });
    }

    // 4️⃣ 유저의 티켓 목록에 티켓 추가 (중복 방지)
    if (!user.tickets) {
      user.tickets = [];
    }
    if (!user.tickets.includes(ticket._id)) {
      user.tickets.push(ticket._id);
      await user.save();
    }

    // 5️⃣ Payment 문서 생성 또는 이미 존재하는지 확인
    const existingPayment = await Payment.findOne({
      ticketId: ticket._id.toString(),
      studentId: user.studentId,
    });

    if (!existingPayment) {
      const newPayment = new Payment({
        ticketId: ticket._id.toString(),
        name: user.name,
        studentId: user.studentId,
        phone: user.phone || "현장 조사 필요",
        major: user.major,
        paymentPicture: "", // 현장 등록 시 이미지 없음
        paymentPermissionStatus: true, // NFC 등록 시 true로 설정
        etc: "NFC 현장 등록",
      });

      await newPayment.save();
    }

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0001",
      message:
        "티켓이 사용자에게 성공적으로 추가되었고, Payment 문서가 생성 또는 이미 존재합니다.",
      result: user,
    });
  } catch (error) {
    console.error("❌ 티켓 추가 중 오류 발생:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0006",
      message: "서버 오류 발생",
    });
  }
});

export default router;
