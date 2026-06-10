"use client";

import { useState } from "react";
import { useSlideAnimation } from "../hooks/useSlideAnimation";
import { BEAR_CASE, BULL_CASE } from "../utils/slideData";
import { InsightStrip } from "../shared/SlidePrimitives";
import { SLIDE } from "../utils/slideTheme";

export function Slide10_BubbleOrBreakthrough({ isActive }: { isActive: boolean }) {
  const { enter } = useSlideAnimation(isActive, 80);
  const [meter, setMeter] = useState(50);

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto px-6 py-5">
      <div className={enter(0)}>
        <h2 className="text-xl font-bold text-white sm:text-2xl">The $600B Question: Bubble or Breakthrough?</h2>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div className={`space-y-2 ${enter(1)}`}>
          <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: SLIDE.positive }}>
            Bull Case
          </div>
          <ul className="space-y-1.5">
            {BULL_CASE.map((item, i) => (
              <li key={i} className="flex gap-2 text-xs leading-relaxed text-white/75 sm:text-sm">
                <span style={{ color: SLIDE.positive }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`hidden flex-col items-center justify-center px-2 lg:flex ${enter(2)}`}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMeter(Math.round(((e.clientY - rect.top) / rect.height) * 100));
          }}
        >
          <div className="relative h-48 w-1 rounded-full bg-white/10">
            <div
              className="absolute bottom-0 w-full rounded-full transition-all duration-150"
              style={{
                height: `${100 - meter}%`,
                background: `linear-gradient(to top, ${SLIDE.danger}, ${SLIDE.amber}, ${SLIDE.positive})`,
                boxShadow: "0 0 12px rgba(0,212,255,0.4)",
              }}
            />
          </div>
          <span className="mt-2 font-mono text-[10px] text-white/40">Hover meter</span>
        </div>

        <div className={`space-y-2 ${enter(3)}`}>
          <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: SLIDE.danger }}>
            Bear Case
          </div>
          <ul className="space-y-1.5">
            {BEAR_CASE.map((item, i) => (
              <li key={i} className="flex gap-2 text-xs leading-relaxed text-white/75 sm:text-sm">
                <span style={{ color: SLIDE.danger }}>✗</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <InsightStrip variant="neutral">
        The physical layer (chips, compute, datacenters) appears real and defensible. The application layer valuation
        premium is where bubble risk concentrates.
      </InsightStrip>
    </div>
  );
}
