import { addTicketForUser } from "../../services/ticket/ticketAddService.js";

export const ticketAddController = async (req, res) => {
  try {
    const { eventCode } = req.body;

    // [변경] 쿠키에서 토큰 꺼내는 거 삭제!
    // const ssotoken = req.cookies.ssotoken;

    // [변경 핵심] 미들웨어가 찾아준 학번(studentId)을 가져옵니다.
    const { studentId } = req.user;

    // [변경] 서비스에 ssotoken 대신 studentId를 넘깁니다.
    // (방금 서비스 파일도 (eventCode, studentId) 받도록 수정했으니까요!)
    const response = await addTicketForUser(eventCode, studentId);

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
