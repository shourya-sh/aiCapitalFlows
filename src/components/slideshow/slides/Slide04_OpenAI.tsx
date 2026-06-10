"use client";

import { useSlideAnimation } from "../hooks/useSlideAnimation";
import { GlassCard, InsightStrip, SourceNote } from "../shared/SlidePrimitives";
import { OPENAI_TIMELINE } from "../utils/slideData";
import { SLIDE } from "../utils/slideTheme";

const FINANCIAL_CARDS = [
  { color: SLIDE.positive, title: "$20B", sub: "Annualized revenue run rate (end of 2025)", detail: "Up from $2B in 2023. Revenue grew 10× in 2 years." },
  { color: SLIDE.danger, title: "$13.5B", sub: "Net loss in H1 2025 alone", detail: "" },
  { color: SLIDE.amber, title: "$14B", sub: "Projected loss in 2026", detail: "Against ~$13B in sales" },
  { color: SLIDE.danger, title: "2029–2030", sub: "Won't turn a profit until", detail: "Total losses 2023–2028 projected at $44B+" },
] as const;

export function Slide04_OpenAI({ isActive }: { isActive: boolean }) {
  const { enter } = useSlideAnimation(isActive, 120);

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto px-6 py-5 lg:flex-row lg:gap-6 lg:px-8">
      <div className={`lg:w-[38%] ${enter(0)}`}>
        <h2 className="text-xl font-bold text-white sm:text-2xl">OpenAI: The World&apos;s Most Expensive Bet</h2>
        <div className="relative mt-4 border-l border-white/10 pl-4">
          {OPENAI_TIMELINE.map((t, i) => {
            const highlight = "highlight" in t && t.highlight;
            const detail = "detail" in t ? t.detail : undefined;
            return (
            <div key={i} className={`relative pb-5 ${enter(i + 1)}`}>
              <div
                className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full"
                style={{ background: highlight ? SLIDE.danger : SLIDE.primary }}
              />
              <div className="font-mono text-xs text-white/40">{t.year}</div>
              <div className={`text-sm ${highlight ? "font-semibold text-white" : "text-white/80"}`}>{t.label}</div>
              {detail && (
                <div className="mt-1 text-xs leading-relaxed text-white/50">{detail}</div>
              )}
            </div>
            );
          })}
        </div>
      </div>

      <div className={`flex flex-1 flex-col gap-2 ${enter(2)}`}>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {FINANCIAL_CARDS.map((c, i) => (
            <GlassCard key={i} className="p-3" borderTop={c.color}>
              <div className="font-mono text-2xl font-bold tabular" style={{ color: c.color }}>
                {c.title}
              </div>
              <div className="text-xs text-white/70">{c.sub}</div>
              {c.detail && <div className="mt-1 text-[11px] text-white/45">{c.detail}</div>}
            </GlassCard>
          ))}
        </div>

        <div className="rounded-lg p-4" style={{ background: "rgba(255,77,79,0.12)", border: `1px solid ${SLIDE.danger}` }}>
          <p className="text-sm leading-relaxed text-white/85">
            <span className="font-semibold text-[#ff4d4f]">🚨 The brutal math:</span> OpenAI needs to grow from $20B to
            $280B+ annual revenue by 2030 — a 14× increase in 4 years — to justify its valuation. Netflix&apos;s entire
            2025 revenue was ~$40B.
          </p>
        </div>

        <SourceNote>
          There&apos;s a troubling loop: Amazon invested $50B in OpenAI, who spends much of it back on AWS. SoftBank
          invested in Stargate, whose proceeds partly flow back to partners. Investors are, in part, funding their own
          future revenues.
        </SourceNote>
      </div>
    </div>
  );
}
