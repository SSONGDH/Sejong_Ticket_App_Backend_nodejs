import User from "../../models/userModel.js";

export const getMyPageInfoByStudentId = async (studentId) => {
  const user = await User.findOne({ studentId }).select(
    "affiliation name studentId major"
  );

  if (!user) {
    const error = new Error("해당 학번의 유저를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  return user;
};
