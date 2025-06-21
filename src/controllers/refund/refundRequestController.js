import verifySSOService from "../../services/ssoAuth.js";
import { createRefundRequest } from "../../services/refund/refundRequestService.js";

export const refundRequestController = async (req, res) => {
  try {
    const ssotoken = req.cookies.ssotoken;

    if (!ssotoken) {
      return res.status(400).json({
        isSuccess: false,
        code: "ERROR-0001",
        message: "SSO 토큰이 없습니다.",
        result: [],
      });
    }

    const userProfile = await verifySSOService.verifySSOToken(ssotoken);

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
