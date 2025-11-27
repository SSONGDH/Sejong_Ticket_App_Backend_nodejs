import { submitAffiliationRequest } from "../../services/affiliation/affiliationRequestService.js";

export const postAffiliationRequest = async (req, res) => {
  try {
    const { name, major, studentId } = req.user;
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
      name,
      major,
      studentId,
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
