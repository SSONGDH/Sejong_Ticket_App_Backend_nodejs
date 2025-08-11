import verifySSOService from "../../services/ssoAuth.js";
import { getAdminTicketsWithStatus } from "../../services/ticket/ticketManageMainService.js";

export const getAdminTickets = async (req, res) => {
  const ssotoken = req.cookies.ssotoken;

  if (!ssotoken) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0001",
      message: "SSO 토큰이 없습니다.",
      result: [],
    });
  }

  try {
    const userProfile = await verifySSOService.verifySSOToken(ssotoken);

    if (!userProfile || !userProfile.studentId) {
      return res.status(401).json({
        isSuccess: false,
        code: "ERROR-0002",
        message: "SSO 인증 실패",
        result: [],
      });
    }

    const tickets = await getAdminTicketsWithStatus(userProfile.studentId);

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "관리 소속 티켓 데이터가 없습니다.",
        result: [],
      });
    }

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "관리 소속 티켓 조회 성공",
      result: tickets,
    });
  } catch (error) {
    console.error("❌ 관리자 티켓 조회 오류:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0005",
      message: "서버 오류로 티켓 조회 실패",
      result: [],
    });
  }
};
