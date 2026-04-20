import { isCompleteRuPhone } from "./phone";

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

  if (!isCompleteRuPhone(fields.phone)) {
    return {
      ok: false,
      message: "Укажите телефон в формате +7 (999) 123-45-67.",
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
