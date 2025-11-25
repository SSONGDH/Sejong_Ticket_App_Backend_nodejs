import { createRefundRequest } from "../../services/refund/refundRequestService.js";
// import verifySSOService ... (삭제)

export const refundRequestController = async (req, res) => {
  try {
    // [변경 핵심] 미들웨어(authenticate)가 검증한 유저 정보를 가져옵니다.
    // 기존 서비스(createRefundRequest)가 userProfile 객체를 원하므로
    // req.user에서 필요한 필드만 뽑아서 맞춰줍니다.
    const { name, studentId, major } = req.user;

    const userProfile = { name, studentId, major };

    /* [삭제된 로직들]
       - const ssotoken = req.cookies.ssotoken;
       - verifySSOService.verifySSOToken...
    */

    // 서비스 호출 (기존 코드와 호환성 유지)
    const response = await createRefundRequest(userProfile, req.body);

    return res.status(response.status).json({
      isSuccess: response.status === 200,
      code: response.code,
      message: response.message,
      result: response.result || [],
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
};