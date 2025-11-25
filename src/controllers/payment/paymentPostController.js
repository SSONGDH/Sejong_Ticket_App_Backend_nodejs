import { savePaymentData } from "../../services/payment/paymentPostService.js";
// import verifySSOService ... (삭제)

export const paymentPostController = async (req, res) => {
  try {
    // [변경 핵심] 미들웨어(authenticate)가 유저 정보를 다 찾아놨습니다.
    // 이름, 학번, 학과 정보를 바로 꺼내 씁니다.
    const { name, studentId, major } = req.user;

    const { ticketId, phone } = req.body;

    /* [삭제된 로직]
       - ssotoken 쿠키 검사
       - verifySSOService 호출
    */

    // 필수 데이터 검증 (파일, 전화번호, 티켓ID)
    if (!ticketId || !phone || !req.file) {
      return res.status(400).json({
        isSuccess: false,
        code: "ERROR-0002",
        message: "필수 데이터가 누락되었습니다.",
        result: [],
      });
    }

    // 이미지 URL 생성
    const imageUrl = `${req.protocol}://${req.get("host")}/paymentPictures/${
      req.file.filename
    }`;

    // 서비스 호출 (기존 로직 유지)
    const newPayment = await savePaymentData({
      ticketId,
      name, // JWT에서 온 정보
      studentId, // JWT에서 온 정보
      phone,
      major, // JWT에서 온 정보
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
