import User from "../../models/userModel.js";
// import verifySSOService ... (삭제)

export const rootConnection = async (req, res) => {
  try {
    // [변경 핵심] 미들웨어(authenticate)가 검증한 유저의 학번을 가져옵니다.
    const { studentId } = req.user;

    /* [삭제된 로직]
       - ssotoken 쿠키 검사
       - verifySSOService 호출
    */

    // DB에서 최신 유저 정보 조회 (보안을 위해 필수)
    // 토큰 발급 이후에 권한이 변경되었을 수도 있기 때문입니다.
    const user = await User.findOne({ studentId });

    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        code: "ERROR-0002",
        message: "해당 사용자를 찾을 수 없습니다.",
      });
    }

    // Root 권한 체크
    if (user.root === false) {
      return res.status(403).json({
        isSuccess: false,
        code: "ERROR-0003",
        message: "권한이 없습니다.",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      code: "SUCCESS-0000",
      message: "개발자 모드 접속이 확인되었습니다.",
    });
  } catch (error) {
    // 로그에 토큰 대신 studentId를 남기도록 수정
    console.error(`❌ 관리자 인증 오류 - user: ${req.user?.studentId}`, error);
    return res.status(500).json({
      isSuccess: false,
      code: "ERROR-0004",
      message: "서버 오류",
    });
  }
};
