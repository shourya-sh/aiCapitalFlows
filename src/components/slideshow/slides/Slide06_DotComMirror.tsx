"use client";

import { ArrowLeftRight, Building2, Flame, Layers, TrendingUp, Zap } from "lucide-react";
import { formatCountUp } from "../hooks/useCountUp";
import { useSlideAnimation } from "../hooks/useSlideAnimation";
import { GlassCard, InsightStrip, SourceNote } from "../shared/SlidePrimitives";
import { DOTCOM_MIRROR } from "../utils/slideData";
import { SLIDE } from "../utils/slideTheme";

const { then, now, charts, callouts } = DOTCOM_MIRROR;
const PE_MAX = Math.max(then.pe, now.pe);

function EraBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex rounded-full px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider"
      style={{ background: `${color}18`, color }}
    >
      {label}
    </span>
  );
}

function LeaderCard({
  era,
  company,
  marketCapBn,
  gdpPct,
  pe,
  profitBn,
  color,
}: {
  era: string;
  company: string;
  marketCapBn: number;
  gdpPct: number;
  pe: number;
  profitBn: number;
  color: string;
}) {
  const cap =
    marketCapBn >= 1000 ? `$${(marketCapBn / 1000).toFixed(1)}T${marketCapBn >= 4000 ? "+" : ""}` : `$${marketCapBn}B`;

  return (
    <GlassCard borderTop={color} className="relative flex min-h-0 flex-col overflow-hidden p-2">
      <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-20 blur-xl" style={{ background: color }} />
      <EraBadge label={era} color={color} />
      <div className="mt-1.5 flex items-center gap-1.5">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[11px] font-bold"
          style={{ background: `${color}22`, color }}
        >
          {company.slice(0, 2)}
        </div>
        <div className="min-w-0 truncate text-xs font-semibold text-white">{company}</div>
      </div>
      <div className="mt-1 font-mono text-xl font-bold tabular leading-none" style={{ color }}>
        {cap}
      </div>
      <div className="text-[9px] text-white/45">{gdpPct}% of US GDP</div>
      <div className="mt-1.5 grid grid-cols-2 gap-1">
        <div className="rounded px-1.5 py-0.5" style={{ background: `${color}12` }}>
          <div className="font-mono text-xs font-bold tabular" style={{ color }}>
            {pe}×
          </div>
          <div className="text-[8px] text-white/40">P/E</div>
        </div>
        <div className="rounded px-1.5 py-0.5" style={{ background: `${color}12` }}>
          <div className="font-mono text-xs font-bold tabular" style={{ color }}>
            ${profitBn}B
          </div>
          <div className="text-[8px] text-white/40">Profit/yr</div>
        </div>
      </div>
    </GlassCard>
  );
}

function DualBarChart({
  label,
  thenVal,
  nowVal,
  max,
  suffix = "",
  prefix = "",
  thenNote,
  nowNote,
  visible,
  delay,
}: {
  label: string;
  thenVal: number;
  nowVal: number;
  max: number;
  suffix?: string;
  prefix?: string;
  thenNote?: string;
  nowNote?: string;
  visible: boolean;
  delay: number;
}) {
  const fmt = (v: number) => `${prefix}${v}${suffix}`;

  return (
    <div>
      <div className="mb-0.5 truncate text-[8px] font-medium text-white/50">{label}</div>
      <div className="space-y-0.5">
        <div className="flex items-center gap-1">
          <span className="w-5 shrink-0 font-mono text-[7px] text-white/30">99</span>
          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: visible ? `${(thenVal / max) * 100}%` : "0%",
                background: `linear-gradient(90deg, ${SLIDE.amber}88, ${SLIDE.amber})`,
                transitionDelay: `${delay}ms`,
                minWidth: visible ? 3 : 0,
              }}
            />
          </div>
          <span className="w-12 shrink-0 text-right font-mono text-[8px] font-semibold tabular" style={{ color: SLIDE.amber }}>
            {fmt(thenVal)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-5 shrink-0 font-mono text-[7px] text-white/30">26</span>
          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: visible ? `${(nowVal / max) * 100}%` : "0%",
                background: `linear-gradient(90deg, ${SLIDE.primary}88, ${SLIDE.primary})`,
                transitionDelay: `${delay + 50}ms`,
                minWidth: visible ? 3 : 0,
              }}
            />
          </div>
          <span className="w-12 shrink-0 text-right font-mono text-[8px] font-semibold tabular" style={{ color: SLIDE.primary }}>
            {fmt(nowVal)}
          </span>
        </div>
      </div>
      {(thenNote || nowNote) && (
        <div className="flex justify-between text-[7px] text-white/28">
          <span>{thenNote}</span>
          <span>{nowNote}</span>
        </div>
      )}
    </div>
  );
}

