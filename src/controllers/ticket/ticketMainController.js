import { getUserTicketsWithStatus } from "../../services/ticket/ticketMainService.js";
// import verifySSOService ... (삭제)

export const ticketMainController = async (req, res) => {
  try {
    // [변경 핵심] 미들웨어(authenticate)가 검증한 유저의 학번을 바로 사용
    // DB 조회 없이 JWT에서 나온 학번을 믿고 바로 티켓 목록을 조회하므로 엄청 빠름!
    const { studentId } = req.user;

    /* [삭제된 로직들]
       - const ssotoken = req.cookies.ssotoken;
       - verifySSOService.verifySSOToken...
    */

    // 서비스 호출
    const ticketStatuses = await getUserTicketsWithStatus(studentId);

    if (!ticketStatuses) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "등록된 티켓 데이터가 없습니다.",
        result: [],
      });
    }

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "요청에 성공하였습니다.",
      // 맵핑 로직 그대로 유지
      result: ticketStatuses.map((ticket) => ({
        _id: ticket._id,
        eventTitle: ticket.eventTitle,
        eventDay: ticket.eventDay,
        eventStartTime: ticket.eventStartTime,
        eventEndTime: ticket.eventEndTime,
        eventPlace: ticket.eventPlace,
        status: ticket.status,
        affiliation: ticket.affiliation,
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
};
