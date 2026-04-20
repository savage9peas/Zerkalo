const RU_PHONE_DIGITS = 10;

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function normalizeRuPhone(raw: string): string | null {
  const digits = onlyDigits(raw);
  if (!digits) {
    return null;
  }

  if (digits.length === RU_PHONE_DIGITS) {
    return `+7${digits}`;
  }

  if (digits.length === RU_PHONE_DIGITS + 1 && (digits[0] === "7" || digits[0] === "8")) {
    return `+7${digits.slice(1)}`;
  }

  return null;
}

export function isCompleteRuPhone(raw: string): boolean {
  return normalizeRuPhone(raw) !== null;
}

export function formatRuPhoneForInput(raw: string): string {
  const normalized = normalizeRuPhone(raw);
  const digits = normalized ? normalized.slice(2) : onlyDigits(raw).slice(-RU_PHONE_DIGITS);
  const d = digits.padEnd(RU_PHONE_DIGITS, "_");
  return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`.replace(
    /_/g,
    ""
  );
}

export function applyRuPhoneMask(raw: string): string {
  const digits = onlyDigits(raw);
  let ten = "";

  if (digits.startsWith("7") || digits.startsWith("8")) {
    ten = digits.slice(1, 11);
  } else {
    ten = digits.slice(0, 10);
  }

  const a = ten.slice(0, 3);
  const b = ten.slice(3, 6);
  const c = ten.slice(6, 8);
  const e = ten.slice(8, 10);

  let formatted = "+7";
  if (a.length > 0) {
    formatted += ` (${a}`;
    if (a.length === 3) {
      formatted += ")";
    }
  }
  if (b.length > 0) {
    formatted += ` ${b}`;
  }
  if (c.length > 0) {
    formatted += `-${c}`;
  }
  if (e.length > 0) {
    formatted += `-${e}`;
  }

  return formatted;
}
