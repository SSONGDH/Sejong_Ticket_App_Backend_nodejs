import {
  getMyPageInfoByStudentId,
  updateAffiliationByStudentId,
} from "../../services/user/mypageService.js";
// import verifySSOService ... (삭제)

// 1. 마이페이지 조회
export const getMyPage = async (req, res) => {
  try {
    // [변경 핵심] 미들웨어(authenticate)가 검증한 유저의 학번 사용
    const { studentId } = req.user;

    /* [삭제된 로직들]
       - const ssotoken = req.cookies.ssotoken;
       - verifySSOService.verifySSOToken...
    */

    // 서비스 호출
    const userInfo = await getMyPageInfoByStudentId(studentId);

    return res.status(200).json({
      code: "SUCCESS-0000",
      message: "마이페이지 정보 조회 성공",
      result: userInfo,
    });
  } catch (error) {
    console.error("❌ 마이페이지 조회 중 오류:", error);
    return res.status(error.status || 500).json({
      code: "ERROR-9999",
      message: error.message || "서버 오류",
      result: null,
    });
  }
};

// 2. 소속 정보 업데이트 (이 함수도 같은 파일에 있으니 같이 수정!)
export const updateAffiliation = async (req, res) => {
  try {
    // [변경 핵심] 여기도 똑같이 req.user 사용
    const { studentId } = req.user;

    const { affiliationList } = req.body;

    if (!Array.isArray(affiliationList)) {
      return res.status(400).json({
        code: "ERROR-0003",
        message: "affiliationList는 배열이어야 합니다.",
        result: null,
      });
    }

    // 서비스 호출
    const updatedUser = await updateAffiliationByStudentId(
      studentId,
      affiliationList
    );

    return res.status(200).json({
      code: "SUCCESS-0001",
      message: "소속 정보가 성공적으로 업데이트되었습니다.",
      result: updatedUser,
    });
  } catch (error) {
    console.error("❌ 소속 업데이트 중 오류:", error);
    return res.status(error.status || 500).json({
      code: "ERROR-9999",
      message: error.message || "서버 오류",
      result: null,
    });
  }
};
