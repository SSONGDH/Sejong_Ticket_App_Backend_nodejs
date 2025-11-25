import { getRefundListByAdmin } from "../../services/refund/refundListService.js";
// import verifySSOService ... (삭제)

export const refundListController = async (req, res) => {
  try {
    // [변경 핵심] 미들웨어(authenticate)가 이미 검증을 끝내고
    // req.user에 studentId를 넣어두었습니다. 꺼내 쓰기만 하면 됩니다.
    const { studentId } = req.user;

    // 🔹 쿼리 파라미터에서 affiliationId 읽기 (기존 유지)
    const { affiliationId } = req.query;

    /* [삭제된 로직들]
       - const ssotoken = req.cookies.ssotoken;
       - verifySSOService...
    */

    // 서비스 호출
    const result = await getRefundListByAdmin(studentId, affiliationId);

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "환불 내역 조회 성공",
      result: result || [],
    });
  } catch (error) {
    console.error("❌ 서버 오류:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0003",
      message: "서버 오류",
      result: [],
    });
  }
};
