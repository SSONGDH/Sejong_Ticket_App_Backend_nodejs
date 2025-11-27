import User from "../../models/userModel.js";

export const getAdminAffiliationsByStudentId = async (studentId) => {
  const user = await User.findOne({ studentId });

  if (!user) {
    throw new Error("해당 유저를 찾을 수 없습니다.");
  }

  const adminAffiliations = (user.affiliations || []).filter(
    (aff) => aff.admin === true
  );

  return adminAffiliations;
};
