import { MeshGradient } from "@paper-design/shaders-react"
import { useEffect, useState, ReactNode, useRef } from "react"
import { LiquidButton } from "./liquid-glass-button"
import { motion } from "motion/react"
import { cn } from "../../lib/utils"

interface HeroSectionProps {
  title?: ReactNode
  highlightText?: ReactNode
  description?: ReactNode
  buttonText?: string
  onButtonClick?: () => void
  colors?: string[]
  distortion?: number
  swirl?: number
  speed?: number
  offsetX?: number
  className?: string
  titleClassName?: string
  highlightClassName?: string
  descriptionClassName?: string
  buttonClassName?: string
  maxWidth?: string
  veilOpacity?: string
  fontFamily?: string
  fontWeight?: number
}

export function HeroSection({
  title = "Intelligent AI Agents for",
  highlightText = "Smart Brands",
  description = "Transform your brand and evolve it through AI-driven brand guidelines and always up-to-date core components.",
  buttonText = "Join Waitlist",
  onButtonClick,
  colors = ["#72b9bb", "#b5d9d9", "#ffd1bd", "#ffebe0", "#8cc5b8", "#dbf4a4"],
  distortion = 0.8,
  swirl = 0.6,
  speed = 0.42,
  offsetX = 0.08,
  className = "",
  titleClassName = "",
  highlightClassName = "text-primary",
  descriptionClassName = "",
  buttonClassName = "",
  maxWidth = "max-w-6xl",
  veilOpacity = "bg-white/20 dark:bg-black/25",
  fontFamily = "Satoshi, sans-serif",
  fontWeight = 500,
}: HeroSectionProps) {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })
  const [mounted, setMounted] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)
    
    if (!sectionRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const target = entry.target as HTMLElement;
        setDimensions({
          width: target.offsetWidth,
          height: target.offsetHeight,
        })
      }
    })
    
    observer.observe(sectionRef.current)
    
    return () => {
      observer.disconnect()
    }
  }, [])

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick()
    }
  }

  return (
    <section ref={sectionRef} className={cn("relative w-full overflow-hidden bg-background flex items-center justify-center", className)}>
      <div className="absolute inset-0 w-full h-full">
        {mounted && dimensions.width > 0 && dimensions.height > 0 && (
          <>
            <MeshGradient
              width={dimensions.width}
              height={dimensions.height}
              colors={colors}
              distortion={distortion}
              swirl={swirl}
              grainMixer={0}
              grainOverlay={0}
              speed={speed}
              offsetX={offsetX}
            />
            <div className={cn("absolute inset-0 pointer-events-none", veilOpacity)} />
          </>
        )}
      </div>
      
      <div className={cn("relative z-10 mx-auto px-6 w-full", maxWidth)}>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className={cn("font-bold text-foreground text-balance text-4xl sm:text-5xl md:text-6xl xl:text-[80px] leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-[1.1] mb-6 lg:text-7xl", titleClassName)}
            style={{ fontFamily, fontWeight }}
          >
            {title} <span className={highlightClassName}>{highlightText}</span>
          </h2>
          <p className={cn("text-lg sm:text-xl text-white text-pretty max-w-2xl mx-auto leading-relaxed mb-10 px-4", descriptionClassName)}>
            {description}
          </p>
          <LiquidButton
            onClick={handleButtonClick}
            className={cn("px-6 py-4 sm:px-8 sm:py-6 text-sm sm:text-base text-white transition-colors", buttonClassName)}
          >
            {buttonText}
          </LiquidButton>
        </motion.div>
      </div>
    </section>
  )
}
