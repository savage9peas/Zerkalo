import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Подойдет ли зеркало к моему смартфону?",
    answer: "Да, зеркало крепится с помощью технологии MagSafe, которая встроена в iPhone 12 и новее. Для более старых моделей и для Iphone 16e потребуется специальный чехол или магнитное кольцо.",
  },
  {
    question: "Можно ли использовать зеркало отдельно от телефона?",
    answer: "Конечно. Зеркало легко снимается и может использоваться как самостоятельный аксессуар в вашей сумочке или косметичке.",
  },
  {
    question: "Какие сроки доставки?",
    answer: "Доставка включена в стоимость! Изготовление и отправка зеркала, как правило, занимает от 2 до 8 дней. Доставка по России осуществляется в среднем в течении 2-7 рабочих дней, зависит от агрегатора (Яндекс доставка).",
  },
  {
    question: "Остались вопросы?",
    answer: "Напишите нам в директ или на почту ishinemag@outlook.com",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-40 bg-marble text-ink px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24 text-center"
        >
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.1]">
            Частые <span className="italic font-light text-gold">вопросы</span>
          </h2>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-ink/10"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-8 flex items-center justify-between text-left focus:outline-none group"
              >
                <span className="font-serif text-xl md:text-2xl group-hover:text-gold transition-colors duration-300 pr-8">
                  {faq.question}
                </span>
                <span className="flex-shrink-0 text-ink/50 group-hover:text-gold transition-colors duration-300">
                  {openIndex === index ? <Minus size={24} strokeWidth={1} /> : <Plus size={24} strokeWidth={1} />}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-8 font-sans text-sm font-light text-ink-light leading-relaxed max-w-2xl">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
