import User from "../../models/userModel.js";
import Affiliation from "../../models/affiliationModel.js";
import {
  AFFILIATION_ROLES,
  applyAffiliationRole,
  isLeader,
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

  const previousAffiliations = user.affiliations || [];
  const newIdSet = new Set(
    affiliationList.map((aff) => String(aff._id || aff.affiliationId))
  );

  const removedAffiliations = previousAffiliations.filter(
    (prev) => !newIdSet.has(String(prev._id))
  );

  for (const removed of removedAffiliations) {
    if (isLeader(removed)) {
      const error = new Error(
        "소속장은 소속장 위임 후 소속을 나갈 수 있습니다."
      );
      error.status = 403;
      throw error;
    }
  }

  const updatedAffiliations = affiliationList.map((newAff) => {
    const affId = String(newAff._id || newAff.affiliationId);
    const existing = previousAffiliations.find(
      (prev) => String(prev._id) === affId
    );

    if (existing) {
      const ref = {
        _id: existing._id,
        name: existing.name || newAff.name,
      };
      applyAffiliationRole(ref, normalizeRole(existing));
      return ref;
    }

    const ref = {
      _id: newAff._id,
      name: newAff.name,
    };
    applyAffiliationRole(ref, AFFILIATION_ROLES.MEMBER);
    return ref;
  });

  user.affiliations = updatedAffiliations;
  await user.save();

  for (const removed of removedAffiliations) {
    const affiliationDoc = await Affiliation.findById(removed._id);
    if (!affiliationDoc) continue;

    affiliationDoc.members = affiliationDoc.members.filter(
      (memberId) => String(memberId) !== String(user._id)
    );
    affiliationDoc.membersCount = affiliationDoc.members.length;
    await affiliationDoc.save();
  }

  for (const added of updatedAffiliations) {
    const wasInPrevious = previousAffiliations.some(
      (prev) => String(prev._id) === String(added._id)
    );
    if (wasInPrevious) continue;

    let affiliationDoc = await Affiliation.findById(added._id);
    if (!affiliationDoc && added.name) {
      affiliationDoc = await Affiliation.findOne({ name: added.name });
    }
    if (!affiliationDoc) continue;

    const alreadyMember = affiliationDoc.members.some(
      (memberId) => String(memberId) === String(user._id)
    );
    if (!alreadyMember) {
      affiliationDoc.members.push(user._id);
      affiliationDoc.membersCount = affiliationDoc.members.length;
      await affiliationDoc.save();
    }
  }

  return user;
};
