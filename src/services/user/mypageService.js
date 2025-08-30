import User from "../../models/userModel.js";
import Affiliation from "../../models/affiliationModel.js";

// 학생ID로 마이페이지 정보 조회
export const getMyPageInfoByStudentId = async (studentId) => {
  if (!studentId) {
    const error = new Error("studentId가 필요합니다.");
    error.status = 400;
    throw error;
  }

  const user = await User.findOne({ studentId }).select(
    "name studentId major affiliations"
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
    affiliations: user.affiliations || [],
    totalAffiliation,
  };
};

// 학생ID로 소속 정보 업데이트 (admin 값 새 값으로 덮어쓰기 가능)
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

  // 기존 유저 조회
  const user = await User.findOne({ studentId }).select(
    "affiliations name studentId major"
  );

  if (!user) {
    const error = new Error("해당 유저를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  // admin 값 새 값으로 덮어쓰기
  const updatedAffiliations = affiliationList.map((newAff) => {
    return {
      _id: newAff._id,
      name: newAff.name,
      admin: !!newAff.admin, // 기존 admin 값 무시하고 새 값 사용
    };
  });

  user.affiliations = updatedAffiliations;
  await user.save();

  return user;
};
