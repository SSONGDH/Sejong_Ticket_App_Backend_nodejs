import verifySSOService from "../../services/ssoAuth.js";
import { savePaymentData } from "../../services/payment/paymentPostService.js";

export const paymentPostController = async (req, res) => {
  try {
    const { ticketId, phone } = req.body;
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
    const { name, studentId, major } = userProfile;

    if (!ticketId || !phone || !req.file) {
      return res.status(400).json({
        isSuccess: false,
        code: "ERROR-0002",
        message: "필수 데이터가 누락되었습니다.",
        result: [],
      });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/paymentPictures/${
      req.file.filename
    }`;
    const newPayment = await savePaymentData({
      ticketId,
      name,
      studentId,
      phone,
      major,
      imageUrl,
    });

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "납부내역이 성공적으로 저장되었습니다.",
      result: newPayment,
    });
  } catch (error) {
    console.error("❌ 결제 저장 오류:", error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0003",
      message: "서버 오류",
      result: [],
    });
  }
};
