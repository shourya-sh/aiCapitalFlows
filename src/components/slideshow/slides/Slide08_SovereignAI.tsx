"use client";

import { useState } from "react";
import { useSlideAnimation } from "../hooks/useSlideAnimation";
import { SovereignProgramCard } from "../shared/SovereignProgramCard";
import { SovereignWorldMap } from "../shared/SovereignWorldMap";
import { SOVEREIGN_PROGRAMS } from "../utils/slideData";

export function Slide08_SovereignAI({ isActive }: { isActive: boolean }) {
  const { enter } = useSlideAnimation(isActive, 120);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  return (
    <div className="grid h-full grid-rows-[auto_minmax(0,1fr)] gap-1 overflow-hidden px-4 py-2 sm:px-6 sm:py-2.5">
      <div className={`shrink-0 ${enter(0)}`}>
        <h2 className="text-base font-bold leading-tight text-white sm:text-lg">Sovereign AI</h2>
        <p className="text-[10px] leading-snug text-white/50 sm:text-[11px]">
          Map shows every program and partner — node size reflects commitment. Hover a country on the map or
          in the panel to highlight its capital flows.
        </p>
      </div>

      <div
        className={`grid min-h-0 grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-1.5 overflow-hidden sm:gap-2 ${enter(1)}`}
      >
        <SovereignWorldMap
          programs={SOVEREIGN_PROGRAMS}
          highlightedId={highlightedId}
          onHighlight={setHighlightedId}
        />

        <div className="grid min-h-0 grid-cols-2 grid-rows-4 gap-1 overflow-hidden">
          {SOVEREIGN_PROGRAMS.map((p) => (
            <SovereignProgramCard
              key={p.id}
              program={p}
              highlighted={highlightedId === p.id}
              onHover={setHighlightedId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
