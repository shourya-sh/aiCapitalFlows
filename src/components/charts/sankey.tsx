"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  sankey,
  sankeyLinkHorizontal,
  sankeyJustify,
  type SankeyGraph as D3SankeyGraph,
} from "d3-sankey";
import type { SankeyGraph } from "@/lib/metrics/sankey";
import { formatUsd } from "@/lib/utils";

interface NodeDatum {
  name: string;
  color: string;
}
interface LinkDatum {
  source: number;
  target: number;
  value: number;
}

export function CapitalSankey({ graph }: { graph: SankeyGraph }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(900);
  const height = 560;
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new ResizeObserver((entries) => {
      for (const e of entries) setWidth(Math.max(360, e.contentRect.width));
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const layout = useMemo(() => {
    const sankeyGen = sankey<NodeDatum, LinkDatum>()
      .nodeWidth(15)
      .nodePadding(16)
      .nodeAlign(sankeyJustify)
      .extent([
        [4, 12],
        [width - 4, height - 12],
      ]);
    const g: D3SankeyGraph<NodeDatum, LinkDatum> = sankeyGen({
      nodes: graph.nodes.map((d) => ({ ...d })),
      links: graph.links.map((d) => ({ ...d })),
    });
    return g;
  }, [graph, width]);

  const linkPath = sankeyLinkHorizontal<NodeDatum, LinkDatum>();

  return (
    <div ref={ref} className="w-full">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          {layout.links.map((link, i) => {
            const s = link.source as unknown as NodeDatum & { x1: number };
            const t = link.target as unknown as NodeDatum & { x0: number };
            return (
              <linearGradient
                key={i}
                id={`sankey-grad-${i}`}
                gradientUnits="userSpaceOnUse"
                x1={s.x1}
                x2={t.x0}
              >
                <stop offset="0%" stopColor={s.color} stopOpacity={0.85} />
                <stop offset="100%" stopColor={t.color} stopOpacity={0.85} />
              </linearGradient>
            );
          })}
        </defs>

        {/* Links */}
        <g fill="none">
          {layout.links.map((link, i) => {
            const sIdx = (link.source as unknown as { index: number }).index;
            const tIdx = (link.target as unknown as { index: number }).index;
            const active = hover === null || hover === sIdx || hover === tIdx;
            return (
              <path
                key={i}
                d={linkPath(link) ?? undefined}
                stroke={`url(#sankey-grad-${i})`}
                strokeWidth={Math.max(1, link.width ?? 1)}
                strokeOpacity={active ? 0.55 : 0.12}
                className="transition-[stroke-opacity] duration-300"
                style={{
                  strokeDasharray: "8 10",
                  animation: active ? "flow-dash 8s linear infinite" : undefined,
                }}
              >
                <title>
                  {`${(link.source as unknown as NodeDatum).name} → ${(link.target as unknown as NodeDatum).name}: ${formatUsd(link.value)}`}
                </title>
              </path>
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {layout.nodes.map((node, i) => {
            const n = node as NodeDatum & {
              x0: number;
              x1: number;
              y0: number;
              y1: number;
              value: number;
              index: number;
            };
            const h = n.y1 - n.y0;
            const labelRight = n.x0 < width / 2;
            return (
              <g
                key={i}
                onMouseEnter={() => setHover(n.index)}
                onMouseLeave={() => setHover(null)}
                className="cursor-default"
              >
                <rect
                  x={n.x0}
                  y={n.y0}
                  width={n.x1 - n.x0}
                  height={Math.max(1, h)}
                  fill={n.color}
                  rx={3}
                  style={{ filter: `drop-shadow(0 0 8px ${n.color}66)` }}
                />
                <text
                  x={labelRight ? n.x1 + 8 : n.x0 - 8}
                  y={(n.y0 + n.y1) / 2}
                  dy="0.35em"
                  textAnchor={labelRight ? "start" : "end"}
                  className="fill-foreground text-[11px] font-medium"
                  style={{ pointerEvents: "none" }}
                >
                  {n.name}
                </text>
                <text
                  x={labelRight ? n.x1 + 8 : n.x0 - 8}
                  y={(n.y0 + n.y1) / 2 + 13}
                  textAnchor={labelRight ? "start" : "end"}
                  className="fill-[var(--muted-2)] text-[10px]"
                  style={{ pointerEvents: "none", fontVariantNumeric: "tabular-nums" }}
                >
                  {formatUsd(n.value)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
