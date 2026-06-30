const normalizeName = (name) =>
  String(name ?? "")
    .replace(/\s/g, "")
    .trim();

export const maskedNameMatches = (expected, detected) => {
  const e = normalizeName(expected);
  const d = normalizeName(detected);

  if (!e || !d) return false;
  if (e === d) return true;

  if (d.includes("*")) {
    const pattern = `^${d[0]}.*${d[d.length - 1]}$`;
    return new RegExp(pattern).test(e);
  }

  if (e.includes("*")) {
    const pattern = `^${e[0]}.*${e[e.length - 1]}$`;
    return new RegExp(pattern).test(d);
  }

  return e.includes(d) || d.includes(e);
};

const parseDate = (value) => {
  if (!value) return null;
  const normalized = String(value).replace(/\./g, "-").slice(0, 10);
  const date = new Date(`${normalized}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const isDateOnOrAfter = (dateValue, minDateValue) => {
  const date = parseDate(dateValue);
  const minDate = parseDate(minDateValue);
  if (!date || !minDate) return false;
  return date >= minDate;
};

export const isDateInFuture = (dateValue) => {
  const date = parseDate(dateValue);
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

export const evaluatePaymentReview = ({
  criteria,
  payment,
  extracted,
  aiConfidence,
}) => {
  const reasons = [];
  let ruleScore = 0;

  if (!extracted.isTransferScreenshot) {
    reasons.push("송금 캡처 화면으로 인식되지 않음");
  } else {
    ruleScore += 0.2;
  }

  if (extracted.amount == null) {
    reasons.push("금액을 읽을 수 없음");
  } else if (Number(extracted.amount) !== Number(criteria.participationFee)) {
    reasons.push(
      `금액 불일치 (기대: ${criteria.participationFee}, 추출: ${extracted.amount})`
    );
  } else {
    ruleScore += 0.25;
  }

  if (!maskedNameMatches(payment.name, extracted.senderName)) {
    reasons.push(
      `보낸 사람 이름 불일치 (기대: ${payment.name}, 추출: ${extracted.senderName ?? "없음"})`
    );
  } else {
    ruleScore += 0.25;
  }

  if (!maskedNameMatches(criteria.accountHolderName, extracted.accountHolderName)) {
    reasons.push(
      `받는 사람 이름 불일치 (기대: ${criteria.accountHolderName}, 추출: ${extracted.accountHolderName ?? "없음"})`
    );
  } else {
    ruleScore += 0.2;
  }

  if (!extracted.date) {
    reasons.push("송금 날짜를 읽을 수 없음");
  } else if (!isDateOnOrAfter(extracted.date, criteria.announcementDate)) {
    reasons.push(
      `송금일이 공시일(${criteria.announcementDate}) 이전임 (추출: ${extracted.date})`
    );
  } else if (isDateInFuture(extracted.date)) {
    reasons.push(`송금일이 미래 날짜임 (추출: ${extracted.date})`);
  } else {
    ruleScore += 0.1;
  }

  const confidence = Number(aiConfidence) || 0;
  const combinedConfidence = confidence * 0.4 + ruleScore * 0.6;
  const canAutoApprove =
    reasons.length === 0 &&
    combinedConfidence >= 0.85 &&
    confidence >= 0.8;

  return {
    status: canAutoApprove ? "auto_approved" : "suspicious",
    reasons,
    ruleScore,
    combinedConfidence,
    canAutoApprove,
  };
};
