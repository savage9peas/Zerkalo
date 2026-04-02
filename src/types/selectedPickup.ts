/** Единый источник истины для выбранного пункта выдачи (виджет → форма → submit). */
export type PickupType = "pickup_point" | "terminal";

export interface SelectedPickup {
  pickup_id: string;
  pickup_address: string;
  pickup_type: PickupType;
}
