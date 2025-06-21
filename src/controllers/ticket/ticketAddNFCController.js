import verifySSOService from "../../services/ssoAuth.js";
import { addTicketByNFC } from "../../services/ticket/ticketAddNFCService.js";

export const ticketAddNFCController = async (req, res) => {
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
    const userProfile = await verifySSOService.verifySSOToken(ssotoken);

    const response = await addTicketByNFC(userProfile, eventCode);

    return res.status(response.status).json({
      isSuccess: response.status === 200,
      code: response.code,
      message: response.message,
      result: response.result || [],
    });
  } catch (error) {
    console.error("❌ 티켓 추가 중 오류 발생:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0006",
      message: "서버 오류 발생",
    });
  }
};
