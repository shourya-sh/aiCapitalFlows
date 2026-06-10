"use client";

import { formatUsd } from "@/lib/utils";
import { useSlideAnimation } from "../hooks/useSlideAnimation";
import type { LiveSlideMetrics } from "../utils/liveSlideData";
import { CapitalPieChart } from "../shared/CapitalPieChart";
import { InsightStrip, SourceNote } from "../shared/SlidePrimitives";
import { PROJECTED_CAPITAL_MIX } from "../utils/slideData";

export function Slide02_CapitalMap({
  isActive,
  live,
}: {
  isActive: boolean;
  live: LiveSlideMetrics;
}) {
  const { enter } = useSlideAnimation(isActive, 80);

  const currentTotal = live.categories.reduce((s, c) => s + c.value, 0);
  const currentSlices = live.categories.map((c) => ({
    label: c.label,
    value: c.value,
    share: c.share,
    color: c.color,
  }));

  const projectedSlices = PROJECTED_CAPITAL_MIX.sectors.map((s) => ({
    label: s.label,
    value: s.share * PROJECTED_CAPITAL_MIX.totalAnnualUsd,
    share: s.share,
    color: s.color,
  }));

  const foundationShare = currentSlices.find((c) => c.label === "Foundation Models")?.share ?? 0;
  const computeInfraToday =
    (currentSlices.find((c) => c.label === "Datacenter / Compute")?.share ?? 0) +
    (currentSlices.find((c) => c.label === "Infrastructure")?.share ?? 0);
  const computeInfraProjected = PROJECTED_CAPITAL_MIX.sectors
    .filter((s) => s.label.startsWith("Datacenter") || s.label.startsWith("Infrastructure"))
    .reduce((s, x) => s + x.share, 0);
  const energyToday = currentSlices.find((c) => c.label === "Energy")?.share ?? 0;
  const energyProjected = PROJECTED_CAPITAL_MIX.sectors.find((s) => s.label.startsWith("Energy"))?.share ?? 0;

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto px-5 py-5 sm:gap-4 sm:px-8">
      <div className={enter(0)}>
        <h2 className="text-xl font-bold text-white sm:text-2xl">Where Every Dollar Is Going</h2>
        <p className="mt-1 text-sm text-white/50">
          Tracked capital flows today vs. where analysts expect investment to shift by{" "}
          {PROJECTED_CAPITAL_MIX.year}
        </p>
      </div>

      <div className={`grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 ${enter(1)}`}>
        {/* Current — from Observatory flow data */}
        <div className="flex min-h-[280px] flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 sm:min-h-[320px] sm:p-4">
          <div className="mb-2 shrink-0">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#00d4ff]">Tracked today</div>
            <div className="text-[11px] text-white/40">All deployed capital flows by recipient sector</div>
          </div>
          <CapitalPieChart
            data={currentSlices}
            active={isActive}
            totalLabel={`${formatUsd(currentTotal)} deployed`}
          />
          <SourceNote>Observatory flow data · investments, compute deals, supply &amp; partnerships</SourceNote>
        </div>

        {/* Projected */}
        <div className="flex min-h-[280px] flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 sm:min-h-[320px] sm:p-4">
          <div className="mb-2 shrink-0">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#f5a623]">
              Projected {PROJECTED_CAPITAL_MIX.year}
            </div>
            <div className="text-[11px] text-white/40">Annual global AI capital allocation forecast</div>
          </div>
          <CapitalPieChart
            data={projectedSlices}
            active={isActive}
            totalLabel={`~${formatUsd(PROJECTED_CAPITAL_MIX.totalAnnualUsd)}/yr`}
          />
          <SourceNote>{PROJECTED_CAPITAL_MIX.source}</SourceNote>
        </div>
      </div>

      <InsightStrip variant="amber">
        <span className="text-[#f5a623]">The shift:</span> Today, foundation-model labs absorb the largest share (
        {(foundationShare * 100).toFixed(0)}%) of tracked flows — driven by mega-rounds at OpenAI and Anthropic. By{" "}
        {PROJECTED_CAPITAL_MIX.year}, analysts expect{" "}
        <span className="text-white/90">
          compute + infrastructure to hit {(computeInfraProjected * 100).toFixed(0)}%
        </span>{" "}
        combined (vs {(computeInfraToday * 100).toFixed(0)}% today) as the hyperscaler capex arms race ($700B+ in 2026
        alone) overtakes frontier fundraising. Energy rises from {(energyToday * 100).toFixed(0)}% to{" "}
        {(energyProjected * 100).toFixed(0)}% as power becomes the binding constraint.
      </InsightStrip>
    </div>
  );
}
