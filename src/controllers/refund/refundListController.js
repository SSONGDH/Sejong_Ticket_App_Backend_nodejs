import verifySSOService from "../../services/ssoAuth.js";
import { getRefundListByAdmin } from "../../services/refund/refundListService.js";

export const refundListController = async (req, res) => {
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

    // 🔹 쿼리 파라미터에서 affiliationId 읽기
    const { affiliationId } = req.query;

    const result = await getRefundListByAdmin(
      userProfile.studentId,
      affiliationId
    );

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
