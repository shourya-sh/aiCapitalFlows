"use client";

import { useSlideAnimation } from "../hooks/useSlideAnimation";
import { ACCENT_BORDER, SHOCK_FACTS } from "../utils/slideData";

export function Slide05_ShockFacts({ isActive }: { isActive: boolean }) {
  const { visible, enter } = useSlideAnimation(isActive, 100);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto px-6 py-6">
      <div className={enter(0)}>
        <h2 className="text-2xl font-bold text-white sm:text-3xl">13 Facts That Reveal How Extreme This Is</h2>
        <p className="mt-1 text-sm text-white/50">The numbers that stop conversations</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SHOCK_FACTS.map((fact, i) => {
          const wide = "wide" in fact && fact.wide;
          return (
          <div
            key={i}
            className={`rounded-lg border backdrop-blur-md p-4 transition-all duration-500 ease-out sm:col-span-1 ${
              wide ? "sm:col-span-2 lg:col-span-2" : ""
            } ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} ${enter(i + 1)}`}
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.08)",
              borderTopWidth: 3,
              borderTopColor: ACCENT_BORDER[fact.accent] ?? "#00d4ff",
              transitionDelay: `${i * 100}ms`,
            }}
          >
            <p className="text-sm leading-relaxed text-white/85">{fact.text}</p>
          </div>
          );
        })}
      </div>
    </div>
  );
}
