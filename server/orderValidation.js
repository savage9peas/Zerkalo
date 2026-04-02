export function countPhoneDigits(phone) {
  return String(phone ?? "").replace(/\D/g, "").length;
}

/**
 * @returns {{ ok: true } | { ok: false, error: string, errors: Record<string, string> }}
 */
export function validateOrderBody(body) {
  const errors = {};

  const name = String(body?.name ?? "").trim();
  if (!name) {
    errors.name = "Укажите имя.";
  }

  const digits = countPhoneDigits(body?.phone);
  if (digits < 11) {
    errors.phone =
      "Укажите телефон: нужно не меньше 11 цифр (можно с +, пробелами и дефисами).";
  }

  const pickup_id = String(body?.pickup_id ?? "").trim();
  if (!pickup_id) {
    errors.pickup_id = "Выберите пункт выдачи на карте.";
  }

  const pickup_address = String(body?.pickup_address ?? "").trim();
  if (!pickup_address) {
    errors.pickup_address =
      "Не удалось получить адрес пункта выдачи. Выберите пункт ещё раз.";
  }

  const keys = Object.keys(errors);
  if (keys.length === 0) {
    return { ok: true };
  }

  const firstKey = keys[0];
  return {
    ok: false,
    error: errors[firstKey],
    errors,
  };
}
