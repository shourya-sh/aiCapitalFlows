import { dataset, entityById } from "../data";
import { sectorLabel } from "../sectors";
import { formatUsd } from "../utils";
import {
  energySpending,
  foundationModelConcentration,
  infrastructureSpending,
  investorConcentration,
  investorInfluence,
  sectorMomentum,
  topEntitiesByFunding,
} from "./analytics";
import type { Sector } from "../types";

/**
 * Automatic trend detection + insight generation. Powers the "What's Hot"
 * panel and the landing-page highlights. Everything is derived — no hardcoded
 * narratives — so insights update automatically as the dataset changes.
 */

export type InsightKind =
  | "fastest-sector"
  | "largest-round"
  | "top-investor"
  | "emerging-category"
  | "infra-bottleneck"
  | "energy-bottleneck"
  | "concentration"
  | "government";

export interface Insight {
  kind: InsightKind;
  title: string;
  headline: string;
  detail: string;
  /** Optional metric value for compact display. */
  metric?: string;
  sector?: Sector;
  entityId?: string;
  /** Signed change for trend chips. */
  change?: number;
}

const { flows, rounds } = dataset;

export function whatsHot(): Insight[] {
  const insights: Insight[] = [];

  // 1) Fastest-growing sector (momentum).
  const momentum = sectorMomentum();
  const fastest = momentum.find((m) => m.recent > 0) ?? momentum[0];
  if (fastest) {
    insights.push({
      kind: "fastest-sector",
      title: "Fastest-Growing Sector",
      headline: fastest.label,
      detail: `${formatUsd(fastest.recent)} deployed in the last 6 months, up from ${formatUsd(fastest.prior)} in the prior period.`,
      metric: `${fastest.momentum >= 0 ? "+" : ""}${(fastest.momentum * 100).toFixed(0)}%`,
      sector: fastest.sector,
      change: fastest.momentum,
    });
  }

  // 2) Largest funding round.
  const largest = rounds.reduce<typeof rounds[number] | null>(
    (max, r) => (!max || r.amountUsd > max.amountUsd ? r : max),
    null
  );
  if (largest) {
    const company = entityById.get(largest.targetId);
    const lead = largest.leadInvestorId ? entityById.get(largest.leadInvestorId) : undefined;
    insights.push({
      kind: "largest-round",
      title: "Largest Funding Round",
      headline: company?.name ?? largest.targetId,
      detail: `${largest.roundType} round${lead ? ` led by ${lead.name}` : ""} closing at ${formatUsd(largest.amountUsd)}.`,
      metric: formatUsd(largest.amountUsd),
      entityId: company?.id,
      sector: company?.sector,
    });
  }

  // 3) Most influential investor (graph centrality).
  const influence = investorInfluence(1)[0];
  if (influence) {
    insights.push({
      kind: "top-investor",
      title: "Most Influential Investor",
      headline: influence.name,
      detail: `${formatUsd(influence.deployed)} deployed across ${influence.portfolioCount} entities, reaching ${formatUsd(influence.reachedValuation)} in portfolio value.`,
      metric: `${(influence.centrality * 100).toFixed(0)} centrality`,
      entityId: influence.id,
    });
  }

  // 4) Emerging category: highest momentum among smaller sectors.
  const emerging = [...momentum]
    .filter((m) => m.prior < m.recent && m.recent > 0)
    .sort((a, b) => b.momentum - a.momentum)
    .find((m) => m.sector === "agent-infra" || m.sector === "robotics" || m.sector === "energy") ?? momentum[1];
  if (emerging) {
    insights.push({
      kind: "emerging-category",
      title: "Emerging Category",
      headline: emerging.label,
      detail: `New capital clusters forming as ${emerging.label.toLowerCase()} attracts accelerating investment.`,
      metric: `${emerging.momentum >= 0 ? "+" : ""}${(emerging.momentum * 100).toFixed(0)}%`,
      sector: emerging.sector,
      change: emerging.momentum,
    });
  }

  // 5) Infrastructure bottleneck.
  const infra = infrastructureSpending();
  insights.push({
    kind: "infra-bottleneck",
    title: "Infrastructure Bottleneck",
    headline: "Compute Supply",
    detail: `${formatUsd(infra)} in compute & accelerator commitments signal tightening GPU and datacenter capacity.`,
    metric: formatUsd(infra),
    sector: "compute",
  });

  // 6) Energy bottleneck.
  const energy = energySpending();
  insights.push({
    kind: "energy-bottleneck",
    title: "Energy Bottleneck",
    headline: "Power Constraints",
    detail: `${formatUsd(energy)} in long-term power contracts as datacenters race to secure baseload electricity.`,
    metric: formatUsd(energy),
    sector: "energy",
  });

  // 7) Capital concentration.
  const hhi = foundationModelConcentration();
  insights.push({
    kind: "concentration",
    title: "Capital Concentration",
    headline: hhi.level,
    detail: `Foundation-model funding HHI of ${hhi.index.toFixed(0)} — ${hhi.shares[0]?.name ?? "the leader"} holds ${(hhi.shares[0]?.share * 100).toFixed(0)}% of sector capital.`,
    metric: hhi.index.toFixed(0),
    sector: "foundation-model",
  });

  return insights;
}

// ───────── richer trend feed (for analytics / insights page) ─────────

export interface TrendSignal {
  label: string;
  value: string;
  description: string;
  tone: "positive" | "negative" | "neutral";
}

export function trendSignals(): TrendSignal[] {
  const signals: TrendSignal[] = [];
  const momentum = sectorMomentum();

  for (const m of momentum.slice(0, 3)) {
    signals.push({
      label: `${m.label} momentum`,
      value: `${m.momentum >= 0 ? "+" : ""}${(m.momentum * 100).toFixed(0)}%`,
      description: `${formatUsd(m.recent)} in trailing 6-month capital inflow.`,
      tone: m.momentum > 0.05 ? "positive" : m.momentum < -0.05 ? "negative" : "neutral",
    });
  }

  const losing = [...momentum].reverse().find((m) => m.momentum < 0);
  if (losing) {
    signals.push({
      label: `${losing.label} cooling`,
      value: `${(losing.momentum * 100).toFixed(0)}%`,
      description: `Capital inflow into ${losing.label.toLowerCase()} is decelerating.`,
      tone: "negative",
    });
  }

  const invHHI = investorConcentration();
  signals.push({
    label: "Investor concentration",
    value: invHHI.index.toFixed(0),
    description: `${invHHI.level.toLowerCase()} — top allocators command an outsized share of deployment.`,
    tone: invHHI.index > 2500 ? "negative" : "neutral",
  });

  return signals;
}

/** Detects newly-formed strategic partnerships (non-equity strategic flows). */
export function strategicPartnerships(limit = 6) {
  return flows
    .filter((f) => f.type === "partnership" || f.type === "compute-deal")
    .sort((a, b) => b.amountUsd - a.amountUsd)
    .slice(0, limit)
    .map((f) => ({
      id: f.id,
      source: entityById.get(f.sourceId)?.name ?? f.sourceId,
      target: entityById.get(f.targetId)?.name ?? f.targetId,
      amount: f.amountUsd,
      type: f.type,
      date: f.date,
    }));
}

export function topMovers(limit = 5) {
  return topEntitiesByFunding(limit).map((e) => ({
    id: e.id,
    name: e.name,
    sector: e.sector,
    sectorLabel: sectorLabel(e.sector),
    funding: e.totalFundingUsd,
    valuation: e.latestValuationUsd ?? e.marketCapUsd,
  }));
}
