// controllers/user/adminAffiliationController.js
import { getAdminAffiliationsBySSO } from "../../services/user/adminAffiliationService.js";

export const getMyAdminAffilliaions = async (req, res) => {
  try {
    // 📌 쿠키에서 SSO 토큰 가져오기
    const ssoToken = req.cookies?.ssotoken;
    if (!ssoToken) {
      return res.status(400).json({ message: "SSO 토큰이 필요합니다." });
    }

    const adminAffiliations = await getAdminAffiliationsBySSO(ssoToken);

    return res.status(200).json({
      success: true,
      affiliations: adminAffiliations,
    });
  } catch (error) {
    console.error("❌ 관리자 소속 조회 오류:", error);
    return res.status(500).json({ message: error.message || "서버 오류" });
  }
};
