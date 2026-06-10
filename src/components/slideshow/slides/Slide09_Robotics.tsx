"use client";

import { formatCountUp } from "../hooks/useCountUp";
import { useSlideAnimation } from "../hooks/useSlideAnimation";
import { GlassCard, InsightStrip, SourceNote } from "../shared/SlidePrimitives";
import { ROBOTICS_LADDER } from "../utils/slideData";
import { SLIDE } from "../utils/slideTheme";

const MAX = ROBOTICS_LADDER[0].value;

export function Slide09_Robotics({ isActive }: { isActive: boolean }) {
  const { visible, enter } = useSlideAnimation(isActive, 100);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto px-6 py-5 lg:flex-row lg:gap-8">
      <div className={`flex flex-1 flex-col ${enter(0)}`}>
        <h2 className="text-xl font-bold text-white sm:text-2xl">Robots Are Getting Funded Like It&apos;s 1999</h2>
        <p className="mt-1 text-sm text-white/50">Capital cascading from software AI into physical AI</p>

        <div className="mt-4 space-y-3">
          {ROBOTICS_LADDER.map((r, i) => (
            <div key={r.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-white/80">{r.name}</span>
                <span className="font-mono tabular text-white/50">{formatCountUp(r.value, 0)}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: visible ? `${(r.value / MAX) * 100}%` : "0%",
                    background: SLIDE.positive,
                    transitionDelay: `${i * 80}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`flex w-full flex-col gap-3 lg:w-[42%] ${enter(1)}`}>
        <GlassCard className="p-4">
          <div className="font-mono text-3xl font-bold tabular text-[#00c48c]">$10B+</div>
          <div className="text-sm text-white/70">Global robotics investment in 2025</div>
          <SourceNote>VC into humanoid platforms exceeded $3–4B in 2024 alone</SourceNote>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="font-mono text-3xl font-bold tabular text-[#00d4ff]">~50</div>
          <div className="text-sm text-white/70">Companies building humanoid robots (doubled since 2023)</div>
        </GlassCard>
        <InsightStrip variant="amber">
          Elon Musk claims 80% of Tesla&apos;s future value will come from Optimus — while Tesla earnings fell 30% and
          Optimus has zero commercial revenue. The gap between narrative and reality defines this moment.
        </InsightStrip>
        <SourceNote>
          A humanoid robot beat the human half-marathon world record in April 2026 (50:26 vs 57:32) — but had to be
          restarted twice.
        </SourceNote>
      </div>
    </div>
  );
}
