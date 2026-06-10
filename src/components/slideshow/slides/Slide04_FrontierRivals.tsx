"use client";

import { formatUsd } from "@/lib/utils";
import { formatCountUp, useCountUp } from "../hooks/useCountUp";
import { useSlideAnimation } from "../hooks/useSlideAnimation";
import { GlassCard, SourceNote } from "../shared/SlidePrimitives";
import {
  FRONTIER_INSIGHT_SIGNALS,
  FRONTIER_MARKET_VALUATIONS,
  FRONTIER_VALUATION_RACE,
} from "../utils/slideData";
import type { FrontierLabSide, FrontierRivalryData } from "../utils/liveSlideData";
import { SLIDE } from "../utils/slideTheme";

const LAB_COLOR = { openai: "#10a37f", anthropic: "#d4a574" } as const;
const VAL_MAX_B = 965;

function parseValB(label: string): number {
  const n = parseFloat(label.replace(/[^0-9.]/g, ""));
  return label.includes("T") ? n * 1000 : n;
}

function LabProfile({ lab, marketLabel, marketNote, isActive }: {
  lab: FrontierLabSide;
  marketLabel: string;
  marketNote: string;
  isActive: boolean;
}) {
  const funding = useCountUp(lab.totalFunding, 1400, isActive);
  const sharePct = (lab.fundingShare * 100).toFixed(0);

  return (
    <div
      className="flex min-h-0 flex-1 flex-col rounded-lg border p-2.5"
      style={{ borderColor: `${lab.color}35`, background: `${lab.color}06` }}
    >
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: lab.color }} />
        <span className="text-sm font-bold text-white">{lab.name}</span>
        {lab.founded && <span className="font-mono text-[9px] text-white/30">est. {lab.founded}</span>}
      </div>

      <div className="mt-1.5 font-mono text-2xl font-bold tabular leading-none" style={{ color: lab.color }}>
        {marketLabel}
      </div>
      <div className="text-[9px] text-white/40">{marketNote}</div>

      <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px]">
        <div>
          <div className="text-[8px] uppercase tracking-wide text-white/35">Tracked</div>
          <div className="font-mono tabular text-white/80">{formatUsd(funding)}</div>
        </div>
        <div>
          <div className="text-[8px] uppercase tracking-wide text-white/35">Sector share</div>
          <div className="font-mono tabular text-white/80">{sharePct}%</div>
        </div>
        {lab.revenue != null && lab.revenue > 0 && (
          <div className="col-span-2">
            <div className="text-[8px] uppercase tracking-wide text-white/35">Revenue</div>
            <div className="font-mono tabular text-white/80">{formatUsd(lab.revenue)}</div>
          </div>
        )}
      </div>

      <div className="mt-auto pt-2">
        <div className="text-[8px] uppercase tracking-wide text-white/35">Key backers</div>
        <div className="mt-0.5 flex flex-wrap gap-1">
          {lab.investors.slice(0, 4).map((name) => (
            <span key={name} className="rounded bg-white/[0.06] px-1 py-0.5 text-[8px] text-white/65">
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Slide04_FrontierRivals({
  isActive,
  rivalry,
}: {
  isActive: boolean;
  rivalry: FrontierRivalryData;
}) {
  const { visible, enter } = useSlideAnimation(isActive, 90);
  const combined = useCountUp(rivalry.combinedShare * 100, 1200, isActive, 0);
  const maxFunding = Math.max(rivalry.openai.totalFunding, rivalry.anthropic.totalFunding, 1);
  const combinedVal = parseValB(FRONTIER_MARKET_VALUATIONS.openai.label) + parseValB(FRONTIER_MARKET_VALUATIONS.anthropic.label);

  return (
    <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto] gap-2 overflow-hidden px-5 py-3 sm:px-8">
      <div className={`min-h-0 ${enter(0)}`}>
        <h2 className="text-lg font-bold leading-tight text-white sm:text-xl">
          OpenAI vs Anthropic: The $1.8T Frontier Race
        </h2>
        <p className="text-xs text-white/50">
          Two labs absorb{" "}
          <span className="font-mono tabular text-[#00d4ff]">{Math.round(combined)}%</span> of frontier-model
          funding — {formatCountUp(combinedVal * 1e9, 0)} combined private valuation
        </p>
      </div>

      <div className={`grid min-h-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3 ${enter(1)}`}>
        <GlassCard className="flex min-h-0 flex-col p-3">
          <div className="mb-2 flex shrink-0 items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wide text-white/40">Valuation race ($B)</span>
            <div className="flex gap-3 text-[9px]">
              <span style={{ color: LAB_COLOR.openai }}>● OpenAI</span>
              <span style={{ color: LAB_COLOR.anthropic }}>● Anthropic</span>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-center gap-1.5">
            {FRONTIER_VALUATION_RACE.map((row, i) => {
              const oai = parseValB(row.openai);
              const ant = parseValB(row.anthropic);
              const highlight = "highlight" in row && row.highlight;
              return (
                <div key={row.year} className="grid grid-cols-[52px_1fr_1fr] items-center gap-1.5">
                  <span className={`font-mono text-[9px] tabular leading-none ${highlight ? "font-semibold text-white/70" : "text-white/40"}`}>
                    {row.year}
                  </span>
                  <div className="min-w-0">
                    <div className="mb-0.5 flex justify-between gap-1">
                      <span className="font-mono text-[9px] tabular text-white/50">{row.openai}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: visible ? `${(oai / VAL_MAX_B) * 100}%` : "0%",
                          background: LAB_COLOR.openai,
                          transitionDelay: `${i * 80}ms`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="mb-0.5 flex justify-end">
                      <span className="font-mono text-[9px] tabular text-white/50">{row.anthropic}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: visible ? `${(ant / VAL_MAX_B) * 100}%` : "0%",
                          background: LAB_COLOR.anthropic,
                          transitionDelay: `${i * 80 + 40}ms`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2 shrink-0 space-y-1 border-t border-white/[0.06] pt-2">
            <span className="text-[9px] uppercase tracking-wide text-white/35">Observatory tracked funding</span>
            {[rivalry.openai, rivalry.anthropic].map((lab) => (
              <div key={lab.id}>
                <div className="mb-0.5 flex justify-between text-[9px]">
                  <span style={{ color: lab.color }}>{lab.name}</span>
                  <span className="font-mono tabular text-white/45">{formatUsd(lab.totalFunding)}</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: visible ? `${(lab.totalFunding / maxFunding) * 100}%` : "0%",
                      background: lab.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {(() => {
            const latest = [...FRONTIER_VALUATION_RACE].reverse().find((r) => "detail" in r);
            return latest && "detail" in latest ? <SourceNote>{latest.detail}</SourceNote> : null;
          })()}
        </GlassCard>

        <div className="flex min-h-0 flex-col gap-2">
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-2">
            <LabProfile
              lab={rivalry.openai}
              marketLabel={FRONTIER_MARKET_VALUATIONS.openai.label}
              marketNote={FRONTIER_MARKET_VALUATIONS.openai.note}
              isActive={isActive}
            />
            <LabProfile
              lab={rivalry.anthropic}
              marketLabel={FRONTIER_MARKET_VALUATIONS.anthropic.label}
              marketNote={FRONTIER_MARKET_VALUATIONS.anthropic.note}
              isActive={isActive}
            />
          </div>

          <GlassCard className="shrink-0 p-2.5" borderTop={SLIDE.amber}>
            <div className="text-[9px] uppercase tracking-wide text-white/40">Hyperscaler hedge</div>
            <p className="mt-0.5 text-[10px] leading-snug text-white/70">
              <span className="font-medium text-white/85">Both backed by {rivalry.sharedBackers.slice(0, 3).join(", ")}</span>
              {" "}— Amazon & Google anchor Anthropic; SoftBank & Microsoft anchor OpenAI. Same giants, opposite bets.
            </p>
          </GlassCard>
        </div>
      </div>

      <div className={`grid grid-cols-3 gap-2 ${enter(2)}`}>
        {FRONTIER_INSIGHT_SIGNALS.map((item) => (
          <GlassCard
            key={item.title}
            className="p-2"
            borderTop={
              item.variant === "amber" ? SLIDE.amber : item.variant === "gold" ? SLIDE.amber : SLIDE.primary
            }
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

/** @deprecated Use Slide04_FrontierRivals */
export const Slide04_OpenAI = Slide04_FrontierRivals;
