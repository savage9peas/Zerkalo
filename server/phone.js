function onlyDigits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

export function normalizeRuPhone(raw) {
  const digits = onlyDigits(raw);
  if (!digits) {
    return null;
  }

  if (digits.length === 10) {
    return `+7${digits}`;
  }

  if (digits.length === 11 && (digits[0] === "7" || digits[0] === "8")) {
    return `+7${digits.slice(1)}`;
  }

  return null;
}

export function isValidRuPhone(raw) {
  return normalizeRuPhone(raw) !== null;
}
