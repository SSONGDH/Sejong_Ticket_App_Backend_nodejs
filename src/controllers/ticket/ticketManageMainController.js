import { getAdminTicketsWithStatus } from "../../services/ticket/ticketManageMainService.js";
// import verifySSOService ... (삭제)

export const getAdminTickets = async (req, res) => {
  try {
    // [변경 핵심] 미들웨어(authenticate)가 검증한 유저의 학번을 바로 사용
    const { studentId } = req.user;

    /* [삭제된 로직들]
       - const ssotoken = req.cookies.ssotoken;
       - verifySSOService.verifySSOToken...
    */

    // 서비스 호출 (서비스 코드는 studentId만 있으면 되므로 수정 불필요)
    const tickets = await getAdminTicketsWithStatus(studentId);

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "관리 소속 티켓 조회 성공",
      result: tickets || [],
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
