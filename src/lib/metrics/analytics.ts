import { dataset, entityById } from "../data";
import { SECTORS, sectorLabel } from "../sectors";
import type { CapitalFlow, Entity, Sector } from "../types";

/**
 * Analytics engine. Pure functions over the normalized dataset that power every
 * dashboard, metric, and insight in the app.
 */

const { entities, flows, rounds } = dataset;

const INVESTMENT_TYPES: CapitalFlow["type"][] = ["investment", "grant", "partnership"];

// ───────────────────────── aggregates ─────────────────────────

export interface SectorAgg {
  sector: Sector;
  label: string;
  color: string;
  totalFunding: number;
  entityCount: number;
  avgValuation: number;
}

export function fundingBySector(): SectorAgg[] {
  const map = new Map<Sector, { funding: number; count: number; val: number; valCount: number }>();
  for (const e of entities) {
    if (e.sector === "investor" || e.sector === "government") continue;
    const cur = map.get(e.sector) ?? { funding: 0, count: 0, val: 0, valCount: 0 };
    cur.funding += e.totalFundingUsd || 0;
    cur.count += 1;
    if (e.latestValuationUsd) {
      cur.val += e.latestValuationUsd;
      cur.valCount += 1;
    }
    map.set(e.sector, cur);
  }
  return [...map.entries()]
    .map(([sector, v]) => ({
      sector,
      label: sectorLabel(sector),
      color: SECTORS[sector].color,
      totalFunding: v.funding,
      entityCount: v.count,
      avgValuation: v.valCount ? v.val / v.valCount : 0,
    }))
    .sort((a, b) => b.totalFunding - a.totalFunding);
}

export interface GeoAgg {
  region: string;
  totalFunding: number;
  entityCount: number;
}

export function fundingByGeography(): GeoAgg[] {
  const map = new Map<string, { funding: number; count: number }>();
  for (const e of entities) {
    if (e.sector === "investor") continue;
    const cur = map.get(e.region) ?? { funding: 0, count: 0 };
    cur.funding += e.totalFundingUsd || 0;
    cur.count += 1;
    map.set(e.region, cur);
  }
  return [...map.entries()]
    .map(([region, v]) => ({ region, totalFunding: v.funding, entityCount: v.count }))
    .sort((a, b) => b.totalFunding - a.totalFunding);
}

export interface CountryAgg {
  country: string;
  totalFunding: number;
  entityCount: number;
}

export function fundingByCountry(limit = 10): CountryAgg[] {
  const map = new Map<string, { funding: number; count: number }>();
  for (const e of entities) {
    if (e.sector === "investor") continue;
    const cur = map.get(e.country) ?? { funding: 0, count: 0 };
    cur.funding += e.totalFundingUsd || 0;
    cur.count += 1;
    map.set(e.country, cur);
  }
  return [...map.entries()]
    .map(([country, v]) => ({ country, totalFunding: v.funding, entityCount: v.count }))
    .sort((a, b) => b.totalFunding - a.totalFunding)
    .slice(0, limit);
}

// ───────────────────────── concentration (HHI) ─────────────────────────

export interface HHIResult {
  /** Herfindahl-Hirschman Index in [0, 10000]. */
  index: number;
  /** Normalized 0..1 interpretation. */
  normalized: number;
  level: "Competitive" | "Moderately concentrated" | "Highly concentrated";
  shares: { id: string; name: string; share: number; value: number }[];
}

/**
 * Herfindahl-Hirschman Index over an arbitrary value distribution.
 * Sum of squared percentage market shares (0–10,000).
 */
export function herfindahl(items: { id: string; name: string; value: number }[]): HHIResult {
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  const shares = items
    .map((i) => ({ ...i, share: i.value / total }))
    .sort((a, b) => b.share - a.share);
  const index = shares.reduce((s, i) => s + Math.pow(i.share * 100, 2), 0);
  const level: HHIResult["level"] =
    index < 1500 ? "Competitive" : index < 2500 ? "Moderately concentrated" : "Highly concentrated";
  return { index, normalized: index / 10000, level, shares };
}

/** Concentration of capital across foundation-model companies (funding share). */
export function foundationModelConcentration(): HHIResult {
  const items = entities
    .filter((e) => e.sector === "foundation-model")
    .map((e) => ({ id: e.id, name: e.name, value: e.totalFundingUsd }));
  return herfindahl(items);
}

/** Concentration of capital deployment across investors. */
export function investorConcentration(): HHIResult {
  const deployed = deploymentByInvestor();
  return herfindahl(deployed.map((d) => ({ id: d.id, name: d.name, value: d.deployed })));
}

// ───────────────────────── investor influence / centrality ─────────────────────────

export interface InvestorInfluence {
  id: string;
  name: string;
  deployed: number;
  portfolioCount: number;
  centrality: number; // pagerank-based, 0..1 normalized to max
  reachedValuation: number;
}

