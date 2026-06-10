import type { ObservatoryDataset } from "../types";
import { dataset as staticDataset } from "../data";
import { computeGraphLayout } from "./graph-layout";
import type { GraphEdge, GraphNode } from "./graph";
import { SECTORS, sectorLabel } from "../sectors";
import type { Sector } from "../types";
import { formatUsd } from "../utils";
import type { HeadlineStats } from "./analytics";
import type { Insight } from "./insights";

export interface DashboardData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats: HeadlineStats;
  insights: Insight[];
  sectorBars: { label: string; value: number; color: string }[];
  momentum: { label: string; momentum: number; color: string }[];
  verification: { verified: number; total: number; pct: number };
  generatedAt: string;
}

const INVESTMENT_TYPES = new Set(["investment", "grant", "partnership"]);

function entityMap(ds: ObservatoryDataset) {
  return new Map(ds.entities.map((e) => [e.id, e]));
}

export function verificationStatsFor(ds: ObservatoryDataset): { verified: number; total: number; pct: number } {
  const verified = ds.flows.filter((f) => f.verified).length;
  return {
    verified,
    total: ds.flows.length,
    pct: ds.flows.length ? Math.round((verified / ds.flows.length) * 100) : 0,
  };
}

function headlineStatsFor(ds: ObservatoryDataset): HeadlineStats {
  const byId = entityMap(ds);
  const totalCapital = ds.flows
    .filter((f) => INVESTMENT_TYPES.has(f.type))
    .reduce((s, f) => s + f.amountUsd, 0);
  const largest = ds.rounds.reduce<(typeof ds.rounds)[number] | null>(
    (max, r) => (!max || r.amountUsd > max.amountUsd ? r : max),
    null
  );
  return {
    totalCapital,
    entityCount: ds.entities.length,
    flowCount: ds.flows.length,
    roundCount: ds.rounds.length,
    largestRound: largest
      ? { name: byId.get(largest.targetId)?.name ?? largest.targetId, amount: largest.amountUsd, date: largest.date }
      : null,
  };
}

function fundingBySectorFor(ds: ObservatoryDataset) {
  const map = new Map<Sector, { funding: number; count: number }>();
  for (const e of ds.entities) {
    if (e.sector === "investor" || e.sector === "government") continue;
    const cur = map.get(e.sector) ?? { funding: 0, count: 0 };
    cur.funding += e.totalFundingUsd || 0;
    cur.count += 1;
    map.set(e.sector, cur);
  }
  return [...map.entries()]
    .map(([sector, v]) => ({
      label: sectorLabel(sector),
      value: v.funding,
      color: SECTORS[sector].color,
    }))
    .sort((a, b) => b.value - a.value);
}

function sectorMomentumFor(ds: ObservatoryDataset, asOf = "2026-06-10") {
  const byId = entityMap(ds);
  const asOfTime = new Date(asOf).getTime();
  const sixMonths = 1000 * 60 * 60 * 24 * 182;
  const recentStart = asOfTime - sixMonths;
  const priorStart = asOfTime - 2 * sixMonths;
  const recent = new Map<Sector, number>();
  const prior = new Map<Sector, number>();

  for (const f of ds.flows) {
    if (!INVESTMENT_TYPES.has(f.type)) continue;
    const t = byId.get(f.targetId);
    if (!t || t.sector === "investor" || t.sector === "government") continue;
    const time = new Date(f.date).getTime();
    if (time >= recentStart && time <= asOfTime) {
      recent.set(t.sector, (recent.get(t.sector) ?? 0) + f.amountUsd);
    } else if (time >= priorStart && time < recentStart) {
      prior.set(t.sector, (prior.get(t.sector) ?? 0) + f.amountUsd);
    }
  }

  const sectors = new Set<Sector>([...recent.keys(), ...prior.keys()]);
  return [...sectors]
    .map((sector) => {
      const r = recent.get(sector) ?? 0;
      const p = prior.get(sector) ?? 0;
      const momentum = p > 0 ? (r - p) / p : r > 0 ? 1 : 0;
      return { label: sectorLabel(sector), momentum, color: SECTORS[sector].color };
    })
    .sort((a, b) => b.momentum - a.momentum);
}

function whatsHotFor(ds: ObservatoryDataset): Insight[] {
  const byId = entityMap(ds);
  const momentum = sectorMomentumFor(ds);
  const fastest = momentum.find((m) => m.momentum > 0) ?? momentum[0];
  const insights: Insight[] = [];

  if (fastest) {
    insights.push({
      kind: "fastest-sector",
      title: "Fastest-Growing Sector",
      headline: fastest.label,
      detail: `Capital inflow into ${fastest.label.toLowerCase()} is accelerating.`,
      metric: `${fastest.momentum >= 0 ? "+" : ""}${(fastest.momentum * 100).toFixed(0)}%`,
      change: fastest.momentum,
    });
  }

  const largest = ds.rounds.reduce<(typeof ds.rounds)[number] | null>(
    (max, r) => (!max || r.amountUsd > max.amountUsd ? r : max),
    null
  );
  if (largest) {
    const company = byId.get(largest.targetId);
    insights.push({
      kind: "largest-round",
      title: "Largest Funding Round",
      headline: company?.name ?? largest.targetId,
      detail: `${largest.roundType} round closing at ${formatUsd(largest.amountUsd)}.`,
      metric: formatUsd(largest.amountUsd),
      entityId: company?.id,
      sector: company?.sector,
    });
  }

  const largestFlow = [...ds.flows].sort((a, b) => b.amountUsd - a.amountUsd)[0];
  if (largestFlow) {
    insights.push({
      kind: "top-investor",
      title: "Largest Capital Flow",
      headline: `${byId.get(largestFlow.sourceId)?.name ?? largestFlow.sourceId} → ${byId.get(largestFlow.targetId)?.name ?? largestFlow.targetId}`,
      detail: largestFlow.summary ?? `${largestFlow.type} flow recorded ${largestFlow.date}.`,
      metric: formatUsd(largestFlow.amountUsd),
    });
  }

  const recentVerified = ds.flows
    .filter((f) => f.verified && new Date(f.date).getTime() > Date.now() - 1000 * 60 * 60 * 24 * 30)
    .sort((a, b) => b.amountUsd - a.amountUsd)[0];
  if (recentVerified) {
    insights.push({
      kind: "emerging-category",
      title: "Recent Verified Deal",
      headline: `${byId.get(recentVerified.sourceId)?.name ?? recentVerified.sourceId} → ${byId.get(recentVerified.targetId)?.name ?? recentVerified.targetId}`,
      detail: recentVerified.summary ?? "Newly ingested deal with source citations.",
      metric: formatUsd(recentVerified.amountUsd),
    });
  }

  return insights;
}

export function computeDashboardData(ds: ObservatoryDataset = staticDataset): DashboardData {
  const graph = computeGraphLayout(ds.entities, ds.flows);
  return {
    nodes: graph.nodes,
    edges: graph.edges,
    stats: headlineStatsFor(ds),
    insights: whatsHotFor(ds),
    sectorBars: fundingBySectorFor(ds),
    momentum: sectorMomentumFor(ds),
    verification: verificationStatsFor(ds),
    generatedAt: ds.generatedAt,
  };
}
