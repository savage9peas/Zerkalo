/** Количество цифр в строке телефона (игнорируются +, пробелы, скобки, дефисы и т.д.) */
export function countPhoneDigits(phone: string): number {
  return phone.replace(/\D/g, "").length;
}

export interface OrderFields {
  name: string;
  phone: string;
  pickup_id: string;
  pickup_address: string;
}

export function validateOrderFields(fields: OrderFields): { ok: true } | { ok: false; message: string } {
  const name = fields.name.trim();
  if (!name) {
    return { ok: false, message: "Укажите имя." };
  }

  const digits = countPhoneDigits(fields.phone);
  if (digits < 11) {
    return {
      ok: false,
      message: "Укажите телефон: нужно не меньше 11 цифр (можно с +, пробелами и дефисами).",
    };
  }

  const pickupId = fields.pickup_id.trim();
  if (!pickupId) {
    return { ok: false, message: "Выберите пункт выдачи на карте." };
  }

  const pickupAddress = fields.pickup_address.trim();
  if (!pickupAddress) {
    return { ok: false, message: "Не удалось получить адрес пункта выдачи. Выберите пункт ещё раз." };
  }

  return { ok: true };
}