function deploymentByInvestor(): { id: string; name: string; deployed: number }[] {
  const map = new Map<string, number>();
  for (const f of flows) {
    const src = entityById.get(f.sourceId);
    if (!src || (src.sector !== "investor" && src.sector !== "government")) continue;
    if (!INVESTMENT_TYPES.includes(f.type)) continue;
    map.set(f.sourceId, (map.get(f.sourceId) ?? 0) + f.amountUsd);
  }
  return [...map.entries()]
    .map(([id, deployed]) => ({ id, name: entityById.get(id)?.name ?? id, deployed }))
    .sort((a, b) => b.deployed - a.deployed);
}

/** PageRank over the directed capital-flow graph (amount-weighted). */
export function pageRank(damping = 0.85, iterations = 40): Map<string, number> {
  const ids = entities.map((e) => e.id);
  const n = ids.length;
  const idx = new Map(ids.map((id, i) => [id, i]));
  const outWeight = new Array(n).fill(0);
  const adj: { to: number; w: number }[][] = Array.from({ length: n }, () => []);

  for (const f of flows) {
    const s = idx.get(f.sourceId);
    const t = idx.get(f.targetId);
    if (s === undefined || t === undefined) continue;
    const w = Math.max(1, f.amountUsd);
    adj[s].push({ to: t, w });
    outWeight[s] += w;
  }

  let rank = new Array(n).fill(1 / n);
  for (let it = 0; it < iterations; it++) {
    const next = new Array(n).fill((1 - damping) / n);
    let dangling = 0;
    for (let i = 0; i < n; i++) {
      if (outWeight[i] === 0) dangling += rank[i];
    }
    for (let i = 0; i < n; i++) {
      if (outWeight[i] === 0) continue;
      for (const { to, w } of adj[i]) {
        next[to] += (damping * rank[i] * w) / outWeight[i];
      }
    }
    const danglingShare = (damping * dangling) / n;
    for (let i = 0; i < n; i++) next[i] += danglingShare;
    rank = next;
  }
  return new Map(ids.map((id, i) => [id, rank[i]]));
}

let _pagerankCache: Map<string, number> | null = null;
export function getPageRank(): Map<string, number> {
  if (!_pagerankCache) _pagerankCache = pageRank();
  return _pagerankCache;
}

export function investorInfluence(limit = 12): InvestorInfluence[] {
  const pr = getPageRank();
  const maxPr = Math.max(...[...pr.values()]);
  const deployment = new Map(deploymentByInvestor().map((d) => [d.id, d.deployed]));

  const result: InvestorInfluence[] = entities
    .filter((e) => e.sector === "investor" || e.sector === "government")
    .map((inv) => {
      const portfolio = new Set(
        flows.filter((f) => f.sourceId === inv.id && INVESTMENT_TYPES.includes(f.type)).map((f) => f.targetId)
      );
      const reachedValuation = [...portfolio].reduce(
        (s, id) => s + (entityById.get(id)?.latestValuationUsd ?? entityById.get(id)?.marketCapUsd ?? 0),
        0
      );
      return {
        id: inv.id,
        name: inv.name,
        deployed: deployment.get(inv.id) ?? 0,
        portfolioCount: portfolio.size,
        centrality: (pr.get(inv.id) ?? 0) / (maxPr || 1),
        reachedValuation,
      };
    })
    .filter((i) => i.portfolioCount > 0)
    .sort((a, b) => b.centrality - a.centrality)
    .slice(0, limit);
  return result;
}

// ───────────────────────── themed spending views ─────────────────────────

function sumFlows(predicate: (f: CapitalFlow) => boolean): number {
  return flows.filter(predicate).reduce((s, f) => s + f.amountUsd, 0);
}

export function infrastructureSpending(): number {
  return sumFlows((f) => {
    const t = entityById.get(f.targetId);
    return (
      (f.type === "compute-deal" || f.type === "supply") &&
      (t?.sector === "compute" || t?.sector === "infrastructure")
    );
  });
}

export function energySpending(): number {
  return sumFlows((f) => f.type === "energy-contract");
}

export function governmentSpending(): number {
  return sumFlows((f) => {
    const s = entityById.get(f.sourceId);
    return s?.sector === "government";
  });
}

export function sectorTotalFunding(sector: Sector): number {
  return entities.filter((e) => e.sector === sector).reduce((s, e) => s + (e.totalFundingUsd || 0), 0);
}

export interface GovInitiative {
  id: string;
  name: string;
  committed: number;
  targets: number;
}

export function governmentInitiatives(): GovInitiative[] {
  return entities
    .filter((e) => e.sector === "government")
    .map((g) => {
      const out = flows.filter((f) => f.sourceId === g.id);
      return {
        id: g.id,
        name: g.name,
        committed: Math.max(
          g.totalFundingUsd || 0,
          out.reduce((s, f) => s + f.amountUsd, 0)
        ),
        targets: new Set(out.map((f) => f.targetId)).size,
      };
    })
    .sort((a, b) => b.committed - a.committed);
}

// ───────────────────────── capital efficiency ─────────────────────────

