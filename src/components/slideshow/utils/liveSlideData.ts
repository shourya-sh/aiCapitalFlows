import { verificationStats } from "@/lib/data";
import { fundingBySector, headlineStats } from "@/lib/metrics/analytics";
import type { Sector } from "@/lib/types";

/** Sectors shown on the capital map slide (excludes pure capital allocators). */
const MAP_SECTORS: Sector[] = [
  "compute",
  "foundation-model",
  "big-tech",
  "infrastructure",
  "energy",
  "government",
  "robotics",
  "enterprise-ai",
  "agent-infra",
];

export interface CategoryRow {
  label: string;
  value: number;
  share: number;
  color: string;
}

export interface LiveSlideMetrics {
  totalCapital: number;
  entityCount: number;
  flowCount: number;
  roundCount: number;
  verifiedPct: number;
  categories: CategoryRow[];
}

export function getLiveSlideMetrics(): LiveSlideMetrics {
  const stats = headlineStats();
  const verification = verificationStats();
  const sectors = fundingBySector();

  const mapRows = MAP_SECTORS.map((id) => {
    const row = sectors.find((s) => s.sector === id);
    return {
      label: row?.label ?? id,
      value: row?.totalFunding ?? 0,
      color: row?.color ?? "#00d4ff",
    };
  });

  const total = mapRows.reduce((s, r) => s + r.value, 0) || 1;

  return {
    totalCapital: stats.totalCapital,
    entityCount: stats.entityCount,
    flowCount: stats.flowCount,
    roundCount: stats.roundCount,
    verifiedPct: verification.pct,
    categories: mapRows
      .map((r) => ({ ...r, share: r.value / total }))
      .sort((a, b) => b.value - a.value),
  };
}