function PeDuel({ visible, delay }: { visible: boolean; delay: number }) {
  return (
    <GlassCard className="flex flex-col p-2">
      <div className="mb-1 flex items-center gap-1 text-[9px] font-medium uppercase tracking-wide text-white/40">
        <TrendingUp size={10} />
        P/E duel
      </div>
      <div className="flex items-end justify-center gap-3">
        <div className="flex flex-col items-center">
          <div
            className="w-8 rounded-t-sm transition-all duration-700 ease-out"
            style={{
              height: visible ? `${(then.pe / PE_MAX) * 52}px` : 0,
              minHeight: visible ? 6 : 0,
              background: `linear-gradient(to top, ${SLIDE.amber}55, ${SLIDE.amber})`,
              transitionDelay: `${delay}ms`,
            }}
          />
          <div className="mt-0.5 font-mono text-sm font-bold tabular" style={{ color: SLIDE.amber }}>
            {then.pe}×
          </div>
          <div className="text-[8px] text-white/40">Cisco</div>
        </div>
        <div className="flex flex-col items-center pb-4">
          <ArrowLeftRight size={12} className="text-white/25" />
          <div className="mt-0.5 rounded-full px-1.5 py-px text-[8px] font-semibold" style={{ background: `${SLIDE.positive}18`, color: SLIDE.positive }}>
            4.2× cheaper
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div
            className="w-8 rounded-t-sm transition-all duration-700 ease-out"
            style={{
              height: visible ? `${(now.pe / PE_MAX) * 52}px` : 0,
              minHeight: visible ? 6 : 0,
              background: `linear-gradient(to top, ${SLIDE.primary}55, ${SLIDE.primary})`,
              transitionDelay: `${delay + 80}ms`,
            }}
          />
          <div className="mt-0.5 font-mono text-sm font-bold tabular" style={{ color: SLIDE.primary }}>
            {now.pe}×
          </div>
          <div className="text-[8px] text-white/40">NVIDIA</div>
        </div>
      </div>
    </GlassCard>
  );
}

