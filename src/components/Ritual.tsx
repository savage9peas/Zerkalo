import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    title: "Прикоснитесь",
    description: "Легким движением закрепите зеркало на вашем устройстве. Надежно и элегантно.",
  },
  {
    number: "02",
    title: "Раскройте",
    description: "Плавный механизм открывает доступ к вашему отражению, словно драгоценную шкатулку.",
  },
  {
    number: "03",
    title: "Восхититесь",
    description: "Оцените свой образ. Вы прекрасны в любой момент, где бы вы ни находились.",
  },
];

export default function Ritual() {
  return (
    <section className="py-24 md:py-40 bg-ivory text-ink px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 md:mb-32"
        >
          <h2 className="font-serif text-4xl md:text-6xl leading-[1.1] mb-6">
            Ваш <span className="italic font-light text-gold">ритуал</span>
          </h2>
          <p className="font-sans text-sm md:text-base font-light text-ink-light max-w-md mx-auto">
            Три простых шага к безупречности.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center group"
            >
              <span className="font-serif text-6xl md:text-8xl text-sand mb-8 transition-colors duration-500 group-hover:text-gold">
                {step.number}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl mb-4">{step.title}</h3>
              <p className="font-sans text-sm font-light text-ink-light leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
