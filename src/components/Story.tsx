import { motion } from "motion/react";

export default function Story() {
  return (
    <section className="py-24 md:py-40 bg-ivory text-ink px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
        {/* Text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 max-w-xl"
        >
          <h2 className="font-serif text-4xl md:text-6xl leading-[1.1] mb-8">
            Новая <span className="italic font-light text-gold">Венера</span>
          </h2>
          <div className="space-y-6 font-sans text-sm md:text-base font-light leading-relaxed text-ink-light">
            <p>
              Мы переосмыслили классический ритуал красоты, чтобы создать не просто аксессуар, а объект желания. Вдохновленные эстетикой Ренессанса и современным ритмом жизни, мы создали форму, которая подчеркивает вашу индивидуальность.
            </p>
            <p>
              Это не просто зеркало.<br />
              Это момент, когда вы видите себя настоящую. Время, когда вы замираете, чтобы увидеть свою истинную красоту, не скрытую фильтрами.
            </p>
          </div>
        </motion.div>
        
        {/* Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full aspect-[3/4] md:aspect-square relative overflow-hidden bg-sand"
        >
          <video 
            src="/story/IMG_1380 3.mov" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
