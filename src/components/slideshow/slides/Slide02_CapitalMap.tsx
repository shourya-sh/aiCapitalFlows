"use client";

import { formatUsd } from "@/lib/utils";
import { useSlideAnimation } from "../hooks/useSlideAnimation";
import type { LiveSlideMetrics } from "../utils/liveSlideData";
import { InsightStrip, SourceNote } from "../shared/SlidePrimitives";
import { SLIDE } from "../utils/slideTheme";

export function Slide02_CapitalMap({
  isActive,
  live,
}: {
  isActive: boolean;
  live: LiveSlideMetrics;
}) {
  const { visible, enter } = useSlideAnimation(isActive, 80);
  const maxShare = Math.max(...live.categories.map((c) => c.share), 0.01);

  return (
    <div className="flex h-full flex-col gap-4 px-6 py-6 sm:px-10">
      <div className={enter(0)}>
        <h2 className="text-2xl font-bold text-white sm:text-3xl">Where Every Dollar Is Going</h2>
        <p className="mt-1 text-sm text-white/50">Capital distribution across categories tracked in the Observatory</p>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {live.categories.map((cat, i) => (
          <div key={cat.label} className={`${enter(i + 1)}`}>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span className="text-sm text-white/80">{cat.label}</span>
              <span className="font-mono text-sm tabular text-white/50">
                {(cat.share * 100).toFixed(0)}% · {formatUsd(cat.value)}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: visible ? `${(cat.share / maxShare) * 100}%` : "0%",
                  background: cat.color,
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className={`text-right text-sm italic text-white/40 ${enter(live.categories.length + 1)}`}>
        Compute is the new oil. Infrastructure is eating everything.
      </p>

      <InsightStrip variant="amber">
        <span className="text-[#f5a623]">💡</span> You probably didn&apos;t know: The ~$450B going into data centers in 2026
        is larger than the entire annual global investment in oil &amp; gas production — the industry that powered the
        20th century.
        <SourceNote>Industry capex estimates · IEA / hyperscaler guidance</SourceNote>
      </InsightStrip>
    </div>
  );
}
