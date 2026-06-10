"use client";

import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Cloud,
  Flame,
  Landmark,
  Network,
  PieChart,
  Repeat2,
  Rocket,
  Shield,
  TrendingDown,
  Users,
  Zap,
} from "lucide-react";
import { useSlideAnimation } from "../hooks/useSlideAnimation";
import { GlassCard } from "../shared/SlidePrimitives";
import { ACCENT_BORDER, SHOCK_FACTS } from "../utils/slideData";
import { SLIDE } from "../utils/slideTheme";

const ICONS: Record<(typeof SHOCK_FACTS)[number]["icon"], LucideIcon> = {
  "trending-down": TrendingDown,
  landmark: Landmark,
  repeat: Repeat2,
  zap: Zap,
  shield: Shield,
  network: Network,
  "alert-triangle": AlertTriangle,
  rocket: Rocket,
  cloud: Cloud,
  "pie-chart": PieChart,
  users: Users,
  flame: Flame,
};

type ShockFact = (typeof SHOCK_FACTS)[number];

function isDoubleFact(fact: ShockFact): fact is ShockFact & {
  double: true;
  stats: readonly { value: string; label: string; tone: "primary" | "amber" }[];
  bullets: readonly string[];
} {
  return "double" in fact && fact.double === true;
}

function isStandardFact(fact: ShockFact): fact is ShockFact & {
  stat: string;
  statSub: string;
  detail: string;
} {
  return "stat" in fact && "statSub" in fact && "detail" in fact;
}

function CategoryHeader({ accent, Icon, category }: { accent: string; Icon: LucideIcon; category: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
        style={{ background: `${accent}18`, color: accent }}
      >
        <Icon size={16} strokeWidth={2.25} />
      </div>
      <span
        className="min-w-0 truncate text-[10px] font-semibold uppercase tracking-wide md:text-[11px]"
        style={{ color: `${accent}cc` }}
      >
        {category}
      </span>
    </div>
  );
}

function FactCard({
  fact,
  accent,
  Icon,
  className = "",
}: {
  fact: ShockFact;
  accent: string;
  Icon: LucideIcon;
  className?: string;
}) {
  if (isDoubleFact(fact)) {
    return (
      <GlassCard
        borderTop={accent}
        className={`flex h-full min-h-0 flex-col gap-1.5 overflow-hidden p-2 md:flex-row md:gap-2.5 md:p-2.5 ${className}`}
      >
        <div className="flex min-h-0 min-w-0 shrink-0 flex-col md:w-[36%]">
          <CategoryHeader accent={accent} Icon={Icon} category={fact.category} />
          <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-snug text-white md:text-xs">
            {fact.headline}
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {fact.stats.map((stat) => (
              <div
                key={stat.label}
                className="max-w-full rounded-md px-1.5 py-0.5"
                style={{
                  background: stat.tone === "amber" ? "rgba(245,166,35,0.1)" : "rgba(0,212,255,0.1)",
                }}
              >
                <span
                  className="font-mono text-sm font-bold tabular md:text-base"
                  style={{ color: stat.tone === "amber" ? SLIDE.amber : SLIDE.primary }}
                >
                  {stat.value}
                </span>{" "}
                <span className="text-[9px] leading-tight text-white/70 md:text-[10px]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <ul className="grid min-h-0 flex-1 grid-cols-1 gap-1 overflow-hidden md:grid-cols-2 md:gap-x-2">
          {fact.bullets.map((bullet) => (
            <li key={bullet} className="flex min-w-0 gap-1 text-[9px] leading-snug text-white/60 md:text-[10px]">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full" style={{ background: accent }} />
              <span className="min-w-0 break-words line-clamp-4">{bullet}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    );
  }

  if (isStandardFact(fact)) {
    return (
      <GlassCard
        borderTop={accent}
        className={`flex h-full min-h-0 flex-col overflow-hidden p-2 md:p-2.5 ${className}`}
      >
        <CategoryHeader accent={accent} Icon={Icon} category={fact.category} />

        <div className="mt-1.5 min-w-0 shrink-0 overflow-hidden">
          <div
            className="truncate font-mono text-base font-bold leading-none tabular md:text-lg"
            style={{ color: accent }}
          >
            {fact.stat}
          </div>
          <div className="mt-0.5 truncate text-[10px] font-medium text-white/55 md:text-[11px]">{fact.statSub}</div>
        </div>

        <p className="mt-1.5 min-h-0 flex-1 overflow-hidden break-words text-[10px] leading-snug text-white/65 line-clamp-3 md:text-[11px]">
          {fact.detail}
        </p>
      </GlassCard>
    );
  }

  return null;
}

export function Slide05_ShockFacts({ isActive }: { isActive: boolean }) {
  const { visible, enter } = useSlideAnimation(isActive, 60);

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-2 overflow-hidden px-5 py-3 sm:px-6">
      <div className={`shrink-0 ${enter(0)}`}>
        <h2 className="text-lg font-bold leading-tight text-white sm:text-xl">
          13 Facts That Reveal How Extreme This Is
        </h2>
        <p className="text-xs text-white/50">Market shocks, circular deals, and numbers that stop conversations</p>
      </div>

      <div className="grid min-h-0 grid-cols-2 grid-rows-7 gap-1.5 overflow-hidden md:grid-cols-7 md:grid-rows-2">
        {SHOCK_FACTS.map((fact, i) => {
          const Icon = ICONS[fact.icon];
          const accent = ACCENT_BORDER[fact.accent] ?? SLIDE.primary;
          const isDouble = isDoubleFact(fact);

          return (
            <div
              key={isDoubleFact(fact) ? fact.headline : isStandardFact(fact) ? fact.stat : i}
              className={`min-h-0 overflow-hidden transition-all duration-500 ease-out ${
                isDouble ? "col-span-2" : ""
              } ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"} ${enter(i + 1)}`}
              style={{ transitionDelay: `${i * 35}ms` }}
            >
              <FactCard fact={fact} accent={accent} Icon={Icon} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
