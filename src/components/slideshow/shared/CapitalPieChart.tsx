"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatUsd } from "@/lib/utils";

export interface PieSlice {
  label: string;
  value: number;
  share: number;
  color: string;
}

export function CapitalPieChart({
  data,
  active,
  totalLabel,
}: {
  data: PieSlice[];
  active: boolean;
  totalLabel?: string;
}) {
  const chartData = data.map((d) => ({
    name: d.label,
    value: d.share * 100,
    amount: d.value,
    color: d.color,
  }));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {totalLabel && (
        <div className="mb-1 text-center font-mono text-xs tabular text-white/45">{totalLabel}</div>
      )}
      <div className="min-h-[140px] flex-1 sm:min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="42%"
              outerRadius="72%"
              paddingAngle={1.5}
              stroke="transparent"
              isAnimationActive={active}
              animationDuration={700}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active: hover, payload }) => {
                if (!hover || !payload?.[0]) return null;
                const d = payload[0].payload as (typeof chartData)[number];
                return (
                  <div className="rounded-lg border border-white/10 bg-[#0a0f18] px-3 py-2 text-xs shadow-xl">
                    <div className="font-medium text-white">{d.name}</div>
                    <div className="mt-1 font-mono tabular text-white/80">
                      {d.value.toFixed(1)}% · {formatUsd(d.amount)}
                    </div>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-1 max-h-[120px] space-y-0.5 overflow-y-auto pr-0.5 sm:max-h-none">
        {data.map((d) => (
          <div key={d.label} className="flex items-center justify-between gap-2 text-[10px] sm:text-[11px]">
            <span className="flex min-w-0 items-center gap-1.5 text-white/70">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: d.color }} />
              <span className="truncate">{d.label}</span>
            </span>
            <span className="shrink-0 font-mono tabular text-white/45">
              {(d.share * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
