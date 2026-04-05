import { motion } from "motion/react";
import { LiquidButton } from "./ui/liquid-glass-button";

interface HeroProps {
  onOpenCheckout: () => void;
}

export default function Hero({ onOpenCheckout }: HeroProps) {
  return (
    <section className="relative w-full h-[100svh] overflow-hidden bg-marble">
      {/* Image container */}
      <div className="absolute inset-0 w-full h-full">
        {/* 
          Тег <picture> позволяет загружать разные изображения в зависимости от устройства.
          Когда вы загрузите свои фотографии (например, hero.jpg), просто поменяйте расширение .svg на .jpg ниже.
        */}
        <picture>
          {/* Десктопное изображение (показывается на экранах от 768px) */}
          <source media="(min-width: 768px)" srcSet="/hero/desktop/Untitled_T23xfC2p.png" />
          {/* Мобильное изображение (показывается по умолчанию на маленьких экранах) */}
          <img 
            src="/hero/mobile/IMG_1353 2.jpg" 
            alt="Зеркало Венеры" 
            className="w-full h-full object-cover object-[center_20%] md:object-center"
          />
        </picture>
        {/* 
          Gradient overlay for text readability. 
          On mobile, it's at the bottom so the text doesn't cover the face/phone in the center.
          On desktop, it's on the left side.
        */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent md:bg-gradient-to-r md:from-ink/50 md:via-ink/0" />
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end md:justify-center px-6 pb-16 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[65%] md:max-w-[50%] text-ivory"
        >
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-5 tracking-tight">
            Зеркало <br />
            <span className="italic font-light">Венеры</span>
          </h1>
          <p className="font-sans text-sm md:text-base font-light tracking-wide mb-10 opacity-90 max-w-[160px] md:max-w-sm leading-relaxed">
            Твоё истинное отражение.
          </p>
          
          <LiquidButton onClick={onOpenCheckout} className="px-10 py-4 font-serif font-light text-base md:text-lg uppercase tracking-[0.1em] text-ivory/90">
            Заказать
          </LiquidButton>
        </motion.div>
      </div>
    </section>
  );
}
