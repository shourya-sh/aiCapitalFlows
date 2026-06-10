"use client";

import { useState } from "react";
import { useSlideAnimation } from "../hooks/useSlideAnimation";
import { DOTCOM_ROWS } from "../utils/slideData";
import { InsightStrip, SourceNote } from "../shared/SlidePrimitives";
import { SLIDE } from "../utils/slideTheme";

export function Slide06_DotComMirror({ isActive }: { isActive: boolean }) {
  const { enter } = useSlideAnimation(isActive, 150);
  const [hoverRow, setHoverRow] = useState<number | null>(null);

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto px-6 py-5">
      <div className={enter(0)}>
        <h2 className="text-xl font-bold text-white sm:text-2xl">The Dot-Com Mirror: 1999 vs Now</h2>
        <p className="mt-1 text-sm text-white/50">The 1999 playbook is running again. But with real profits this time.</p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 border-b border-white/10 pb-2 text-[10px] uppercase tracking-wider text-white/40">
            <span>Metric</span>
            <span style={{ color: SLIDE.amber }}>1999 Dot-Com</span>
            <span style={{ color: SLIDE.primary }}>2026 AI Boom</span>
          </div>
          {DOTCOM_ROWS.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1fr_1fr_1fr] gap-2 border-b border-white/[0.06] py-2 transition-colors duration-200 ${enter(i + 1)}`}
              style={{
                background: hoverRow === i ? "rgba(0,212,255,0.06)" : undefined,
              }}
              onMouseEnter={() => setHoverRow(i)}
              onMouseLeave={() => setHoverRow(null)}
            >
              <span className="text-xs font-medium text-white/70">{row.metric}</span>
              <span className="text-xs text-white/55" style={{ color: hoverRow === i ? SLIDE.amber : undefined }}>
                {row.then}
              </span>
              <span className="text-xs text-white/55" style={{ color: hoverRow === i ? SLIDE.primary : undefined }}>
                {row.now}
              </span>
            </div>
          ))}
        </div>
      </div>

      <InsightStrip variant="neutral">
        The critical difference: In 1999, Cisco had a P/E of 200×. NVIDIA is at 47×. But the startup layer? OpenAI at
        $730B with no profit until 2030 rhymes with Webvan and Pets.com. The physical layer is real. The application
        layer may not be.
      </InsightStrip>

      <SourceNote>
        Lesson from 1999: Cisco&apos;s infrastructure endured. Its stock never recovered to its peak. Dark fiber powered
        the internet — after wiping out its investors first.
      </SourceNote>
    </div>
  );
}
