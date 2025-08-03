import User from "../../../models/userModel.js";
import Affiliation from "../../../models/affiliationModel.js"; // 소속 모델 추가

// 학생ID로 마이페이지 정보 조회
export const getMyPageInfoByStudentId = async (studentId) => {
  if (!studentId) {
    const error = new Error("studentId가 필요합니다.");
    error.status = 400;
    throw error;
  }

  const user = await User.findOne({ studentId }).select(
    "name studentId major affiliation"
  );

  if (!user) {
    const error = new Error("해당 유저를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  // 모든 소속 정보 (_id, name) 조회
  const totalAffiliation = await Affiliation.find().select("_id name");

  // user 객체에 totalAffiliation 필드 추가해서 반환
  return {
    _id: user._id,
    name: user.name,
    studentId: user.studentId,
    major: user.major,
    affiliation: user.affiliation,
    totalAffiliation,
  };
};

// 학생ID로 소속 정보 업데이트
export const updateAffiliationByStudentId = async (
  studentId,
  affiliationList
) => {
  if (!studentId) {
    const error = new Error("studentId가 필요합니다.");
    error.status = 400;
    throw error;
  }

  if (!Array.isArray(affiliationList)) {
    const error = new Error("affiliationList는 배열이어야 합니다.");
    error.status = 400;
    throw error;
  }

  const user = await User.findOneAndUpdate(
    { studentId },
    { affiliation: affiliationList },
    { new: true, runValidators: true }
  ).select("affiliation name studentId major");

  if (!user) {
    const error = new Error("해당 유저를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  return user;
};
