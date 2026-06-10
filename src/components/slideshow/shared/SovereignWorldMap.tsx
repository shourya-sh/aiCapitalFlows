"use client";

import { EntityLogo } from "@/components/graph/entity-logo";
import { logoFor } from "@/lib/data/logos";
import { useMemo } from "react";
import type { SOVEREIGN_PROGRAMS } from "../utils/slideData";
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  buildSovereignMapLayout,
  curvePath,
  toPct,
  type MapLayoutNode,
} from "../utils/sovereignMapLayout";
import { SLIDE } from "../utils/slideTheme";

const PARTNER_COLOR = "#818cf8";

const PROGRAM_COLORS: Record<string, string> = {
  us: SLIDE.primary,
  ae: "#f5a623",
  sa: "#34d399",
  cn: "#f87171",
  eu: "#8b5cf6",
  in: "#fb923c",
  jp: "#a78bfa",
  sg: "#38bdf8",
};

type Program = (typeof SOVEREIGN_PROGRAMS)[number];

function nodeById(nodes: MapLayoutNode[]) {
  return new Map(nodes.map((n) => [n.id, n]));
}

export function SovereignWorldMap({
  programs,
  highlightedId,
  onHighlight,
  className = "",
}: {
  programs: readonly Program[];
  highlightedId?: string | null;
  onHighlight?: (id: string | null) => void;
  className?: string;
}) {
  const layout = useMemo(() => buildSovereignMapLayout(programs), [programs]);
  const nodeMap = useMemo(() => nodeById(layout.nodes), [layout.nodes]);

  return (
    <div
      className={`relative h-full min-h-0 w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#06060c] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/maps/world.svg"
        alt=""
        className="absolute inset-0 h-full w-full object-contain opacity-[0.18] brightness-[0.55] contrast-[1.1] hue-rotate-[190deg] saturate-[0.35]"
      />

      {/* All capital-flow connections */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        {layout.edges.map((edge) => {
          const source = nodeMap.get(edge.sourceId);
          const target = nodeMap.get(edge.targetId);
          if (!source || !target) return null;
          const active = highlightedId == null || highlightedId === edge.programId;
          const color = PROGRAM_COLORS[edge.programId] ?? SLIDE.primary;
          return (
            <path
              key={edge.id}
              d={curvePath(source.x, source.y, target.x, target.y)}
              fill="none"
              stroke={color}
              strokeWidth={0.7 + edge.scale * 0.005}
              strokeOpacity={active ? (highlightedId ? 0.65 : 0.32) : 0.08}
            />
          );
        })}
      </svg>

      {/* Company nodes */}
      {layout.companies.map((node) => {
        const { leftPct, topPct } = toPct(node.x, node.y);
        const logo = logoFor(node.entityId!);
        const dimmed = highlightedId != null && !layout.edges.some(
          (e) => e.programId === highlightedId && e.targetId === node.id
        );
        const logoSize = Math.round(node.r * 1.9);

        return (
          <div
            key={node.id}
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
            style={{ left: `${leftPct}%`, top: `${topPct}%`, opacity: dimmed ? 0.25 : 1 }}
          >
            <div className="flex flex-col items-center gap-px">
              <div
                className="rounded-full ring-1 ring-white/15"
                style={{
                  width: logoSize,
                  height: logoSize,
                  boxShadow: `0 0 ${node.r}px rgba(129,140,248,0.25)`,
                }}
              >
                <EntityLogo
                  name={node.name}
                  color={PARTNER_COLOR}
                  primary={logo.primary}
                  fallback={logo.fallback}
                  size={logoSize}
                />
              </div>
              <span
                className="max-w-[48px] truncate rounded px-0.5 py-px text-center text-[5px] leading-tight text-white/50"
                style={{ background: "rgba(0,0,0,0.6)" }}
              >
                {node.name}
              </span>
            </div>
          </div>
        );
      })}

      {/* Country nodes */}
      {layout.countries.map((node) => {
        const programId = node.programId!;
        const { leftPct, topPct } = toPct(node.x, node.y);
        const isHighlighted = highlightedId === programId;
        const dimmed = highlightedId != null && !isHighlighted;
        const flagSize = Math.round(node.r * 1.2);
        const color = PROGRAM_COLORS[programId] ?? SLIDE.primary;

        return (
          <button
            key={node.id}
            type="button"
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
            style={{
              left: `${leftPct}%`,
              top: `${topPct}%`,
              opacity: dimmed ? 0.35 : 1,
            }}
            onMouseEnter={() => onHighlight?.(programId)}
            onMouseLeave={() => onHighlight?.(null)}
            onFocus={() => onHighlight?.(programId)}
            onBlur={() => onHighlight?.(null)}
            aria-label={`${node.name}: ${node.commitment}`}
          >
            <div className="flex flex-col items-center gap-px">
              <div
                className="flex items-center justify-center rounded-full border-2 shadow-lg"
                style={{
                  width: node.r * 2,
                  height: node.r * 2,
                  borderColor: isHighlighted ? color : `${color}88`,
                  background: isHighlighted ? `${color}22` : "rgba(10,10,15,0.92)",
                  boxShadow: isHighlighted ? `0 0 16px ${color}66` : `0 0 8px ${color}33`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://flagcdn.com/w80/${node.countryCode}.png`}
                  alt=""
                  width={flagSize}
                  height={Math.round(flagSize * 0.75)}
                  className="rounded-[2px] object-cover"
                />
              </div>
              <span
                className="rounded px-1 py-px font-mono text-[7px] font-bold tabular leading-none text-[#f5a623] sm:text-[8px]"
                style={{ background: "rgba(0,0,0,0.75)" }}
              >
                {node.commitment}
              </span>
            </div>
          </button>
        );
      })}

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-1.5 left-2 flex flex-wrap gap-x-2 gap-y-0.5 rounded bg-black/55 px-2 py-1">
        <span className="text-[7px] text-white/45">Node size ∝ commitment</span>
        <span className="text-[7px] text-white/30">·</span>
        <span className="text-[7px] text-white/45">Lines = sovereign → partner HQ</span>
      </div>
    </div>
  );
}
