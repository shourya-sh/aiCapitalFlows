"use client";

import { useCountUp } from "../hooks/useCountUp";
import { useSlideAnimation } from "../hooks/useSlideAnimation";
import { GlassCard, SourceNote } from "../shared/SlidePrimitives";
import { ENERGY_STATS } from "../utils/slideData";
import { SLIDE } from "../utils/slideTheme";

export function Slide07_EnergyParadox({ isActive }: { isActive: boolean }) {
  const { enter, enterStyle } = useSlideAnimation(isActive, 100);
  const { gauge2024, gauge2030, cards } = ENERGY_STATS;
  const animatedTwh = useCountUp(gauge2030, 2000, isActive, 0);
  const progress = Math.min(1, (animatedTwh - gauge2024) / (gauge2030 - gauge2024));
  const needleAngle = -180 + progress * 180;

  return (
    <div className="flex h-full flex-col gap-4 px-6 py-5">
      <div className={enter(0)} style={enterStyle(0)}>
        <h2 className="text-xl font-bold text-white sm:text-2xl">The Energy Paradox</h2>
        <p className="mt-1 text-sm text-white/50">AI is addicted to power</p>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-3 lg:grid-cols-[1fr_1.2fr]">
        <div className="grid grid-cols-2 gap-2">
          {cards.map((c, i) => {
            const warn = "warn" in c && c.warn;
            return (
            <GlassCard
              key={i}
              className={`p-3 ${enter(i + 1)}`}
              borderTop={warn ? SLIDE.amber : SLIDE.primary}
            >
              <div className="text-sm font-semibold leading-snug text-white/90">{c.label}</div>
              <div className="mt-1 text-[11px] text-white/45">{c.sub}</div>
            </GlassCard>
            );
          })}
        </div>

        <div className={`flex flex-col items-center justify-center ${enter(2)}`} style={enterStyle(2)}>
          <svg viewBox="0 0 200 120" className="w-full max-w-[280px]">
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#00d4ff"
              strokeWidth="12"
              strokeDasharray={`${progress * 251} 251`}
            />
            <g transform={`rotate(${needleAngle} 100 100)`}>
              <line x1="100" y1="100" x2="100" y2="35" stroke="#f5a623" strokeWidth="2" />
              <circle cx="100" cy="100" r="4" fill="#f5a623" />
            </g>
            <text x="100" y="115" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">
              {gauge2024} TWh → {Math.round(animatedTwh)} TWh
            </text>
            <text x="100" y="88" textAnchor="middle" fill="#00d4ff" fontSize="12" fontFamily="monospace">
              Datacenter electricity
            </text>
          </svg>
        </div>
      </div>

      <SourceNote>
        Ireland&apos;s data centers may consume 32% of the country&apos;s total electricity by 2026.
      </SourceNote>
    </div>
  );
}
