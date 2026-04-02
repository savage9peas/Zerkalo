import { motion } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const carouselImages = [
  "/product-carousel/Untitled_nxnK7bXM.png",
  "/product-carousel/Untitled_A_modern_orange_phone_case_with_a_decorative_BvfKJy7r.png",
  "/product-carousel/Untitled_zmrGg06I.png",
  "/product-carousel/Untitled_slNblySb.png"
];

export default function Product() {
  return (
    <section className="py-24 md:py-40 bg-marble text-ink px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-16 md:mb-24"
        >
          <h2 className="font-serif text-4xl md:text-6xl leading-[1.1] mb-6">
            Идеальный <span className="italic font-light text-gold">подарок</span>
          </h2>
          <p className="font-sans text-sm md:text-base font-light leading-relaxed text-ink-light">
            Каждая линия продумана до мелочей. Он останется с ней дольше любого букета и говорит больше любых слов.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl relative"
        >
          <Carousel className="w-full">
            <CarouselContent>
              {carouselImages.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="w-full aspect-[4/5] md:aspect-[21/9] relative overflow-hidden bg-sand">
                    <img 
                      src={src} 
                      alt={`Детали продукта ${index + 1}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-ivory/80 hover:bg-ivory border-none text-ink" />
            <CarouselNext className="right-4 bg-ivory/80 hover:bg-ivory border-none text-ink" />
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}
