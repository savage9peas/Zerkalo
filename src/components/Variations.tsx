import { motion } from "motion/react";
import { useState } from "react";

const colors = [
  {
    id: "ivory",
    name: "Warm Ivory",
    hex: "#FDFBF7",
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "sand",
    name: "Soft Sand",
    hex: "#E8E2D5",
    image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "gold",
    name: "Muted Gold",
    hex: "#C5A880",
    image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?q=80&w=1000&auto=format&fit=crop",
  }
];

export default function Variations() {
  const [activeColor, setActiveColor] = useState(colors[0]);

  return (
    <section className="py-24 md:py-40 bg-ivory text-ink px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
        
        {/* Image Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full md:w-1/2 aspect-[4/5] relative overflow-hidden bg-marble"
        >
          <motion.img 
            key={activeColor.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            src={activeColor.image} 
            alt={activeColor.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Color Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full md:w-1/2 flex flex-col"
        >
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] mb-12">
            Выберите свой <br />
            <span className="italic font-light text-gold">оттенок</span>
          </h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setActiveColor(color)}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 ${activeColor.id === color.id ? 'scale-110' : 'hover:scale-105'}`}
                  aria-label={`Выбрать цвет ${color.name}`}
                >
                  <span 
                    className="absolute inset-1.5 rounded-full border border-ink/10 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  {activeColor.id === color.id && (
                    <motion.span 
                      layoutId="color-ring"
                      className="absolute inset-0 rounded-full border border-ink/30"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
            
            <div className="h-8">
              <motion.p 
                key={activeColor.name}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-sans text-sm tracking-widest uppercase text-ink-light"
              >
                {activeColor.name}
              </motion.p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
