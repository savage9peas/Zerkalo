import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

/** Основной файл без пробелов в имени; запасной — с исходным именем (URL с %20). */
const STORY_VIDEO_SOURCES: { src: string; type: string }[] = [
  { src: "/story/story.mp4", type: "video/mp4" },
  { src: "/story/story.webm", type: "video/webm" },
  { src: encodeURI("/story/IMG_1380 3.mov"), type: "video/quicktime" },
];

export default function Story() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const tryPlay = useCallback(() => {
    const el = videoRef.current;
    if (!el || loadFailed) return;
    el.muted = true;
    const playAttempt = el.play();
    if (playAttempt !== undefined) {
      playAttempt.catch(() => setShowControls(true));
    }
  }, [loadFailed]);

  useEffect(() => {
    tryPlay();
  }, [tryPlay]);

  return (
    <section className="py-24 md:py-40 bg-ivory text-ink px-6 md:px-16 lg:px-24 overflow-x-hidden">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-16 md:flex-row md:gap-24">
        {/* Text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 max-w-xl w-full"
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
        
        {/* Video */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full max-w-full aspect-[3/4] md:aspect-square relative overflow-hidden bg-sand rounded-2xl isolate"
        >
          {!loadFailed ? (
            <video
              ref={videoRef}
              className="absolute inset-0 z-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls={showControls}
              preload="auto"
              onLoadedData={tryPlay}
              onCanPlay={tryPlay}
              onError={() => {
                setLoadFailed(true);
                setShowControls(false);
              }}
            >
              {STORY_VIDEO_SOURCES.map(({ src, type }) => (
                <source key={src} src={src} type={type} />
              ))}
            </video>
          ) : null}

          {loadFailed ? (
            <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-3 bg-sand px-6 text-center">
              <p className="font-sans text-sm text-ink/70 leading-relaxed">
                Видео не найдено. Положите файл в папку{" "}
                <code className="rounded bg-ink/5 px-1.5 py-0.5 text-xs text-ink">public/story/story.mp4</code>
                {" "}(или укажите другие источники в компоненте Story).
              </p>
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
