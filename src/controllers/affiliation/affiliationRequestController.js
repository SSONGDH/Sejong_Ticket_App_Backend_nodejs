import verifySSOService from "../../services/ssoAuth.js";
import { submitAffiliationRequest } from "../../services/affiliation/affiliationRequestService.js";

export const postAffiliationRequest = async (req, res) => {
  const ssotoken = req.cookies.ssotoken;

  if (!ssotoken) {
    return res.status(400).json({
      code: "ERROR-0001",
      message: "SSO 토큰이 없습니다.",
    });
  }

  try {
    const userProfile = await verifySSOService.verifySSOToken(ssotoken);
    if (!userProfile || !userProfile.studentId) {
      return res.status(401).json({
        code: "ERROR-0002",
        message: "SSO 인증 실패",
      });
    }

    const { phone, affiliationName, createAffiliation, requestAdmin } =
      req.body;

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

    const requestData = {
      name: userProfile.name,
      major: userProfile.major,
      studentId: userProfile.studentId,
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

    // 서비스에서 던진 에러를 클라이언트로 그대로 전달
    if (err.code === "ALREADY_MEMBER") {
      return res.status(400).json({ code: err.code, message: err.message });
    }

    if (err.code === "DUPLICATE_REQUEST") {
      return res.status(400).json({ code: err.code, message: err.message });
    }

    if (err.code === "AFFILIATION_NAME_EXISTS") {
      return res.status(400).json({ code: err.code, message: err.message });
    }

    // ✅ 새로 추가: 권한 요청인데 소속이 존재하지 않는 경우
    if (err.code === "AFFILIATION_NOT_FOUND") {
      return res.status(404).json({ code: err.code, message: err.message });
    }

    // 그 외 알 수 없는 에러
    return res.status(500).json({
      code: "ERROR-9999",
      message: "서버 오류가 발생했습니다.",
    });
  }
};