export function Slide06_DotComMirror({ isActive }: { isActive: boolean }) {
  const { visible, enter } = useSlideAnimation(isActive, 60);

  const calloutColors = {
    positive: SLIDE.positive,
    primary: SLIDE.primary,
    amber: SLIDE.amber,
  };

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-1.5 overflow-hidden px-5 py-2.5 sm:px-6">
      <div className={`shrink-0 ${enter(0)}`}>
        <h2 className="text-lg font-bold leading-tight text-white sm:text-xl">The Dot-Com Mirror: 1999 vs Now</h2>
        <p className="text-[11px] text-white/50">Same playbook, different physics — infrastructure endures, valuations may not</p>
      </div>

      <div className={`grid min-h-0 grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-2 overflow-hidden ${enter(1)}`}>
        <div className="flex min-h-0 min-w-0 flex-col gap-1.5 overflow-hidden">
          <div className="grid shrink-0 grid-cols-2 gap-1.5">
            <LeaderCard
              era={then.era}
              company={then.company}
              marketCapBn={then.marketCapBn}
              gdpPct={then.gdpPct}
              pe={then.pe}
              profitBn={then.profitBn}
              color={SLIDE.amber}
            />
            <LeaderCard
              era={now.era}
              company={now.company}
              marketCapBn={now.marketCapBn}
              gdpPct={now.gdpPct}
              pe={now.pe}
              profitBn={now.profitBn}
              color={SLIDE.primary}
            />
          </div>

          <div className="grid shrink-0 grid-cols-3 gap-1">
            {callouts.map((c, i) => (
              <div
                key={c.label}
                className="transition-opacity duration-500"
                style={{ opacity: visible ? 1 : 0, transitionDelay: `${160 + i * 50}ms` }}
              >
                <GlassCard className="p-1.5 text-center">
                  <div className="font-mono text-sm font-bold tabular" style={{ color: calloutColors[c.tone] }}>
                    {c.value}
                  </div>
                  <div className="text-[8px] font-medium text-white/65">{c.label}</div>
                </GlassCard>
              </div>
            ))}
          </div>

          <PeDuel visible={visible} delay={220} />

          <GlassCard className="grid shrink-0 grid-cols-2 gap-1.5 p-2" borderTop={SLIDE.danger}>
            <div>
              <div className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wide text-white/40">
                <Zap size={9} style={{ color: SLIDE.amber }} />
                1999 infra
              </div>
              <div className="font-mono text-base font-bold tabular" style={{ color: SLIDE.amber }}>
                ${then.infraT}T
              </div>
              <div className="text-[9px] text-white/50">{then.infraLabel}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wide text-white/40">
                <Building2 size={9} style={{ color: SLIDE.primary }} />
                2026 infra
              </div>
              <div className="font-mono text-base font-bold tabular" style={{ color: SLIDE.primary }}>
                ${now.infraT}T
              </div>
              <div className="text-[9px] text-white/50">{now.infraLabel}</div>
            </div>
          </GlassCard>
        </div>

        <div className="flex min-h-0 min-w-0 flex-col gap-1.5 overflow-hidden">
          <GlassCard className="flex min-h-0 flex-1 flex-col overflow-hidden p-2">
            <div className="mb-1 flex shrink-0 items-center justify-between">
              <span className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-wide text-white/40">
                <Layers size={10} />
                Mirror metrics
              </span>
              <div className="flex gap-2 text-[7px]">
                <span style={{ color: SLIDE.amber }}>● 1999</span>
                <span style={{ color: SLIDE.primary }}>● 2026</span>
              </div>
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-1 content-start gap-1.5 overflow-hidden">
              {charts.map((chart, i) => (
                <DualBarChart
                  key={chart.id}
                  label={chart.label}
                  thenVal={chart.then}
                  nowVal={chart.now}
                  max={chart.max}
                  suffix={chart.suffix}
                  prefix={"prefix" in chart ? chart.prefix : ""}
                  thenNote={"thenNote" in chart ? chart.thenNote : undefined}
                  nowNote={"nowNote" in chart ? chart.nowNote : undefined}
                  visible={visible}
                  delay={100 + i * 55}
                />
              ))}
            </div>
          </GlassCard>

          <GlassCard borderTop={SLIDE.danger} className="shrink-0 p-2">
            <div className="mb-1 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-white/40">
              <Flame size={10} style={{ color: SLIDE.danger }} />
              Startup layer — same playbook?
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {([then, now] as const).map((era, i) => {
                const color = i === 0 ? SLIDE.amber : SLIDE.primary;
                return (
                  <div
                    key={era.startup.name}
                    className="rounded-md border p-1.5 transition-all duration-500"
                    style={{
                      borderColor: `${color}33`,
                      background: `${color}08`,
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(4px)",
                      transitionDelay: `${350 + i * 60}ms`,
                    }}
                  >
                    <div className="text-[9px] font-semibold" style={{ color }}>
                      {era.startup.name}
                    </div>
                    <div className="font-mono text-[11px] font-bold tabular text-white/85">{era.startup.valuation}</div>
                    <div className="text-[8px] text-white/45">{era.startup.hook}</div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>

      <div className={`shrink-0 space-y-1 ${enter(2)}`}>
        <InsightStrip variant="neutral">
          <span className="text-[10px] leading-snug">
            <strong className="text-white">Critical difference:</strong> Cisco at {then.pe}× vs NVIDIA at {now.pe}× — and
            earns {formatCountUp(now.profitBn, 0)}× more. But OpenAI at $730B with no profit until 2030 rhymes with
            Pets.com. Physical layer is real. Application layer may not be.
          </span>
        </InsightStrip>
        <SourceNote>
          Lesson from 1999: Cisco&apos;s infrastructure endured. Its stock never recovered. Dark fiber powered the
          internet — after wiping out investors first.
        </SourceNote>
      </div>
    </div>
  );
}
