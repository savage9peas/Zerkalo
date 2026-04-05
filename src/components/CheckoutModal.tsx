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
  /** Единственный источник истины для ПВЗ после YaNddWidgetPointSelected */
  const [selectedPickup, setSelectedPickup] = useState<SelectedPickup | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const handlePickupChange = useCallback((pickup: SelectedPickup) => {
    setSelectedPickup(pickup);
    setOrderError(null);
    setOrderSuccess(null);
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
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

    console.log("[order submit] selectedPickup state:", selectedPickup);
    console.log(payload);

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
      console.log("order response", orderData);

      console.log("🔥 ORDER ID FOR PAYMENT:", orderData?.id);

const paymentPayload = {
  orderId: String(orderData?.id ?? ""),
};

console.log("🔥 PAYMENT PAYLOAD:", paymentPayload);
      if (orderRes.status === 400) {
        setOrderError(
          String(orderData.error ?? "Проверьте данные заказа.")
        );
        setOrderSuccess(null);
        return;
      }

      if (!orderRes.ok) {
        throw new Error("Failed to create order");
      }

      const order = orderData as { id: string };

      try {
        const paymentRes = await fetch("http://localhost:4000/api/payment/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentPayload),
        });
        const payment = (await paymentRes.json().catch(() => ({}))) as Record<
          string,
          unknown
        >;
        console.log("payment response", payment);

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
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 md:px-0 pt-16 pb-4 sm:pt-24 sm:pb-6 bg-ink/80 backdrop-blur-sm overflow-y-auto overflow-x-hidden">
      <div className="bg-ivory w-full max-w-full sm:max-w-[min(100%,50rem)] mx-auto flex flex-col rounded-xl shadow-2xl relative text-ink mb-16">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-ink/50 hover:text-ink transition-colors bg-sand rounded-full z-10"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="px-4 py-8 md:px-10 md:py-10">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl mb-3">Оформление заказа</h2>
            <p className="font-sans text-sm tracking-widest uppercase text-gold">Зеркало Венеры &bull; 1990 ₽</p>
          </div>

          <form
            id="checkout-order-form"
            className="space-y-6 font-sans"
            onSubmit={(e) => {
              e.preventDefault();
              void handleCreateOrder();
            }}
          >
            <div>
              <label className="block text-xs uppercase tracking-widest text-ink/60 mb-2">ФИО *</label>
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
                className="w-full bg-transparent border-b border-ink/20 py-3 text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-ink/60 mb-2">Телефон *</label>
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
                className="w-full bg-transparent border-b border-ink/20 py-3 text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-ink/60 mb-2">Email *</label>
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
                className="w-full bg-transparent border-b border-ink/20 py-3 text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div className="mt-10 w-full max-w-full mx-auto overflow-hidden">
              <DeliveryWidget onPickupChange={handlePickupChange} />
            </div>

            <div className="pt-8">
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
                className="w-full py-5 font-serif font-light text-base md:text-lg uppercase tracking-[0.1em] text-ink"
              >
                Оформить заказ
              </LiquidButton>
              <p className="text-[10px] text-ink/40 text-center mt-6 uppercase tracking-wider leading-relaxed">
                Нажимая "Оплатить", вы соглашаетесь с условиями оферты и политикой обработки данных.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
