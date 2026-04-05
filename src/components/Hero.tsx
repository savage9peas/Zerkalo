import { motion } from "motion/react";
import { LiquidButton } from "./ui/liquid-glass-button";

interface HeroProps {
  onOpenCheckout: () => void;
}

export default function Hero({ onOpenCheckout }: HeroProps) {
  return (
    <section className="relative w-full h-[100svh] overflow-hidden bg-marble">
      <div className="absolute inset-0 w-full h-full">
        <picture>
          <source media="(min-width: 768px)" srcSet="/hero/desktop/Untitled_T23xfC2p.png" />
          <img
            src="/hero/mobile/IMG_1353 2.jpg"
            alt="Зеркало Венеры"
            className="w-full h-full object-cover object-[center_20%] md:object-center"
          />
        </picture>

        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent md:bg-gradient-to-r md:from-ink/50 md:via-ink/0" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-end px-6 pb-16 md:justify-center md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full text-ivory md:max-w-[60%]"
        >
          <h1 className="mb-5 font-serif text-[56px] leading-[0.95] tracking-tight md:mb-6 md:text-[120px] lg:text-[160px]">
            Зеркало <br />
            <span className="italic font-light">Венеры</span>
          </h1>

          <p className="mb-8 max-w-[260px] font-sans text-[20px] leading-[1.35] font-light tracking-[0.02em] opacity-90 md:mb-12 md:max-w-md md:text-[24px]">
            Твоё истинное отражение.
          </p>

          <LiquidButton
            onClick={onOpenCheckout}
            className="px-7 py-3.5 font-serif text-[18px] font-medium tracking-[0.08em] text-ivory/90 md:px-10 md:py-4 md:text-[22px]"
          >
            Заказать
          </LiquidButton>
        </motion.div>
      </div>
    </section>
  );
}