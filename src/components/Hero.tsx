import { motion } from "motion/react";
import { LiquidButton } from "./ui/liquid-glass-button";

interface HeroProps {
  onOpenCheckout: () => void;
}

export default function Hero({ onOpenCheckout }: HeroProps) {
  return (
    <section className="relative w-full h-[100svh] overflow-hidden bg-marble">
      <div className="absolute inset-0 h-full w-full">
        <picture>
          <source
            media="(min-width: 768px)"
            srcSet="/hero/desktop/Untitled_T23xfC2p.png"
          />
          <img
            src="/hero/mobile/IMG_1353 2.jpg"
            alt="Зеркало Венеры"
            className="h-full w-full object-cover object-[center_20%] md:object-center"
          />
        </picture>

        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent md:bg-gradient-to-r md:from-ink/55 md:via-ink/10 md:to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-end px-8 pb-20 md:justify-center md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-[78%] text-ivory md:max-w-[50%]"
        >
          <h1 className="font-serif text-[52px] leading-[0.95] tracking-tight md:text-[84px] lg:text-[96px]">
            Зеркало <br />
            <span className="italic font-light">Венеры</span>
          </h1>

          <p className="mt-5 max-w-[260px] font-sans text-[20px] leading-[1.35] font-normal opacity-95 md:mt-6 md:max-w-md md:text-[24px]">
            Твоё истинное отражение.
          </p>

          <div className="mt-8 md:mt-10">
            <LiquidButton
              onClick={onOpenCheckout}
              className="px-7 py-3.5 font-serif text-[18px] font-medium tracking-[0.05em] text-ivory uppercase md:px-8 md:py-4 md:text-[20px]"
            >
              Заказать
            </LiquidButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}