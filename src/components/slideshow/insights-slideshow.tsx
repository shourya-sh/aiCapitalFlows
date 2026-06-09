"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { buildSlideshowSlides, type SlideContent } from "@/lib/metrics/slideshow";

interface InsightsSlideshowProps {
  onClose: () => void;
}

export function InsightsSlideshow({ onClose }: InsightsSlideshowProps) {
  const slides = buildSlideshowSlides();
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => Math.max(0, Math.min(slides.length - 1, i + delta)));
    },
    [slides.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const slide = slides[index];

  return (
    <div className="slide-deck fixed inset-0 z-[60] flex flex-col bg-[#ececec] text-[#1a1a1a]">
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#ccc] bg-white px-5 py-2.5">
        <span className="text-xs font-medium text-[#666]">AI Investment Briefing</span>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 rounded border border-[#bbb] bg-[#f7f7f7] px-3 py-1.5 text-xs font-medium text-[#333] hover:bg-[#eee]"
        >
          <X className="h-3.5 w-3.5" />
          Back to map
        </button>
      </div>

      {/* Slide area */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-6 sm:p-10">
        <div className="flex h-full w-full max-w-4xl flex-col rounded-sm border border-[#ccc] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <SlideView slide={slide} index={index} total={slides.length} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex shrink-0 items-center justify-between border-t border-[#ccc] bg-white px-5 py-3">
        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          className="flex items-center gap-1 rounded border border-[#bbb] bg-[#f7f7f7] px-3 py-1.5 text-xs font-medium text-[#333] disabled:opacity-40 hover:bg-[#eee]"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === index ? "bg-[#2563eb]" : "bg-[#ccc] hover:bg-[#999]"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
          <span className="ml-2 text-xs text-[#666]">
            {index + 1} / {slides.length}
          </span>
        </div>

        <button
          onClick={() => go(1)}
          disabled={index === slides.length - 1}
          className="flex items-center gap-1 rounded border border-[#bbb] bg-[#f7f7f7] px-3 py-1.5 text-xs font-medium text-[#333] disabled:opacity-40 hover:bg-[#eee]"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SlideView({ slide, index, total }: { slide: SlideContent; index: number; total: number }) {
  return (
    <div className="flex h-full min-h-[420px] flex-col p-8 sm:p-12">
      {/* Title block — PowerPoint-style accent bar */}
      <div className="mb-6 border-l-4 border-[#2563eb] pl-4">
        <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a] sm:text-3xl">{slide.title}</h1>
        {slide.subtitle && (
          <p className="mt-1 text-sm text-[#555]">{slide.subtitle}</p>
        )}
      </div>

      {/* Main stat callout */}
      {slide.stat && (
        <div className="mb-6 inline-flex w-fit flex-col rounded border border-[#ddd] bg-[#f8f9fa] px-5 py-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#666]">
            {slide.stat.label}
          </span>
          <span className="text-3xl font-bold tabular text-[#2563eb] sm:text-4xl">{slide.stat.value}</span>
        </div>
      )}

      {/* Bullets */}
      <ul className="flex-1 space-y-3 text-[15px] leading-relaxed text-[#333]">
        {slide.bullets.map((b, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563eb]" />
            <span>{b.text}</span>
          </li>
        ))}
      </ul>

      {/* Secondary stats */}
      {slide.stats && slide.stats.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#eee] pt-5 sm:grid-cols-3">
          {slide.stats.map((s) => (
            <div key={s.label} className="rounded border border-[#e5e5e5] bg-[#fafafa] px-3 py-2">
              <div className="text-[10px] font-medium uppercase tracking-wide text-[#888]">{s.label}</div>
              <div className="mt-0.5 text-sm font-semibold text-[#222]">{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#eee] pt-4">
        {slide.footnote ? (
          <p className="max-w-[85%] text-[10px] leading-snug text-[#888]">{slide.footnote}</p>
        ) : (
          <span />
        )}
        <span className="shrink-0 text-[10px] text-[#aaa]">
          {index + 1} / {total}
        </span>
      </div>
    </div>
  );
}
