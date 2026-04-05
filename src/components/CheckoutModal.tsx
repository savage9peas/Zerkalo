import { X } from "lucide-react";
import { LiquidButton } from "./ui/liquid-glass-button";
import { useCallback, useEffect, useState } from "react";
import DeliveryWidget from "./DeliveryWidget";
import { validateOrderFields } from "../lib/orderValidation";
import type { SelectedPickup } from "../types/selectedPickup";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedPickup, setSelectedPickup] = useState<SelectedPickup | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const handlePickupChange = useCallback((pickup: SelectedPickup) => {
    setSelectedPickup(pickup);
    setOrderError(null);
    setOrderSuccess(null);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCreateOrder = async () => {
    const payload = {
      name,
      phone,
      email,
      pickup_id: selectedPickup?.pickup_id ?? "",
      pickup_address: selectedPickup?.pickup_address ?? "",
      pickup_type: selectedPickup?.pickup_type ?? "",
      amount: 1,
    };

    const localCheck = validateOrderFields({
      name: payload.name,
      phone: payload.phone,
      pickup_id: payload.pickup_id,
      pickup_address: payload.pickup_address,
    });

    if (!localCheck.ok) {
      const error = localCheck as { ok: false; message: string };
      setOrderError(error.message);
      return;
    }

    setOrderError(null);
    setOrderSuccess(null);

    try {
      const orderRes = await fetch("http://localhost:4000/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const orderData = (await orderRes.json()) as Record<string, unknown>;

      if (orderRes.status === 400) {
        setOrderError(String(orderData.error ?? "Проверьте данные заказа."));
        setOrderSuccess(null);
        return;
      }

      if (!orderRes.ok) {
        throw new Error("Failed to create order");
      }

      const paymentPayload = {
        orderId: String(orderData?.id ?? ""),
      };

      try {
        const paymentRes = await fetch("http://localhost:4000/api/payment/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentPayload),
        });

        const payment = (await paymentRes.json().catch(() => ({}))) as Record<string, unknown>;
        const paymentStatus = typeof payment.status === "string" ? payment.status : "";

        if (paymentRes.ok && paymentStatus === "pending_payment") {
          setOrderSuccess("Заказ создан, оплата подготовлена");
          alert("Заказ создан, оплата подготовлена");
        } else {
          setOrderSuccess("Заказ создан, но оплата пока не подготовлена");
          alert("Заказ создан, но оплата пока не подготовлена");
        }
      } catch (e) {
        console.error("payment error", e);
        setOrderSuccess("Заказ создан, но оплата пока не подготовлена");
        alert("Заказ создан, но оплата пока не подготовлена");
      }

      setOrderError(null);
    } catch (e) {
      console.error(e);
      alert("Ошибка создания заказа");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 bg-ink/80 backdrop-blur-sm" aria-hidden />
      <div className="relative z-[1] flex min-h-full items-start justify-center px-4 pb-6 pt-16 md:px-0 md:pb-8 sm:pt-24">
        <div className="relative mx-auto mb-16 flex w-full max-w-full flex-col rounded-xl bg-ivory text-ink shadow-2xl sm:max-w-[min(100%,50rem)]">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-sand p-2 text-ink/50 transition-colors hover:text-ink md:right-6 md:top-6"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="box-border w-full max-w-full overflow-x-hidden px-4 py-8 md:px-10 md:py-10">
            <div className="mb-10 text-center">
              <h2 className="mb-3 font-serif text-3xl md:text-4xl">Оформление заказа</h2>
              <p className="font-sans text-sm uppercase tracking-widest text-gold">
                Зеркало Венеры • 1990 ₽
              </p>
            </div>

            <form
              id="checkout-order-form"
              className="w-full max-w-full space-y-6 overflow-x-hidden font-sans md:space-y-7"
              onSubmit={(e) => {
                e.preventDefault();
                void handleCreateOrder();
              }}
            >
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-ink/60">
                  ФИО *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ваше ФИО"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setOrderError(null);
                    setOrderSuccess(null);
                  }}
                  className="w-full border-b border-ink/20 bg-transparent py-3 text-ink placeholder:text-ink/30 transition-colors focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-ink/60">
                  Телефон *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+7 (999) 000-00-00"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setOrderError(null);
                    setOrderSuccess(null);
                  }}
                  className="w-full border-b border-ink/20 bg-transparent py-3 text-ink placeholder:text-ink/30 transition-colors focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-ink/60">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setOrderError(null);
                    setOrderSuccess(null);
                  }}
                  className="w-full border-b border-ink/20 bg-transparent py-3 text-ink placeholder:text-ink/30 transition-colors focus:border-gold focus:outline-none"
                />
              </div>

              <div className="mt-10 w-full max-w-full overflow-x-hidden border-t border-ink/10 pt-8">
                <DeliveryWidget onPickupChange={handlePickupChange} />
              </div>

              <div className="mt-6 w-full max-w-full pt-6 md:mt-8 md:pt-8">
                {orderSuccess && (
                  <div
                    role="status"
                    className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
                  >
                    {orderSuccess}
                  </div>
                )}

                {orderError && (
                  <div
                    role="alert"
                    className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
                  >
                    {orderError}
                  </div>
                )}

                <LiquidButton
                  type="submit"
                  className="w-full py-5 font-serif text-base font-light uppercase tracking-[0.1em] text-ink md:text-lg"
                >
                  Оформить заказ
                </LiquidButton>

                <p className="mt-6 text-center text-[10px] uppercase tracking-wider leading-relaxed text-ink/40">
                  Нажимая "Оплатить", вы соглашаетесь с условиями оферты и политикой обработки данных.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
