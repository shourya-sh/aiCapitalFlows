"use client";

import { ViewportPortal } from "@xyflow/react";
import { SECTOR_CLUSTERS } from "@/lib/metrics/graph-layout";
import { SECTOR_LIST } from "@/lib/sectors";

/** Vertical offset above cluster center for the sector title. */
const LABEL_OFFSET_Y: Partial<Record<keyof typeof SECTOR_CLUSTERS, number>> = {
  investor: 320,
  government: 200,
  "big-tech": 220,
  "foundation-model": 200,
  "enterprise-ai": 200,
  "agent-infra": 200,
  infrastructure: 200,
  compute: 200,
  energy: 180,
  robotics: 200,
};

export function ClusterLabels() {
  return (
    <ViewportPortal>
      <div className="pointer-events-none">
        {SECTOR_LIST.map((s) => {
          const cfg = SECTOR_CLUSTERS[s.id];
          const offset = LABEL_OFFSET_Y[s.id] ?? 200;
          return (
            <div
              key={s.id}
              className="absolute whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] opacity-[0.22]"
              style={{
                left: cfg.x,
                top: cfg.y - offset,
                transform: "translate(-50%, -50%)",
                color: s.color,
              }}
            >
              {s.label}
            </div>
          );
        })}
      </div>
    </ViewportPortal>
  );
}
