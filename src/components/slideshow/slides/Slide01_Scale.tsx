"use client";

import { formatCountUp, useCountUp } from "../hooks/useCountUp";
import { useSlideAnimation } from "../hooks/useSlideAnimation";
import type { LiveSlideMetrics } from "../utils/liveSlideData";
import { SLIDE01_SUPPORT } from "../utils/slideData";
import { SLIDE } from "../utils/slideTheme";
import { GlassCard, MonoStat, PulseRipples, SourceNote } from "../shared/SlidePrimitives";

export function Slide01_Scale({
  isActive,
  live,
}: {
  isActive: boolean;
  live: LiveSlideMetrics;
}) {
  const hero = useCountUp(live.totalCapital, 1800, isActive);
  const { enter } = useSlideAnimation(isActive);

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6 py-8 text-center">
      <PulseRipples active={isActive} />
      <div className={`relative z-10 ${enter(0)}`}>
        <MonoStat
          size="hero"
          value={formatCountUp(hero, 1)}
          label="Tracked AI Capital Flows"
          color={SLIDE.primary}
        />
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
          Across {live.entityCount} entities and {live.flowCount} discrete investment events — and this is only
          what&apos;s been made public.
        </p>
      </div>

      <div className="relative z-10 mt-10 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
        {SLIDE01_SUPPORT.map((c, i) => (
          <GlassCard key={i} className={`p-4 text-left ${enter(i + 1)}`}>
            <div className="font-mono text-2xl font-bold tabular" style={{ color: SLIDE.amber }}>
              {"isPct" in c && c.isPct ? `${(c.value * 100).toFixed(0)}%` : formatCountUp(c.value as number, 1)}
            </div>
            <div className="mt-1 text-sm text-white/70">{c.label}</div>
            <SourceNote>{c.source}</SourceNote>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
