"use client";

import { formatCountUp, useCountUp } from "../hooks/useCountUp";
import { useSlideAnimation } from "../hooks/useSlideAnimation";
import { GlassCard, InsightStrip, MonoStat, SourceNote } from "../shared/SlidePrimitives";
import { CAPEX_ACTION_SIGNALS, CAPEX_HISTORICAL, HYPSCALER_CAPEX_2026 } from "../utils/slideData";
import { SLIDE } from "../utils/slideTheme";

const MAX = HYPSCALER_CAPEX_2026[0].value;
const COMBINED = HYPSCALER_CAPEX_2026.reduce((s, h) => s + h.value, 0);
const Y_AXIS_TICKS = [200, 150, 100, 50, 0];

export function Slide03_CapexArmsRace({ isActive }: { isActive: boolean }) {
  const combined = useCountUp(COMBINED, 1600, isActive);
  const { visible, enter } = useSlideAnimation(isActive, 100);

  return (
    <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto] gap-2 overflow-hidden px-5 py-3 sm:px-8">
      <div className={`min-h-0 ${enter(0)}`}>
        <h2 className="text-lg font-bold leading-tight text-white sm:text-xl">The CapEx Arms Race</h2>
        <p className="text-xs text-white/50">2026 hyperscaler capex — unprecedented scale, unproven returns</p>
      </div>

      <div className={`grid min-h-0 grid-cols-[minmax(0,1fr)_248px] gap-3 ${enter(1)}`}>
        <GlassCard className="flex min-h-0 flex-col p-3">
          <div className="mb-2 flex shrink-0 items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wide text-white/40">2026 capex ($B)</span>
            <span className="font-mono text-[9px] text-white/30">company guidance</span>
          </div>

          <div className="flex min-h-0 flex-1 gap-1.5">
            <div className="flex w-7 shrink-0 flex-col justify-between py-0.5">
              {Y_AXIS_TICKS.map((tick) => (
                <span key={tick} className="font-mono text-[9px] tabular leading-none text-white/30">
                  ${tick}
                </span>
              ))}
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <div className="relative min-h-0 flex-1">
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                  {Y_AXIS_TICKS.map((tick) => (
                    <div key={tick} className="border-t border-dashed border-white/[0.06]" />
                  ))}
                </div>

                <div className="relative z-10 flex h-full items-end justify-around gap-1 border-b border-l border-white/10 px-1 pb-0">
                  {HYPSCALER_CAPEX_2026.map((h, i) => (
                    <div key={h.name} className="flex h-full min-w-0 flex-1 items-end justify-center">
                      <div
                        className="w-full max-w-[48px] rounded-t-sm transition-all duration-700 ease-out"
                        style={{
                          height: visible ? `${(h.value / MAX) * 100}%` : "0%",
                          minHeight: visible ? 4 : 0,
                          background: `linear-gradient(to top, ${h.color}, ${h.color}88)`,
                          transitionDelay: `${i * 90}ms`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-1.5 grid shrink-0 grid-cols-5 gap-0.5">
                {HYPSCALER_CAPEX_2026.map((h) => (
                  <div key={h.name} className="min-w-0 text-center leading-tight">
                    <div className="text-[9px] font-medium text-white/75">{h.name}</div>
                    <div className="font-mono text-[9px] font-semibold tabular text-white/65">
                      {formatCountUp(h.value, 0)}
                    </div>
                    <div className="font-mono text-[8px] tabular text-white/35">
                      {h.yoy} · {h.capexPctRevenue}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="flex min-h-0 flex-col justify-between gap-1.5">
          <GlassCard className="p-2.5">
            <MonoStat value={formatCountUp(combined, 0)} label="Big Five combined, 2026" color={SLIDE.amber} size="sm" />
            <SourceNote>
              +36% vs 2025 · {formatCountUp(CAPEX_HISTORICAL[0].value, 0)} → {formatCountUp(CAPEX_HISTORICAL[2].value, 0)}
            </SourceNote>
          </GlassCard>
          <GlassCard className="p-2.5" borderTop={SLIDE.danger}>
            <MonoStat value="45–57%" label="Revenue spent on capex" color={SLIDE.danger} size="sm" />
            <p className="mt-0.5 text-[10px] leading-snug text-white/55">Meta 57% — utility territory.</p>
          </GlassCard>
          <InsightStrip variant="danger">
            <span className="text-[10px] leading-snug">
              Goldman: $1.15T capex 2025–27. Consensus undershot actuals ~50% two years running.
            </span>
          </InsightStrip>
        </div>
      </div>

      <div className={`grid grid-cols-3 gap-2 ${enter(2)}`}>
        {CAPEX_ACTION_SIGNALS.map((item) => (
          <GlassCard
            key={item.title}
            className="p-2"
            borderTop={item.variant === "danger" ? SLIDE.danger : item.variant === "amber" ? SLIDE.amber : SLIDE.primary}
          >
            <div className="text-[9px] font-semibold uppercase tracking-wide text-white/40">{item.title}</div>
            <div className="mt-0.5 text-[10px] font-medium leading-tight text-white/85">{item.signal}</div>
            <p className="mt-0.5 line-clamp-2 text-[9px] leading-snug text-white/50">
              <span className="text-[#00d4ff]">→ </span>
              {item.action}
            </p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
