import type { CapitalFlow, Entity, FundingRound, Sector } from "../types";

/**
 * Normalization helpers shared by every connector. These map messy upstream
 * fields (free-text sectors, currency strings, country names) into the strict
 * domain model so downstream analytics never have to special-case a vendor.
 */

const SECTOR_ALIASES: Record<string, Sector> = {
  vc: "investor",
  "venture capital": "investor",
  investor: "investor",
  fund: "investor",
  government: "government",
  sovereign: "government",
  "public sector": "government",
  llm: "foundation-model",
  "foundation model": "foundation-model",
  "frontier model": "foundation-model",
  ai: "foundation-model",
  gpu: "infrastructure",
  semiconductor: "infrastructure",
  chips: "infrastructure",
  infrastructure: "infrastructure",
  datacenter: "compute",
  "data center": "compute",
  cloud: "compute",
  neocloud: "compute",
  compute: "compute",
  energy: "energy",
  power: "energy",
  nuclear: "energy",
  renewables: "energy",
  robotics: "robotics",
  humanoid: "robotics",
  agents: "agent-infra",
  "agent infrastructure": "agent-infra",
  orchestration: "agent-infra",
  "enterprise ai": "enterprise-ai",
  saas: "enterprise-ai",
  application: "enterprise-ai",
};

export function normalizeSector(raw: string): Sector {
  const key = raw.trim().toLowerCase();
  return SECTOR_ALIASES[key] ?? "enterprise-ai";
}

const REGION_BY_COUNTRY: Record<string, Entity["region"]> = {
  "united states": "North America",
  usa: "North America",
  canada: "North America",
  mexico: "North America",
  "united kingdom": "Europe",
  uk: "Europe",
  france: "Europe",
  germany: "Europe",
  netherlands: "Europe",
  norway: "Europe",
  israel: "Middle East",
  "saudi arabia": "Middle East",
  "united arab emirates": "Middle East",
  uae: "Middle East",
  china: "Asia",
  japan: "Asia",
  singapore: "Asia",
  india: "Asia",
  taiwan: "Asia",
};

export function normalizeRegion(country: string): Entity["region"] {
  return REGION_BY_COUNTRY[country.trim().toLowerCase()] ?? "North America";
}

/** Parse "$1.2B", "340M", "1,200,000" into a number of USD. */
export function parseUsd(raw: string | number): number {
  if (typeof raw === "number") return raw;
  const s = raw.replace(/[$,\s]/g, "").toUpperCase();
  const mult = s.endsWith("T") ? 1e12 : s.endsWith("B") ? 1e9 : s.endsWith("M") ? 1e6 : s.endsWith("K") ? 1e3 : 1;
  const n = parseFloat(s.replace(/[TBMK]/g, ""));
  return Number.isNaN(n) ? 0 : n * mult;
}

export function slugifyId(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Merge entity records from multiple sources, summing funding and unioning tags. */
export function dedupeEntities(entities: Entity[]): Entity[] {
  const map = new Map<string, Entity>();
  for (const e of entities) {
    const existing = map.get(e.id);
    if (!existing) {
      map.set(e.id, { ...e });
      continue;
    }
    map.set(e.id, {
      ...existing,
      ...e,
      totalFundingUsd: Math.max(existing.totalFundingUsd, e.totalFundingUsd),
      latestValuationUsd: Math.max(existing.latestValuationUsd ?? 0, e.latestValuationUsd ?? 0) || undefined,
      tags: Array.from(new Set([...existing.tags, ...e.tags])),
    });
  }
  return [...map.values()];
}

export function dedupeFlows(flows: CapitalFlow[]): CapitalFlow[] {
  const seen = new Set<string>();
  const out: CapitalFlow[] = [];
  for (const f of flows) {
    const key = `${f.sourceId}|${f.targetId}|${f.date}|${f.amountUsd}|${f.type}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  return out;
}

export function dedupeRounds(rounds: FundingRound[]): FundingRound[] {
  const map = new Map<string, FundingRound>();
  for (const r of rounds) {
    const key = `${r.targetId}|${r.date}|${r.roundType}`;
    map.set(key, r);
  }
  return [...map.values()];
}
