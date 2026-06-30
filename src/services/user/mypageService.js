import User from "../../models/userModel.js";
import Affiliation from "../../models/affiliationModel.js";
import {
  formatRoleFields,
  matchAffiliationId,
  normalizeRole,
} from "../../utils/affiliationRole.js";

export const getMyPageInfoByStudentId = async (studentId) => {
  if (!studentId) {
    const error = new Error("studentId가 필요합니다.");
    error.status = 400;
    throw error;
  }

  const user = await User.findOne({ studentId }).select(
    "name studentId major affiliations root"
  );

  if (!user) {
    const error = new Error("해당 유저를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  const totalAffiliation = await Affiliation.find().select("_id name");

  return {
    _id: user._id,
    name: user.name,
    studentId: user.studentId,
    major: user.major,
    root: user.root ?? false,
    affiliations: user.affiliations || [],
    totalAffiliation,
  };
};

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

  const user = await User.findOne({ studentId }).select(
    "affiliations name studentId major"
  );

  if (!user) {
    const error = new Error("해당 유저를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  const updatedAffiliations = affiliationList.map((newAff) => {
    const existingAff = (user.affiliations || []).find(
      (aff) =>
        matchAffiliationId(aff, newAff._id) ||
        (newAff.name && aff.name === newAff.name)
    );

    const role = normalizeRole(existingAff);

    return {
      _id: newAff._id,
      name: newAff.name,
      ...formatRoleFields({ role }),
    };
  });

  user.affiliations = updatedAffiliations;
  await user.save();

  return user;
};
