// [변경 1] 서비스 함수 이름 변경 (BySSO -> ByStudentId)
// (주의: 서비스 파일에서도 함수 이름을 export const getAdminAffiliationsByStudentId = ... 로 바꿔주셨어야 합니다!)
import { getAdminAffiliationsByStudentId } from "../../services/user/adminAffiliationService.js";

export const getMyAdminAffilliaions = async (req, res) => {
  try {
    // [변경 2] 쿠키에서 토큰 꺼내는 로직 삭제
    // const ssoToken = req.cookies?.ssotoken; ... (삭제)

    // [변경 3] 미들웨어(authenticate)가 검증해준 req.user 사용
    const { studentId } = req.user;

    // [변경 4] 서비스 호출 (토큰 대신 학번 전달)
    const adminAffiliations = await getAdminAffiliationsByStudentId(studentId);

    return res.status(200).json({
      success: true,
      affiliations: adminAffiliations,
    });
  } catch (error) {
    console.error("❌ 관리자 소속 조회 오류:", error);
    return res.status(500).json({ message: error.message || "서버 오류" });
  }
};
