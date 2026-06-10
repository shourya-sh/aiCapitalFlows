"use client";

import type { ReactNode } from "react";
import { SLIDE } from "../utils/slideTheme";

export function GlassCard({
  children,
  className = "",
  borderTop,
}: {
  children: ReactNode;
  className?: string;
  borderTop?: string;
}) {
  return (
    <div
      className={`rounded-lg border backdrop-blur-md ${className}`}
      style={{
        background: SLIDE.glass,
        borderColor: SLIDE.border,
        borderTopWidth: borderTop ? 3 : 1,
        borderTopColor: borderTop ?? SLIDE.border,
      }}
    >
      {children}
    </div>
  );
}

export function MonoStat({
  value,
  label,
  sub,
  color = SLIDE.primary,
  size = "lg",
}: {
  value: ReactNode;
  label: string;
  sub?: string;
  color?: string;
  size?: "sm" | "lg" | "hero";
}) {
  const sizes = { sm: "text-2xl", lg: "text-4xl", hero: "text-6xl sm:text-7xl" };
  return (
    <div>
      <div className={`font-mono font-bold tabular leading-none ${sizes[size]}`} style={{ color }}>
        {value}
      </div>
      <div className="mt-1 text-sm text-white/70">{label}</div>
      {sub && <div className="mt-0.5 text-xs text-white/40">{sub}</div>}
    </div>
  );
}

export function SourceNote({ children }: { children: ReactNode }) {
  return <p className="text-[10px] leading-snug text-white/30">{children}</p>;
}

export function InsightStrip({ children, variant = "neutral" }: { children: ReactNode; variant?: "neutral" | "amber" | "danger" | "gold" }) {
  const styles = {
    neutral: { bg: "rgba(0,212,255,0.08)", border: SLIDE.primary },
    amber: { bg: "rgba(245,166,35,0.1)", border: SLIDE.amber },
    danger: { bg: "rgba(255,77,79,0.1)", border: SLIDE.danger },
    gold: { bg: "rgba(245,166,35,0.15)", border: SLIDE.amber },
  }[variant];
  return (
    <div className="rounded-lg border-l-2 px-4 py-3 text-sm leading-relaxed text-white/80" style={{ background: styles.bg, borderColor: styles.border }}>
      {children}
    </div>
  );
}

export function PulseRipples({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" viewBox="0 0 400 400" aria-hidden>
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx="200"
          cy="200"
          r="40"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="1"
          opacity={0.4 - i * 0.1}
        >
          <animate attributeName="r" from="40" to="180" dur={`${3 + i}s`} repeatCount="indefinite" begin={`${i}s`} />
          <animate attributeName="opacity" from="0.5" to="0" dur={`${3 + i}s`} repeatCount="indefinite" begin={`${i}s`} />
        </circle>
      ))}
    </svg>
  );
}
