import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";

/**
 * 학생 ID로 마이페이지 정보 조회
 */
export const getMyPageInfoByStudentId = async (studentId) => {
  const user = await User.findOne({ studentId }).select(
    "affiliation name studentId major"
  );
  if (!user) {
    const error = new Error("해당 학생 ID로 유저를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }
  return user;
};

/**
 * 학생 ID로 소속(affiliation) 배열 업데이트
 */
export const updateAffiliationByStudentId = async (
  studentId,
  affiliationList
) => {
  // affiliationList를 MongoDB 배열 필드로 바로 저장한다고 가정
  const user = await User.findOneAndUpdate(
    { studentId },
    { affiliation: affiliationList },
    { new: true, runValidators: true }
  ).select("affiliation name studentId major");

  if (!user) {
    const error = new Error("해당 학생 ID로 유저를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }
  return user;
};

/**
 * JWT 토큰에서 userId를 검증하고, affiliation 필드 업데이트
 * (현재 컨트롤러에서는 사용하지 않고 있으므로 필요에 따라 삭제 가능)
 */
export const updateAffiliationService = async (req) => {
  const token = req.cookies.ssotoken;

  if (!token) {
    const error = new Error("로그인이 필요합니다.");
    error.status = 401;
    throw error;
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const error = new Error("유효하지 않은 토큰입니다.");
    error.status = 401;
    throw error;
  }

  const userId = decoded.userId;
  let { affiliation } = req.body;

  // 빈 문자열, undefined, null 처리 → null로 전환
  if (affiliation === undefined || affiliation === "" || affiliation === null) {
    affiliation = null;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { affiliation },
    { new: true, runValidators: true }
  ).select("affiliation name studentId major");

  if (!user) {
    const error = new Error("해당 유저를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  return user;
};