export interface CapitalEfficiency {
  id: string;
  name: string;
  sector: Sector;
  funding: number;
  fundingPerRevenue?: number;
  fundingPerUser?: number;
  fundingPerEnterprise?: number;
}

export function capitalEfficiency(): CapitalEfficiency[] {
  return entities
    .filter((e) => e.sector !== "investor" && e.sector !== "government" && e.totalFundingUsd > 0)
    .map((e) => ({
      id: e.id,
      name: e.name,
      sector: e.sector,
      funding: e.totalFundingUsd,
      fundingPerRevenue: e.revenueUsd ? e.totalFundingUsd / e.revenueUsd : undefined,
      fundingPerUser: e.users ? e.totalFundingUsd / e.users : undefined,
      fundingPerEnterprise: e.enterpriseCustomers
        ? e.totalFundingUsd / e.enterpriseCustomers
        : undefined,
    }));
}

// ───────────────────────── growth velocity (time series) ─────────────────────────

export interface MonthlyPoint {
  month: string; // YYYY-MM
  amount: number;
  cumulative: number;
}

/** Capital deployed per month (optionally filtered by recipient sector). */
export function growthVelocity(sector?: Sector): MonthlyPoint[] {
  const map = new Map<string, number>();
  for (const f of flows) {
    if (!INVESTMENT_TYPES.includes(f.type)) continue;
    if (sector) {
      const t = entityById.get(f.targetId);
      if (t?.sector !== sector) continue;
    }
    const month = f.date.slice(0, 7);
    map.set(month, (map.get(month) ?? 0) + f.amountUsd);
  }
  const months = [...map.keys()].sort();
  let cumulative = 0;
  return months.map((month) => {
    const amount = map.get(month) ?? 0;
    cumulative += amount;
    return { month, amount, cumulative };
  });
}

/** Stacked monthly capital deployment broken out per sector. */
export function monthlyFundingBySector(): { month: string; [sector: string]: number | string }[] {
  const months = new Set<string>();
  const sectorMonth = new Map<string, Map<string, number>>();
  for (const f of flows) {
    if (!INVESTMENT_TYPES.includes(f.type)) continue;
    const t = entityById.get(f.targetId);
    if (!t || t.sector === "investor" || t.sector === "government") continue;
    const month = f.date.slice(0, 7);
    months.add(month);
    if (!sectorMonth.has(t.sector)) sectorMonth.set(t.sector, new Map());
    const m = sectorMonth.get(t.sector)!;
    m.set(month, (m.get(month) ?? 0) + f.amountUsd);
  }
  const sortedMonths = [...months].sort();
  return sortedMonths.map((month) => {
    const row: { month: string; [k: string]: number | string } = { month };
    for (const [sector, m] of sectorMonth) {
      row[sector] = m.get(month) ?? 0;
    }
    return row;
  });
}

// ───────────────────────── sector momentum ─────────────────────────

export interface SectorMomentum {
  sector: Sector;
  label: string;
  color: string;
  recent: number; // last 6 months
  prior: number; // prior 6 months
  momentum: number; // (recent - prior) / prior
}

/** Rate of capital entering each sector: last 6 months vs the prior 6 months. */
export function sectorMomentum(asOf = "2026-05-31"): SectorMomentum[] {
  const asOfTime = new Date(asOf).getTime();
  const sixMonths = 1000 * 60 * 60 * 24 * 182;
  const recentStart = asOfTime - sixMonths;
  const priorStart = asOfTime - 2 * sixMonths;

  const recent = new Map<Sector, number>();
  const prior = new Map<Sector, number>();
  for (const f of flows) {
    if (!INVESTMENT_TYPES.includes(f.type)) continue;
    const t = entityById.get(f.targetId);
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
      return { sector, label: sectorLabel(sector), color: SECTORS[sector].color, recent: r, prior: p, momentum };
    })
    .sort((a, b) => b.momentum - a.momentum);
}

// ───────────────────────── totals ─────────────────────────

export interface HeadlineStats {
  totalCapital: number;
  entityCount: number;
  flowCount: number;
  roundCount: number;
  largestRound: { name: string; amount: number; date: string } | null;
}

export function headlineStats(): HeadlineStats {
  const totalCapital = flows
    .filter((f) => INVESTMENT_TYPES.includes(f.type))
    .reduce((s, f) => s + f.amountUsd, 0);
  const largest = rounds.reduce<typeof rounds[number] | null>(
    (max, r) => (!max || r.amountUsd > max.amountUsd ? r : max),
    null
  );
  return {
    totalCapital,
    entityCount: entities.length,
    flowCount: flows.length,
    roundCount: rounds.length,
    largestRound: largest
      ? { name: entityById.get(largest.targetId)?.name ?? largest.targetId, amount: largest.amountUsd, date: largest.date }
      : null,
  };
}

export function topEntitiesByFunding(limit = 10): Entity[] {
  return [...entities]
    .filter((e) => e.sector !== "investor" && e.sector !== "government")
    .sort((a, b) => (b.totalFundingUsd || 0) - (a.totalFundingUsd || 0))
    .slice(0, limit);
}
