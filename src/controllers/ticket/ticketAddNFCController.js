import { addTicketByNFC } from "../../services/ticket/ticketAddNFCService.js";
// import verifySSOService ... (삭제)

export const ticketAddNFCController = async (req, res) => {
  const { eventCode } = req.body;

  // [삭제된 로직] const ssotoken = req.cookies.ssotoken; ...

  if (!eventCode) {
    return res.status(400).json({
      isSuccess: false,
      code: "ERROR-0003",
      message: "eventCode가 누락되었습니다.",
    });
  }

  try {
    // [변경 핵심] 미들웨어(authenticate)가 검증한 유저 정보 사용
    const { name, studentId, major } = req.user;

    // 기존 서비스(addTicketByNFC)가 userProfile 객체를 필요로 하므로 만들어줍니다.
    const userProfile = { name, studentId, major };

    /* [삭제된 로직]
       - verifySSOService.verifySSOToken(ssotoken) 호출
    */

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
