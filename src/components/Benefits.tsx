import { motion } from "motion/react";

const benefits = [
  {
    title: "Идеальное отражение",
    description: "Оптика высочайшего класса без искажений. Вы видите себя так, как видят вас другие, в мельчайших деталях.",
  },
  {
    title: "Тактильное удовольствие",
    description: "Премиальные материалы, которые приятно держать в руках. Холодный металл и мягкая текстура создают контраст.",
  },
  {
    title: "Универсальное крепление",
    description: "Надежный магнитный механизм, совместимый с современными смартфонами и чехлами. Держится крепко, снимается легко.",
  },
  {
    title: "Компактный профиль",
    description: "Тонкий и изящный дизайн, который не утяжеляет устройство, но всегда остается под рукой в нужный момент.",
  },
];

export default function Benefits() {
  return (
    <section className="py-24 md:py-40 bg-marble text-ink px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:w-1/3"
        >
          <div className="sticky top-32">
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] mb-6">
              Детали, <br />
              <span className="italic font-light text-gold">создающие</span> <br />
              разницу
            </h2>
            <p className="font-sans text-sm font-light text-ink-light max-w-xs">
              Мы не идем на компромиссы, когда речь заходит о качестве и эстетике.
            </p>
          </div>
        </motion.div>

        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-ink/10 pt-8"
            >
              <h3 className="font-serif text-2xl mb-4">{benefit.title}</h3>
              <p className="font-sans text-sm font-light text-ink-light leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
