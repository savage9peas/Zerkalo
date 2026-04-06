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

function isMobileViewport(): boolean {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

function fullscreenWidgetHeightPx(): number {
  if (typeof window === "undefined") {
    return 560;
  }

  const safeTop = 16;
  const headerHeight = 76;
  const verticalPadding = 24;

  return Math.max(
    420,
    window.innerHeight - safeTop - headerHeight - verticalPadding
  );
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

  if (!isRecord(detail)) return "";

  const direct = tryObj(detail);
  if (direct) return direct;

  const dataNode = isRecord(detail.data) ? detail.data : undefined;
  const nested = [detail.point, detail.payload, dataNode?.point];

  for (const node of nested) {
    if (isRecord(node)) {
      const id = tryObj(node);
      if (id) return id;
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

  const fallbackAddress = [source.locality, source.street, source.house, source.comment]
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

export type DeliveryWidgetVariant = "default" | "fullscreen";

export interface DeliveryWidgetProps {
  onPickupChange?: (pickup: SelectedPickup) => void;
  variant?: DeliveryWidgetVariant;
  showHeading?: boolean;
  showLocalSummary?: boolean;
}

export default function DeliveryWidget({
  onPickupChange,
  variant = "default",
  showHeading = true,
  showLocalSummary = true,
}: DeliveryWidgetProps) {
  const [selectedPickup, setSelectedPickup] = useState<SelectedPickup | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(isMobileViewport());
  const [fullscreenH, setFullscreenH] = useState<number>(() =>
    typeof window !== "undefined" ? fullscreenWidgetHeightPx() : 560
  );
  const lastConfigSigRef = useRef<string | null>(null);
  const onPickupChangeRef = useRef(onPickupChange);
  const variantRef = useRef(variant);

  onPickupChangeRef.current = onPickupChange;
  variantRef.current = variant;

  useEffect(() => {
    if (variant !== "fullscreen") return;

    const updateHeight = () => {
      setFullscreenH(fullscreenWidgetHeightPx());
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [variant]);

  useEffect(() => {
    const DEBOUNCE_MS = 200;
    let debounceId: ReturnType<typeof setTimeout> | null = null;

    const configSignature = (): string => {
      const v = variantRef.current;
      if (v === "fullscreen") {
        return `fs-${fullscreenH}`;
      }
      return isMobileViewport() ? "def-m" : "def-d";
    };

    const buildParams = (): YaDeliveryCreateWidgetConfig["params"] => {
      const v = variantRef.current;

      if (v === "fullscreen") {
        return {
          city: "Москва",
          delivery_price: " ",
          delivery_term: "от 1 дня",
          show_select_button: false,
          filter: {
            type: ["pickup_point", "terminal"],
          },
          size: {
            width: "100%",
            height: `${fullscreenH}px`,
          },
        };
      }

      const mobile = isMobileViewport();

      return {
        city: "Москва",
        delivery_price: " ",
        delivery_term: "от 1 дня",
        show_select_button: !mobile,
        filter: {
          type: ["pickup_point", "terminal"],
        },
        size: mobile
          ? { width: "100%", height: "430px" }
          : { width: "100%", height: "660px" },
      };
    };

    const createOrRestartWidget = () => {
      const api = window.YaDelivery;
      const container = document.getElementById(CONTAINER_ID);
      if (!api || !container) return;

      const sig = configSignature();
      if (lastConfigSigRef.current === sig) return;

      container.innerHTML = "";
      lastConfigSigRef.current = sig;

      api.createWidget({
        containerId: CONTAINER_ID,
        params: buildParams(),
      });
    };

    const scheduleResizeRestart = () => {
      if (debounceId !== null) clearTimeout(debounceId);

      debounceId = setTimeout(() => {
        debounceId = null;
        setIsMobile(isMobileViewport());
        lastConfigSigRef.current = null;
        createOrRestartWidget();
      }, DEBOUNCE_MS);
    };

    const handleYaNddWidgetLoad = () => {
      lastConfigSigRef.current = null;
      setIsMobile(isMobileViewport());
      createOrRestartWidget();
    };

    const handleYaNddWidgetPointSelected = (event: Event) => {
      const customEvent = event as CustomEvent<YaNddWidgetPointSelectedDetail>;
      if (!customEvent.detail) return;

      const pickup = mapWidgetDetailToSelectedPickup(customEvent.detail);
      setSelectedPickup(pickup);
      onPickupChangeRef.current?.(pickup);
    };

    if (window.YaDelivery) {
      lastConfigSigRef.current = null;
      setIsMobile(isMobileViewport());
      createOrRestartWidget();
    } else {
      document.addEventListener("YaNddWidgetLoad", handleYaNddWidgetLoad);
    }

    window.addEventListener("resize", scheduleResizeRestart);
    document.addEventListener("YaNddWidgetPointSelected", handleYaNddWidgetPointSelected);

    return () => {
      if (debounceId !== null) clearTimeout(debounceId);
      document.removeEventListener("YaNddWidgetLoad", handleYaNddWidgetLoad);
      window.removeEventListener("resize", scheduleResizeRestart);
      document.removeEventListener("YaNddWidgetPointSelected", handleYaNddWidgetPointSelected);
      lastConfigSigRef.current = null;
    };
  }, [variant, fullscreenH]);

  const containerClass =
  variant === "fullscreen"
    ? "box-border h-full w-full overflow-hidden"
    : isMobile
      ? "box-border h-[430px] w-full overflow-hidden"
      : "box-border h-[660px] w-full overflow-hidden";

const containerStyle =
  variant === "fullscreen"
    ? {
        height: `${fullscreenH + 92}px`,
        transform: "translateY(-92px)",
      }
    : undefined;

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-full flex-1 flex-col overflow-x-hidden">
      {showHeading ? (
        <h3 className="mb-4 font-serif text-[22px] leading-[1.1] text-ink md:mb-3 md:text-xl lg:text-2xl">
          Выберите пункт выдачи
        </h3>
      ) : null}

      <div className="w-full max-w-full min-h-0 flex-1 overflow-hidden rounded-[28px] border border-ink/10 bg-white/50">
        <div id={CONTAINER_ID} className={containerClass} style={containerStyle} />
      </div>

      {showLocalSummary && selectedPickup ? (
        <div className="mt-4 rounded-2xl border border-ink/10 bg-sand/35 p-4 text-sm text-ink/90">
          <p className="mb-2 font-medium">Выбран пункт выдачи:</p>
          <p>Тип: {selectedPickup.pickup_type === "terminal" ? "постамат" : "ПВЗ"}</p>
          <p>Полный адрес: {selectedPickup.pickup_address || "Адрес не указан"}</p>
          <p>ID: {selectedPickup.pickup_id || "—"}</p>
        </div>
      ) : null}
    </div>
  );
}
