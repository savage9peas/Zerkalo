import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function Story() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.muted = true;

    const playAttempt = el.play();
    if (playAttempt !== undefined) {
      playAttempt.catch(() => {
        setShowControls(true);
      });
    }
  }, []);

  return (
    <section className="overflow-x-hidden bg-ivory px-6 py-24 text-ink md:px-16 md:py-40 lg:px-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-16 md:flex-row md:gap-24">
        
        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl flex-1"
        >
          <h2 className="mb-8 font-serif text-4xl leading-[1.1] md:text-6xl">
            Новая <span className="italic font-light text-gold">Венера</span>
          </h2>

          <div className="space-y-6 font-sans text-sm font-light leading-relaxed text-ink-light md:text-base">
            <p>
              Мы переосмыслили классический ритуал красоты, чтобы создать не
              просто аксессуар, а объект желания. Вдохновленные эстетикой
              Ренессанса и современным ритмом жизни, мы создали форму, которая
              подчеркивает вашу индивидуальность.
            </p>

            <p>
              Это не просто зеркало.
              <br />
              Это момент, когда вы видите себя настоящую. Время, когда вы
              замираете, чтобы увидеть свою истинную красоту, не скрытую
              фильтрами.
            </p>
          </div>
        </motion.div>

        {/* VIDEO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex-1 max-w-full overflow-hidden rounded-2xl bg-sand aspect-[9/16]"
        >
          {!loadFailed ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src="/story/story.mp4"
              autoPlay
              muted
              loop
              playsInline
              controls={showControls}
              preload="auto"
              onError={() => {
                setLoadFailed(true);
                setShowControls(false);
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-sand px-6 text-center">
              <p className="font-sans text-sm leading-relaxed text-ink/70">
                Видео не найдено. Проверь файл{" "}
                <code className="rounded bg-ink/5 px-1.5 py-0.5 text-xs text-ink">
                  public/story/story.mp4
                </code>
              </p>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}