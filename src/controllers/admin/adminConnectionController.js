import User from "../../models/userModel.js";
// import verifySSOService ... (삭제: 더 이상 필요 없음)

export const adminConnection = async (req, res) => {
  try {
    // [변경 핵심] 미들웨어(authenticate)가 이미 검증을 끝내고
    // req.user에 studentId를 넣어두었습니다. 꺼내 쓰기만 하면 됩니다.
    const { studentId } = req.user;

    // DB에서 유저 찾기 (기존 로직 유지)
    // (JWT에 권한 정보가 있어도, 최신 권한 확인을 위해 DB 조회를 유지하는 것이 안전합니다)
    const user = await User.findOne({ studentId });

    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0002",
        message: "해당 사용자를 찾을 수 없습니다.",
      });
    }

    // 권한 여부 확인 (기존 로직 유지)
    const hasAnyAdminRole =
      user.root === true ||
      (Array.isArray(user.affiliations) &&
        user.affiliations.some((aff) => aff.admin === true));

    if (!hasAnyAdminRole) {
      return res.status(403).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "권한이 없습니다.",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "관리자 모드 접속이 확인되었습니다.",
    });
  } catch (error) {
    console.error("❌ adminConnection 오류:", error); // 로그 추가
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0004",
      message: "서버 오류",
    });
  }
};
