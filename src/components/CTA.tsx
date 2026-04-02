import { HeroSection } from "./ui/hero-section-with-smooth-bg-shader";

interface CTAProps {
  onOpenCheckout: () => void;
}

export default function CTA({ onOpenCheckout }: CTAProps) {
  return (
    <HeroSection
      title={<>Прикоснитесь к <br /></>}
      highlightText="прекрасному"
      description={<>Форма, к которой хочется прикоснуться.<br />Отражение, которому можно доверять.</>}
      buttonText="ПОЛУЧИТЬ ПЕРВЫМИ"
      onButtonClick={onOpenCheckout}
      colors={["#1A1A18", "#2A2A28", "#C5A880", "#1A1A18", "#4A4A48", "#C5A880"]}
      distortion={0.5}
      speed={0.2}
      className="bg-ink py-24 md:py-40"
      titleClassName="font-serif text-4xl md:text-6xl xl:text-6xl leading-[1.1] mb-8 text-ivory !font-normal"
      highlightClassName="italic font-light text-gold"
      descriptionClassName="font-sans text-sm sm:text-sm md:text-base font-light text-ivory/70 mb-12 max-w-md mx-auto leading-relaxed"
      buttonClassName="px-12 py-5 font-serif font-light text-base md:text-lg uppercase tracking-[0.1em] text-ivory/90"
      fontFamily="var(--font-serif)"
      fontWeight={400}
      veilOpacity="bg-ink/40"
    />
  );
}
