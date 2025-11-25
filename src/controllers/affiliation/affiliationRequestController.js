// import verifySSOService ... (삭제)
import { submitAffiliationRequest } from "../../services/affiliation/affiliationRequestService.js";

export const postAffiliationRequest = async (req, res) => {
  try {
    // [변경 핵심] 미들웨어(authenticate)가 로그인한 유저 정보를 req.user에 담아뒀습니다.
    // SSO 서비스 호출 없이 여기서 바로 꺼내 씁니다.
    const { name, major, studentId } = req.user;

    const { phone, affiliationName, createAffiliation, requestAdmin } =
      req.body;

    // 필수 항목 검증
    if (
      !phone ||
      !affiliationName ||
      createAffiliation == null ||
      requestAdmin == null
    ) {
      return res.status(400).json({
        code: "ERROR-0003",
        message: "필수 항목이 누락되었습니다.",
      });
    }

    // 서비스에 전달할 데이터 구성
    const requestData = {
      name, // req.user에서 온 정보
      major, // req.user에서 온 정보
      studentId, // req.user에서 온 정보
      phone,
      affiliationName,
      createAffiliation,
      requestAdmin,
    };

    const saved = await submitAffiliationRequest(requestData);

    return res.status(201).json({
      code: "SUCCESS-0000",
      message: "소속 신청이 완료되었습니다.",
      result: saved,
    });
  } catch (err) {
    console.error("❌ 소속 신청 중 오류:", err);

    // 에러 처리 로직 (기존 유지)
    if (err.code === "ALREADY_MEMBER") {
      return res.status(400).json({ code: err.code, message: err.message });
    }
    if (err.code === "DUPLICATE_REQUEST") {
      return res.status(400).json({ code: err.code, message: err.message });
    }
    if (err.code === "AFFILIATION_NAME_EXISTS") {
      return res.status(400).json({ code: err.code, message: err.message });
    }
    if (err.code === "AFFILIATION_NOT_FOUND") {
      return res.status(404).json({ code: err.code, message: err.message });
    }

    return res.status(500).json({
      code: "ERROR-9999",
      message: "서버 오류가 발생했습니다.",
    });
  }
};
