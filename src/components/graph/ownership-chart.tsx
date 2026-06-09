"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  OWNER_CATEGORY_COLORS,
  OWNER_CATEGORY_LABELS,
} from "@/lib/data/verified/ownership";
import type { OwnershipSnapshot } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function OwnershipChart({ snapshot }: { snapshot: OwnershipSnapshot }) {
  const data = snapshot.stakes.map((s) => ({
    name: s.name,
    value: s.stakePct,
    category: s.category,
    color: OWNER_CATEGORY_COLORS[s.category] ?? "#64748b",
    entityId: s.entityId,
  }));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-[10px] text-muted-2">
        <span>As of {formatDate(snapshot.asOf)}</span>
        <span className="rounded-md bg-white/[0.04] px-2 py-0.5">Approximate stakes</span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={78}
            paddingAngle={1}
            stroke="transparent"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const d = payload[0].payload as (typeof data)[number];
              return (
                <div className="rounded-lg border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2 text-xs shadow-xl">
                  <div className="font-medium">{d.name}</div>
                  <div className="text-muted-2">{OWNER_CATEGORY_LABELS[d.category] ?? d.category}</div>
                  <div className="mono mt-1 font-semibold tabular">{d.value.toFixed(1)}%</div>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-2 space-y-1">
        {snapshot.stakes.map((s) => (
          <div key={s.name} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-white/[0.03]">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: OWNER_CATEGORY_COLORS[s.category] }}
              />
              <span className="min-w-0 truncate text-xs">{s.name}</span>
            </span>
            <span className="mono shrink-0 text-xs tabular text-muted">{s.stakePct.toFixed(1)}%</span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-muted-2">{snapshot.methodology}</p>
    </div>
  );
}
