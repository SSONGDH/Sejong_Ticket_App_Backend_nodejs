import {
  getMyPageInfoByStudentId,
  updateAffiliationByStudentId,
} from "../../services/user/mypageService.js";

export const getMyPage = async (req, res) => {
  try {
    const { studentId } = req.user;
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

export const updateAffiliation = async (req, res) => {
  try {
    const { studentId } = req.user;

    const { affiliationList } = req.body;

    if (!Array.isArray(affiliationList)) {
      return res.status(400).json({
        code: "ERROR-0003",
        message: "affiliationList는 배열이어야 합니다.",
        result: null,
      });
    }

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
