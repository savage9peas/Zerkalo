/** Допустимые статусы заказа (единая модель для API и SQLite). */
export const ORDER_STATUSES = Object.freeze([
  "draft",
  "pending_payment",
  "paid",
  "cancelled",
]);

/** @param {unknown} value */
export function isValidOrderStatus(value) {
  return typeof value === "string" && ORDER_STATUSES.includes(value);
}
