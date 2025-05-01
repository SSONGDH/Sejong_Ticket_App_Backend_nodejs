import express from "express";
import cookieParser from "cookie-parser"; // ✅ 쿠키 파싱 미들웨어 추가
import Refund from "../../models/refundModel.js"; // refund 모델 불러오기
import User from "../../models/userModel.js"; // user 모델 불러오기
import Ticket from "../../models/ticketModel.js"; // ticket 모델 불러오기
import verifySSOService from "../../service/ssoAuth.js"; // ssoAuth 서비스 불러오기

const router = express.Router();
router.use(cookieParser()); // ✅ 쿠키 사용 설정

// 환불 요청 처리
router.post("/refund/request", async (req, res) => {
  const { refundReason, visitDate, visitTime, ticketId, phone } = req.body;

  // SSO 토큰을 쿠키에서 가져오기
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
    // SSO 토큰을 사용하여 유저 정보 가져오기
    const userProfile = await verifySSOService.verifySSOToken(ssotoken);

    const { major, studentId, name, gradeLevel } = userProfile;

    // 요청 데이터가 모두 있는지 확인
    if (!refundReason || !visitDate || !visitTime || !ticketId) {
      return res.status(400).json({
        isSuccess: false,
        code: "ERROR-0002",
        message: "필수 데이터가 누락되었습니다.",
        result: [],
      });
    }

    // 사용자 데이터를 가져오고 해당 사용자의 tickets 필드에 ticketId가 있는지 확인
    const user = await User.findOne({ studentId });

    if (!user) {ㄴ
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "해당 사용자를 찾을 수 없습니다.",
        result: [],
      });
    }

    // tickets 배열에 ticketId가 있는지 확인 (String[] 형태)
    if (!user.tickets.includes(ticketId)) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0006",
        message: "현재 환불하려는 티켓은 없는 티켓입니다.",
        result: [],
      });
    }

    // 환불 요청 데이터를 refund 컬렉션에 저장
    const newRefund = new Refund({
      ticketId, // 중복 가능한 ticketId
      name,
      studentId,
      phone,
      refundReason,
      visitDate,
      visitTime,
      major, // major 추가
      permissionStatus: false, // 기본값을 false로 설정
    });

    // 환불 데이터를 DB에 저장
    const savedRefund = await newRefund.save();

    // refunds 배열에 새로운 refund _id 추가
    user.refunds.push(savedRefund._id);

    // 업데이트된 사용자 정보 저장
    await user.save();

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "환불 요청이 성공적으로 처리되었습니다.",
      result: savedRefund,
    });
  } catch (error) {
    console.error("환불 저장 오류:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0004",
      message: "서버 오류",
      result: [],
    });
  }
});

export default router;
