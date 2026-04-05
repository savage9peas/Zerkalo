import { useEffect, useRef, useState } from "react";
import type { SelectedPickup, PickupType } from "../types/selectedPickup";

interface YaDeliveryCreateWidgetConfig {
  containerId: string;
  params: {
    city: string;
    size: {
      height: string;
      width: string;
    };
    delivery_price: string;
    delivery_term: string;
    show_select_button: boolean;
    filter: {
      type: Array<"pickup_point" | "terminal">;
    };
  };
}

interface YaDeliveryApi {
  createWidget: (config: YaDeliveryCreateWidgetConfig) => void;
}

interface YaNddWidgetPointSelectedDetail {
  id?: string | number;
  full_address?: string;
  locality?: string;
  street?: string;
  house?: string;
  comment?: string;
  type?: PickupType;
  point?: YaNddWidgetPointSelectedDetail;
  payload?: YaNddWidgetPointSelectedDetail;
  address?: string | { full_address?: string; formatted?: string; value?: string };
  data?: { point?: YaNddWidgetPointSelectedDetail };
}

declare global {
  interface Window {
    YaDelivery?: YaDeliveryApi;
  }

  interface WindowEventMap {
    YaNddWidgetLoad: Event;
  }
}

const CONTAINER_ID = "delivery-widget";

const WIDGET_PARAMS_BASE: Omit<YaDeliveryCreateWidgetConfig["params"], "size"> = {
  city: "Москва",
  delivery_price: " ",
  delivery_term: "от 1 дня",
  show_select_button: true,
  filter: {
    type: ["pickup_point", "terminal"],
  },
};

