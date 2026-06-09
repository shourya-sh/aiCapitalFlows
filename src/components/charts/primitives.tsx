"use client";

import * as React from "react";
import { formatUsd } from "@/lib/utils";

/** Shared tooltip used across all Recharts visualizations. */
export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter = (v: number) => formatUsd(v),
  labelFormatter,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string; payload?: Record<string, unknown> }>;
  label?: string | number;
  valueFormatter?: (v: number) => string;
  labelFormatter?: (l: string | number) => string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="glass-strong rounded-xl px-3 py-2 text-xs shadow-2xl">
      {label !== undefined && (
        <div className="mb-1 font-medium text-foreground">
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted">
              {p.color && <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />}
              {p.name}
            </span>
            <span className="mono font-medium text-foreground tabular">
              {valueFormatter(Number(p.value ?? 0))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const AXIS_STYLE = {
  fontSize: 11,
  fill: "#5d6877",
};
export const GRID_COLOR = "rgba(255,255,255,0.05)";
