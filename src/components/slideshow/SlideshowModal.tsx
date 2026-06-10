"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Slide01_Scale } from "./slides/Slide01_Scale";
import { Slide02_CapitalMap } from "./slides/Slide02_CapitalMap";
import { Slide03_CapexArmsRace } from "./slides/Slide03_CapexArmsRace";
import { Slide04_OpenAI } from "./slides/Slide04_OpenAI";
import { Slide05_ShockFacts } from "./slides/Slide05_ShockFacts";
import { Slide06_DotComMirror } from "./slides/Slide06_DotComMirror";
import { Slide07_EnergyParadox } from "./slides/Slide07_EnergyParadox";
import { Slide08_SovereignAI } from "./slides/Slide08_SovereignAI";
import { Slide09_Robotics } from "./slides/Slide09_Robotics";
import { Slide10_BubbleOrBreakthrough } from "./slides/Slide10_BubbleOrBreakthrough";
import { Slide11_WatchSignals } from "./slides/Slide11_WatchSignals";
import { SlideProgress } from "./SlideProgress";
import { getLiveSlideMetrics } from "./utils/liveSlideData";
import { SLIDE, SLIDE_TRANSITION_MS } from "./utils/slideTheme";

const TOTAL = 11;

interface SlideshowModalProps {
  onClose: () => void;
}

export function SlideshowModal({ onClose }: SlideshowModalProps) {
  const live = useMemo(() => getLiveSlideMetrics(), []);
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const touchStart = useRef<number | null>(null);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => {
        const next = Math.max(0, Math.min(TOTAL - 1, i + delta));
        if (next !== i) {
          setTransitioning(true);
          setTimeout(() => setTransitioning(false), SLIDE_TRANSITION_MS);
        }
        return next;
      });
    },
    []
  );

  const goTo = useCallback((i: number) => {
    setIndex((cur) => {
      if (cur !== i) {
        setTransitioning(true);
        setTimeout(() => setTransitioning(false), SLIDE_TRANSITION_MS);
      }
      return i;
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, onClose]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
    touchStart.current = null;
  };

  const slides = useMemo(
    () => [
      (active: boolean) => <Slide01_Scale isActive={active} live={live} />,
      (active: boolean) => <Slide02_CapitalMap isActive={active} live={live} />,
      (active: boolean) => <Slide03_CapexArmsRace isActive={active} />,
      (active: boolean) => <Slide04_OpenAI isActive={active} />,
      (active: boolean) => <Slide05_ShockFacts isActive={active} />,
      (active: boolean) => <Slide06_DotComMirror isActive={active} />,
      (active: boolean) => <Slide07_EnergyParadox isActive={active} />,
      (active: boolean) => <Slide08_SovereignAI isActive={active} />,
      (active: boolean) => <Slide09_Robotics isActive={active} />,
      (active: boolean) => <Slide10_BubbleOrBreakthrough isActive={active} />,
      (active: boolean) => <Slide11_WatchSignals isActive={active} />,
    ],
    [live]
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col overflow-hidden"
      style={{ background: SLIDE.bg, color: "#fff" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: SLIDE.bgGlow }}
      />

      {/* Header */}
      <header className="relative z-10 flex shrink-0 items-center justify-between border-b px-5 py-3" style={{ borderColor: SLIDE.border }}>
        <span className="text-sm font-medium text-white/50">AI Capital Flow Observatory</span>
        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-sm tabular text-white/40 sm:inline">
            {String(index + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border text-lg text-white/70 hover:bg-white/[0.06]"
            style={{ borderColor: SLIDE.border }}
            aria-label="Close slideshow"
          >
            ×
          </button>
        </div>
      </header>

      {/* Slide viewport */}
      <main className="relative z-10 min-h-0 flex-1 overflow-hidden">
        <div
          className="h-full w-full transition-all ease-out"
          style={{
            willChange: "transform, opacity",
            opacity: transitioning ? 0.92 : 1,
            transform: transitioning ? "translateY(6px)" : "translateY(0)",
            transitionDuration: `${SLIDE_TRANSITION_MS}ms`,
          }}
        >
          {slides.map((render, i) => {
            const isNeighbor = Math.abs(i - index) <= 1;
            if (!isNeighbor) return null;
            return (
              <div
                key={i}
                className="absolute inset-0 overflow-hidden"
                style={{
                  visibility: i === index ? "visible" : "hidden",
                  pointerEvents: i === index ? "auto" : "none",
                }}
              >
                {render(i === index)}
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer nav */}
      <footer
        className="relative z-10 flex shrink-0 items-center justify-between border-t px-5 py-3"
        style={{ borderColor: SLIDE.border }}
      >
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          className="rounded-md px-3 py-1.5 text-sm text-white/80 hover:bg-white/[0.06] disabled:opacity-30"
        >
          ← Prev
        </button>

        <SlideProgress current={index} total={TOTAL} onGoTo={goTo} />

        <button
          type="button"
          onClick={() => go(1)}
          disabled={index === TOTAL - 1}
          className="rounded-md px-3 py-1.5 text-sm text-white/80 hover:bg-white/[0.06] disabled:opacity-30"
        >
          Next →
        </button>
      </footer>
    </div>
  );
}

/** @deprecated Use SlideshowModal */
export { SlideshowModal as InsightsSlideshow };
