"use client";

import { useSlideAnimation } from "../hooks/useSlideAnimation";
import { InsightStrip, SourceNote } from "../shared/SlidePrimitives";
import { SOVEREIGN_PINS } from "../utils/slideData";
import { SLIDE } from "../utils/slideTheme";

export function Slide08_SovereignAI({ isActive }: { isActive: boolean }) {
  const { visible, enter } = useSlideAnimation(isActive, 120);

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto px-6 py-5 lg:flex-row lg:gap-6">
      <div className={`relative min-h-[220px] flex-1 lg:min-h-0 ${enter(0)}`}>
        <svg viewBox="0 0 100 60" className="h-full w-full rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
          {/* Simplified world silhouettes */}
          <ellipse cx="50" cy="30" rx="48" ry="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          {SOVEREIGN_PINS.map((pin, i) => (
            <g key={i}>
              {visible && (
                <circle cx={pin.x} cy={pin.y} r="3" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.6">
                  <animate attributeName="r" from="2" to="6" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                  <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                </circle>
              )}
              <circle cx={pin.x} cy={pin.y} r="1.5" fill="#00d4ff" />
              <text x={pin.x} y={pin.y - 3} textAnchor="middle" fontSize="3">
                {pin.flag}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className={`flex w-full flex-col gap-3 lg:w-[48%] ${enter(1)}`}>
        <h2 className="text-xl font-bold text-white">Sovereign AI</h2>
        <p className="text-sm text-white/50">Governments treating AI infrastructure like strategic assets</p>

        <div className="space-y-2">
          {SOVEREIGN_PINS.map((pin, i) => (
            <div key={i} className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-2.5">
              <div className="text-sm font-medium text-white/90">
                {pin.flag} {pin.title}
              </div>
              <div className="text-xs text-white/50">{pin.detail}</div>
            </div>
          ))}
        </div>

        <p className="text-sm leading-relaxed text-white/70">
          Gulf sovereign wealth funds hold $4T+ in AUM. AI is the explicit successor to oil as wealth-generating
          technology. &ldquo;Compute is the new oil&rdquo; is national strategy — not metaphor.
        </p>

        <InsightStrip variant="gold">
          🌍 Saudi Arabia&apos;s Crown Prince pledged $1T in US tech investment — single-country, single pledge. The
          Marshall Plan (inflation-adjusted) was ~$160B.
        </InsightStrip>
      </div>
    </div>
  );
}
