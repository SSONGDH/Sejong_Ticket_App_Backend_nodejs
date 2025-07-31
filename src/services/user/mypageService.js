import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";

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

  // 빈 문자열, undefined 처리 → null로 전환
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
