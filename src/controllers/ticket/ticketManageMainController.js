import { getAdminTicketsWithStatus } from "../../services/ticket/ticketManageMainService";

export const getAdminTickets = async (req, res) => {
  try {
    const studentId = req.user?.studentId; // authMiddleware에서 넣어주는 값

    if (!studentId) {
      return res.status(401).json({
        isSuccess: false,
        code: "ERROR-0001",
        message: "로그인이 필요합니다.",
      });
    }

    const tickets = await getAdminTicketsWithStatus(studentId);

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
      code: "ERROR-0002",
      message: "서버 오류로 티켓 조회 실패",
    });
  }
};
