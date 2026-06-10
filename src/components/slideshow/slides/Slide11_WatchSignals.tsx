"use client";

import { useSlideAnimation } from "../hooks/useSlideAnimation";
import { GlassCard } from "../shared/SlidePrimitives";
import { WATCH_SIGNALS } from "../utils/slideData";
import { SLIDE } from "../utils/slideTheme";

export function Slide11_WatchSignals({ isActive }: { isActive: boolean }) {
  const { enter } = useSlideAnimation(isActive, 100);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto px-6 py-5">
      <div className={enter(0)}>
        <h2 className="text-xl font-bold text-white sm:text-2xl">What to Watch: 5 Signals That Matter</h2>
        <p className="mt-1 text-sm text-white/50">Track these to know which way the cycle breaks</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {WATCH_SIGNALS.slice(0, 3).map((s, i) => (
          <SignalCard key={i} index={i + 1} signal={s} className={enter(i + 1)} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {WATCH_SIGNALS.slice(3).map((s, i) => (
          <SignalCard key={i + 3} index={i + 4} signal={s} className={enter(i + 4)} wide={i === 1} />
        ))}
      </div>

      <p className={`mt-auto text-center text-sm italic text-white/45 ${enter(6)}`}>
        The capital flows mapped in this observatory tell us where confidence is being placed. Whether that confidence
        is warranted — that&apos;s the $3 trillion question of our era.
      </p>
    </div>
  );
}

function SignalCard({
  index,
  signal,
  className = "",
  wide = false,
}: {
  index: number;
  signal: (typeof WATCH_SIGNALS)[number];
  className?: string;
  wide?: boolean;
}) {
  return (
    <GlassCard className={`p-4 ${wide ? "sm:col-span-2" : ""} ${className}`} borderTop={SLIDE.primary}>
      <div className="flex items-start gap-3">
        <span className="font-mono text-2xl font-bold tabular text-[#00d4ff]/60">{String(index).padStart(2, "0")}</span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-white">{signal.title}</div>
          <div className="mt-1 text-xs text-white/50">{signal.what}</div>
          <div className="mt-2 space-y-1 text-[11px] leading-relaxed">
            <div>
              <span className="text-[#00c48c]">Bull: </span>
              <span className="text-white/60">{signal.bullish}</span>
            </div>
            <div>
              <span className="text-[#ff4d4f]">Bear: </span>
              <span className="text-white/60">{signal.bearish}</span>
            </div>
            <div className="text-white/40">Watch: {signal.watch}</div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