function widgetSizeForViewport(): { height: string; width: string } {
  if (typeof window === "undefined") {
    return { height: "540px", width: "100%" };
  }
  const narrow = window.matchMedia("(max-width: 767px)").matches;
  return narrow
    ? { height: "300px", width: "100%" }
    : { height: "540px", width: "100%" };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractPickupId(detail: unknown): string {
  const tryObj = (o: Record<string, unknown>): string | undefined => {
    const keys = ["id", "point_id", "pickup_id", "pointId", "gis_id", "delivery_point_id"];
    for (const key of keys) {
      const v = o[key];
      if (v !== undefined && v !== null && String(v).trim() !== "") {
        return String(v);
      }
    }
    return undefined;
  };

  if (!isRecord(detail)) {
    return "";
  }

  const direct = tryObj(detail);
  if (direct) {
    return direct;
  }

  const dataNode = isRecord(detail.data) ? detail.data : undefined;
  const nested = [detail.point, detail.payload, dataNode?.point];
  for (const node of nested) {
    if (isRecord(node)) {
      const id = tryObj(node);
      if (id) {
        return id;
      }
    }
  }

  return "";
}

function extractAddressString(source: Record<string, unknown>): string | undefined {
  const addr = source.address;
  if (typeof addr === "string" && addr.trim()) {
    return addr.trim();
  }
  if (isRecord(addr)) {
    const nested =
      (addr.full_address as string | undefined) ??
      (addr.formatted as string | undefined) ??
      (addr.value as string | undefined) ??
      (addr.fullAddress as string | undefined);
    if (typeof nested === "string" && nested.trim()) {
      return nested.trim();
    }
  }
  const direct =
    (source.full_address as string | undefined) ??
    (source.fullAddress as string | undefined) ??
    (source.address_line as string | undefined) ??
    (source.formatted_address as string | undefined);
  if (typeof direct === "string" && direct.trim()) {
    return direct.trim();
  }
  return undefined;
}

/** Преобразует detail события в единый объект для формы и заказа. */
export function mapWidgetDetailToSelectedPickup(
  detail: YaNddWidgetPointSelectedDetail
): SelectedPickup {
  const root = detail as unknown as Record<string, unknown>;
  const source =
    (isRecord(detail.point) ? detail.point : null) ??
    (isRecord(detail.payload) ? detail.payload : null) ??
    (isRecord(detail.data?.point) ? detail.data.point : null) ??
    root;

  const pickup_id = extractPickupId(detail);

  const fromSource = extractAddressString(source as Record<string, unknown>);
  const fromRoot = extractAddressString(root);
  const fallbackAddress = [
    source.locality,
    source.street,
    source.house,
    source.comment,
  ]
    .filter((part) => Boolean(part && String(part).trim()))
    .join(", ");

  const rawAddress =
    fromSource ?? fromRoot ?? source.full_address ?? root.full_address ?? fallbackAddress;
  const pickup_address = typeof rawAddress === "string" ? rawAddress.trim() : "";

  const typeRaw = source.type ?? root.type;
  const pickup_type: PickupType = typeRaw === "terminal" ? "terminal" : "pickup_point";

  return {
    pickup_id,
    pickup_address,
    pickup_type,
  };
}

interface DeliveryWidgetProps {
  /** Вызывается при каждом выборе точки; ref внутри гарантирует актуальный колбэк без перевешивания слушателя. */
  onPickupChange?: (pickup: SelectedPickup) => void;
}

export default function DeliveryWidget({ onPickupChange }: DeliveryWidgetProps) {
  const [selectedPickup, setSelectedPickup] = useState<SelectedPickup | null>(null);
  const isWidgetInitializedRef = useRef(false);
  const onPickupChangeRef = useRef(onPickupChange);
  onPickupChangeRef.current = onPickupChange;

  useEffect(() => {
    const initializeWidget = () => {
      const api = window.YaDelivery;
      const container = document.getElementById(CONTAINER_ID);

      if (!api || !container) {
        return;
      }

      if (isWidgetInitializedRef.current) {
        return;
      }

      isWidgetInitializedRef.current = true;
      api.createWidget({
        containerId: CONTAINER_ID,
        params: {
          ...WIDGET_PARAMS_BASE,
          size: widgetSizeForViewport(),
        },
      });
    };

    const handleYaNddWidgetPointSelected = (event: Event) => {
      const customEvent = event as CustomEvent<YaNddWidgetPointSelectedDetail>;
      if (!customEvent.detail) {
        return;
      }
      console.log("YaNddWidgetPointSelected detail:", customEvent.detail);

      const pickup = mapWidgetDetailToSelectedPickup(customEvent.detail);
      setSelectedPickup(pickup);
      onPickupChangeRef.current?.(pickup);
    };

    if (window.YaDelivery) {
      initializeWidget();
    } else {
      document.addEventListener("YaNddWidgetLoad", initializeWidget);
    }

    document.addEventListener("YaNddWidgetPointSelected", handleYaNddWidgetPointSelected);

    return () => {
      document.removeEventListener("YaNddWidgetLoad", initializeWidget);
      document.removeEventListener("YaNddWidgetPointSelected", handleYaNddWidgetPointSelected);
    };
  }, []);

  return (
    <div className="w-full max-w-full mx-auto space-y-3 md:space-y-4 overflow-x-hidden">
      <h3 className="font-serif text-lg md:text-xl lg:text-2xl">Выберите пункт выдачи</h3>

      <div className="w-full max-w-full overflow-hidden rounded-xl md:rounded-2xl border border-ink/15 bg-white/40">
        <div
          id={CONTAINER_ID}
          className="delivery-widget-host w-full h-[300px] min-h-[280px] max-h-[300px] md:h-[540px] md:min-h-[520px] md:max-h-none box-border"
        />
      </div>

      {selectedPickup && (
        <div className="mt-4 rounded-lg border border-ink/20 bg-sand/35 p-4 text-sm text-ink/90">
          <p className="mb-2 font-medium">Выбран пункт выдачи:</p>
          <p>
            Тип: {selectedPickup.pickup_type === "terminal" ? "постамат" : "ПВЗ"}
          </p>
          <p>Полный адрес: {selectedPickup.pickup_address || "Адрес не указан"}</p>
          <p>ID: {selectedPickup.pickup_id || "—"}</p>
        </div>
      )}
    </div>
  );
}
