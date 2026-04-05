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

      <div className="relative z-10 w-full h-full flex flex-col justify-end md:justify-center px-6 pb-16 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
         className="w-full md:max-w-[60%] text-ivory"
        >
          <h1 className="font-serif text-[160px] md:text-[285px] lg:text-[330px] leading-[0.9] mb-6 tracking-tight">
            Зеркало <br />
            <span className="italic font-light">Венеры</span>
          </h1>

          <p className="font-sans text-[26px] md:text-[32px] font-light tracking-wide mb-12 opacity-90 max-w-[240px] md:max-w-md leading-relaxed">
            Твоё истинное отражение.
          </p>
          
          {/* +60% */}
          <LiquidButton 
            onClick={onOpenCheckout} 
            className="px-[88px] py-[38px] font-serif font-medium text-[32px] md:text-[38px] uppercase tracking-[0.1em] text-ivory/90"
          >
            Заказать
          </LiquidButton>
        </motion.div>
      </div>
    </section>
  );
}
