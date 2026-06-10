"use client";

import { formatCountUp, useCountUp } from "../hooks/useCountUp";
import { useSlideAnimation } from "../hooks/useSlideAnimation";
import { GlassCard, InsightStrip, MonoStat, SourceNote } from "../shared/SlidePrimitives";
import { HYPSCALER_CAPEX_2026 } from "../utils/slideData";
import { SLIDE } from "../utils/slideTheme";

const MAX = HYPSCALER_CAPEX_2026[0].value;
const COMBINED = HYPSCALER_CAPEX_2026.reduce((s, h) => s + h.value, 0);

export function Slide03_CapexArmsRace({ isActive }: { isActive: boolean }) {
  const combined = useCountUp(COMBINED, 1600, isActive);
  const { visible, enter } = useSlideAnimation(isActive, 100);

  return (
    <div className="flex h-full flex-col gap-4 px-6 py-6 lg:flex-row lg:gap-8 lg:px-10">
      <div className={`flex min-h-0 flex-1 flex-col ${enter(0)}`}>
        <h2 className="text-xl font-bold text-white sm:text-2xl">The CapEx Arms Race</h2>
        <p className="mt-1 text-sm text-white/50">2026 hyperscaler capex — individual bars</p>
        <div className="mt-4 flex h-52 items-end justify-around gap-2 pb-2">
          {HYPSCALER_CAPEX_2026.map((h, i) => (
            <div key={h.name} className="flex flex-1 flex-col items-center gap-2">
              <span className="font-mono text-[10px] tabular text-white/50 sm:text-xs">
                {formatCountUp(h.value, 0)}
              </span>
              <div className="relative flex h-full w-full max-w-[56px] items-end">
                <div
                  className="w-full rounded-t-md transition-all duration-700 ease-out"
                  style={{
                    height: visible ? `${(h.value / MAX) * 100}%` : "0%",
                    minHeight: visible ? 8 : 0,
                    background: `linear-gradient(to top, ${SLIDE.primary}, rgba(0,212,255,0.4))`,
                    transitionDelay: `${i * 100}ms`,
                  }}
                />
              </div>
              <span className="text-[10px] text-white/60 sm:text-xs">{h.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`flex w-full flex-col gap-3 lg:w-[42%] ${enter(1)}`}>
        <GlassCard className="p-4">
          <MonoStat value={formatCountUp(combined, 0)} label="Combined Big Five capex in 2026" color={SLIDE.amber} />
          <SourceNote>+36% vs 2025 · +325% vs 2022</SourceNote>
        </GlassCard>
        <GlassCard className="p-4" borderTop={SLIDE.danger}>
          <MonoStat value="45–57%" label="Of revenue now spent on capex" color={SLIDE.danger} size="lg" />
          <p className="mt-2 text-sm text-white/60">
            Previously unthinkable for a tech company. This is utility-company territory.
          </p>
        </GlassCard>
        <InsightStrip variant="danger">
          ⚠️ Goldman Sachs projects $1.15T in hyperscaler capex 2025–2027 alone — more than double all capex spent in
          the three prior years combined.
        </InsightStrip>
        <InsightStrip variant="amber">
          Consensus capex estimates have been wrong — too low — for two years running. Each year actual spend exceeded
          projections by ~50%.
        </InsightStrip>
      </div>
    </div>
  );
}
