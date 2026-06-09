"use client";

import { useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

interface EntityNodeData {
  label: string;
  color: string;
  size: number;
  logo?: string;
  logoFallback?: string;
  dim?: boolean;
  highlight?: boolean;
  selected?: boolean;
  [key: string]: unknown;
}

function Logo({ data }: { data: EntityNodeData }) {
  const sources = [data.logo, data.logoFallback].filter(Boolean) as string[];
  const [idx, setIdx] = useState(0);
  const src = sources[idx];

  if (!src) {
    // Initials fallback.
    return (
      <span
        className="grid h-full w-full place-items-center rounded-full font-semibold"
        style={{
          background: `${data.color}22`,
          color: data.color,
          fontSize: Math.max(10, data.size * 0.28),
        }}
      >
        {data.label.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <span className="grid h-full w-full place-items-center overflow-hidden rounded-full bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={data.label}
        className="h-[72%] w-[72%] object-contain"
        loading="lazy"
        draggable={false}
        onError={() => setIdx((i) => i + 1)}
      />
    </span>
  );
}

export function EntityNode({ data }: NodeProps) {
  const d = data as EntityNodeData;
  const { label, color, size, dim, highlight, selected } = d;
  const fontScale = size > 90 ? 13 : size > 60 ? 12 : 11;
  const ring = Math.max(2, size * 0.045);

  return (
    <div
      className="group relative flex items-center justify-center transition-opacity duration-300"
      style={{ width: size, height: size, opacity: dim ? 0.1 : 1 }}
    >
      <Handle type="target" position={Position.Top} className="!h-1 !w-1 !min-w-0 !border-0 !bg-transparent !opacity-0" />
      <Handle type="source" position={Position.Bottom} className="!h-1 !w-1 !min-w-0 !border-0 !bg-transparent !opacity-0" />

      {/* glow / ring */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-300"
        style={{
          padding: ring,
          background: color,
          boxShadow:
            highlight || selected
              ? `0 0 0 ${ring}px ${color}, 0 0 34px ${color}cc`
              : `0 0 16px ${color}55`,
        }}
      >
        <div className="h-full w-full overflow-hidden rounded-full">
          <Logo data={d} />
        </div>
      </div>

      <span
        className="pointer-events-none absolute left-1/2 top-[104%] -translate-x-1/2 whitespace-nowrap text-center font-medium text-foreground"
        style={{
          fontSize: fontScale,
          textShadow: "0 1px 5px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,0.9)",
          opacity: dim ? 0 : selected || highlight || size > 70 ? 1 : 0.82,
        }}
      >
        {label}
      </span>
    </div>
  );
}
