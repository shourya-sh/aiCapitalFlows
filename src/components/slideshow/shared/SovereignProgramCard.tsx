"use client";

import { EntityLogo } from "@/components/graph/entity-logo";
import { logoFor } from "@/lib/data/logos";
import type { SOVEREIGN_PROGRAMS } from "../utils/slideData";
import { SLIDE } from "../utils/slideTheme";

const PARTNER_COLOR = "#818cf8";

type Program = (typeof SOVEREIGN_PROGRAMS)[number];

export function SovereignProgramCard({
  program,
  highlighted,
  onHover,
}: {
  program: Program;
  highlighted: boolean;
  onHover: (id: string | null) => void;
}) {
  return (
    <div
      className="flex min-h-0 flex-col justify-between rounded-md border px-1 py-0.5 transition-colors duration-150 sm:px-1.5 sm:py-1"
      style={{
        borderColor: highlighted ? `${SLIDE.primary}55` : "rgba(255,255,255,0.08)",
        background: highlighted ? "rgba(0,212,255,0.07)" : "rgba(255,255,255,0.03)",
      }}
      onMouseEnter={() => onHover(program.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex min-w-0 items-center gap-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://flagcdn.com/w40/${program.countryCode}.png`}
          alt=""
          width={18}
          height={13}
          className="shrink-0 rounded-[2px] object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[9px] font-semibold leading-tight text-white/90">
            {program.country}
          </div>
          <div className="truncate text-[7px] text-white/40">
            {program.program} · {program.mechanism}
          </div>
        </div>
        <span className="shrink-0 font-mono text-[8px] font-bold tabular text-[#f5a623]">
          {program.commitment}
        </span>
      </div>

      <div className="mt-0.5 flex flex-wrap items-center gap-0.5">
        {program.partners.map((p) => {
          const logo = logoFor(p.entityId);
          return (
            <EntityLogo
              key={p.entityId}
              name={p.name}
              color={PARTNER_COLOR}
              primary={logo.primary}
              fallback={logo.fallback}
              size={15}
              className="shrink-0 ring-1 ring-white/10"
            />
          );
        })}
      </div>
    </div>
  );
}
