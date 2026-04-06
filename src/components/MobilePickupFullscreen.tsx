import { ArrowLeft } from "lucide-react";
import DeliveryWidget from "./DeliveryWidget";
import type { SelectedPickup } from "../types/selectedPickup";

interface MobilePickupFullscreenProps {
  isOpen: boolean;
  onClose: () => void;
  onPickupSelected: (pickup: SelectedPickup) => void;
}

export default function MobilePickupFullscreen({
  isOpen,
  onClose,
  onPickupSelected,
}: MobilePickupFullscreenProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex min-h-[100dvh] flex-col bg-ivory text-ink"
      role="dialog"
      aria-modal="true"
      aria-label="Выбор пункта выдачи"
    >
      <header className="flex shrink-0 items-center gap-3 border-b border-ink/10 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand text-ink/70 transition-colors hover:text-ink"
          aria-label="Назад к оформлению"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <h2 className="flex-1 text-center font-serif text-[20px] font-normal leading-none">
          Пункт выдачи
        </h2>

        <span className="w-10 shrink-0" aria-hidden />
      </header>

      <div className="flex min-h-0 flex-1 flex-col px-4 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <DeliveryWidget
          variant="fullscreen"
          showHeading={false}
          showLocalSummary={false}
          onPickupChange={onPickupSelected}
        />
      </div>
    </div>
  );
}