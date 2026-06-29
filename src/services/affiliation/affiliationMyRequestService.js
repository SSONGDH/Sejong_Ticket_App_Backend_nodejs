import AffiliationRequest from "../../models/affiliationRequestModel.js";

const REQUEST_TYPE_LABELS = {
  create: "소속 생성",
  admin: "주최자 권한",
};

const STATUS_LABELS = {
  pending: "심사 중",
  approved: "승인됨",
  rejected: "거절됨",
};

const resolveRequestType = (request) => {
  if (request.requestType) return request.requestType;
  return request.createAffiliation ? "create" : "admin";
};

const formatRequest = (request) => {
  const requestType = resolveRequestType(request);

  return {
    requestId: request._id,
    requestType,
    requestTypeLabel: REQUEST_TYPE_LABELS[requestType],
    affiliationName: request.affiliationName,
    phone: request.phone,
    status: request.status,
    statusLabel: STATUS_LABELS[request.status] || request.status,
    adminComment:
      request.status === "rejected" ? request.adminComment || "" : "",
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  };
};

export const getMyAffiliationRequests = async (studentId) => {
  const requests = await AffiliationRequest.find({ studentId }).sort({
    createdAt: -1,
  });

  const formatted = requests.map(formatRequest);

  const latestCreate = formatted.find((r) => r.requestType === "create") || null;
  const latestAdmin = formatted.find((r) => r.requestType === "admin") || null;

  return {
    hasCreateRequest: formatted.some((r) => r.requestType === "create"),
    hasAdminRequest: formatted.some((r) => r.requestType === "admin"),
    hasPendingCreate: formatted.some(
      (r) => r.requestType === "create" && r.status === "pending"
    ),
    hasPendingAdmin: formatted.some(
      (r) => r.requestType === "admin" && r.status === "pending"
    ),
    latestCreateRequest: latestCreate,
    latestAdminRequest: latestAdmin,
    requests: formatted,
  };
};
