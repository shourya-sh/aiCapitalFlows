import { entityById } from "./index";
import type { EntityDetail } from "./detail";
import { formatUsd } from "../utils";
import type { Sector } from "../types";

export interface NewsItem {
  id: string;
  date: string;
  headline: string;
  source: string;
  tag: string;
  tagColor: "green" | "blue" | "yellow" | "purple" | "red" | "cyan";
}

const SOURCES = [
  "Bloomberg", "Reuters", "TechCrunch", "The Information",
  "Financial Times", "WSJ", "CNBC", "Semafor", "Axios",
  "The Verge", "Ars Technica", "VentureBeat",
];

const SECTOR_UPDATES: Record<Sector, { headlines: string[]; tag: string; tagColor: NewsItem["tagColor"] }> = {
  "foundation-model": {
    headlines: [
      "{name} releases new reasoning model, benchmarks exceed GPT-4 on coding and math",
      "{name} expands enterprise API with fine-tuning and batch inference",
      "{name} partners with major cloud provider for global model distribution",
      "{name} announces multi-modal upgrade with vision and audio capabilities",
      "{name} hits 100M API calls per day as developer adoption surges",
      "{name} launches agent SDK enabling autonomous multi-step task execution",
    ],
    tag: "Product",
    tagColor: "purple",
  },
  infrastructure: {
    headlines: [
      "{name} reports record quarterly revenue driven by datacenter demand",
      "{name} unveils next-gen accelerator with 2x inference throughput",
      "{name} expands manufacturing capacity to meet chip demand backlog",
      "{name} announces new interconnect standard for large-scale training clusters",
      "{name} signs multi-year supply agreement with leading cloud provider",
    ],
    tag: "Earnings",
    tagColor: "blue",
  },
  compute: {
    headlines: [
      "{name} breaks ground on new 500MW hyperscale campus",
      "{name} secures {amount} in project financing for datacenter expansion",
      "{name} signs multi-year capacity agreement with foundation model lab",
      "{name} achieves full power-on for GPU cluster deployment",
      "{name} expands to new geography with international datacenter site",
    ],
    tag: "Expansion",
    tagColor: "cyan",
  },
  energy: {
    headlines: [
      "{name} signs long-term power purchase agreement with hyperscaler",
      "{name} receives regulatory approval for new generation facility",
      "{name} reports growing demand pipeline from datacenter operators",
      "{name} secures grid interconnection for next-phase capacity",
      "{name} announces partnership to supply clean power for training clusters",
    ],
    tag: "Energy",
    tagColor: "green",
  },
  robotics: {
    headlines: [
      "{name} demonstrates new dexterity milestone in warehouse deployment",
      "{name} begins commercial pilot with Fortune 500 logistics partner",
      "{name} raises {amount} to scale manufacturing of humanoid platform",
      "{name} achieves autonomous navigation in unstructured environments",
      "{name} announces new form factor for industrial applications",
    ],
    tag: "Robotics",
    tagColor: "red",
  },
  "agent-infra": {
    headlines: [
      "{name} launches enterprise-grade agent orchestration platform",
      "{name} reports 5x growth in monthly active developers",
      "{name} introduces production monitoring and evaluation tools",
      "{name} expands integration ecosystem with 50+ new connectors",
      "{name} open-sources core framework, seeing rapid community adoption",
    ],
    tag: "Developer",
    tagColor: "purple",
  },
  "enterprise-ai": {
    headlines: [
      "{name} lands multi-year contract with Fortune 100 enterprise",
      "{name} reports 3x ARR growth year-over-year",
      "{name} launches vertical-specific solution for regulated industries",
      "{name} crosses 1,000 enterprise customers milestone",
      "{name} expands to European market with GDPR-compliant deployment",
    ],
    tag: "Enterprise",
    tagColor: "blue",
  },
  "big-tech": {
    headlines: [
      "{name} announces $10B+ capital expenditure plan for data infrastructure",
      "{name} integrates new model capabilities across product suite",
      "{name} reports strong cloud revenue growth driven by workload demand",
      "{name} acquires promising startup to bolster technology stack",
      "{name} rolls out new developer tools powered by latest models",
    ],
    tag: "Big Tech",
    tagColor: "cyan",
  },
  investor: {
    headlines: [
      "{name} closes new fund focused on infrastructure and applied intelligence",
      "{name} leads largest round of the quarter in compute sector",
      "{name} marks up portfolio after secondary market transactions",
      "{name} expands team with new partners covering frontier technology",
      "{name} backs breakout startup in agent orchestration space",
    ],
    tag: "Deals",
    tagColor: "yellow",
  },
  government: {
    headlines: [
      "{name} announces national investment program for compute sovereignty",
      "{name} allocates {amount} for domestic chip manufacturing",
      "{name} launches strategic partnership with private sector on infrastructure",
      "{name} publishes updated regulatory framework for frontier systems",
      "{name} commits to international cooperation on technology standards",
    ],
    tag: "Policy",
    tagColor: "green",
  },
};

function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function pickRandom<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function randomRecentDate(rng: () => number, daysBack: number): string {
  const now = new Date("2026-06-01");
  const offset = Math.floor(rng() * daysBack);
  const d = new Date(now.getTime() - offset * 86400000);
  return d.toISOString().slice(0, 10);
}

function relativeTime(dateStr: string): string {
  const now = new Date("2026-06-01").getTime();
  const then = new Date(dateStr).getTime();
  const days = Math.floor((now - then) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export { relativeTime };

export function generateNewsForEntity(detail: EntityDetail): NewsItem[] {
  const { entity, rounds, movements } = detail;
  const rng = seededRandom(entity.id);
  const items: NewsItem[] = [];
  let seq = 0;

  // News from actual funding rounds.
  for (const r of rounds.slice(-3)) {
    const lead = r.leadInvestorId ? entityById.get(r.leadInvestorId) : null;
    const leadStr = lead ? `, led by ${lead.name}` : "";
    const valStr = r.valuationUsd ? ` at a ${formatUsd(r.valuationUsd)} valuation` : "";
    items.push({
      id: `${entity.id}-round-${seq++}`,
      date: r.date,
      headline: `${entity.name} closes ${formatUsd(r.amountUsd)} ${r.roundType}${valStr}${leadStr}`,
      source: pickRandom(SOURCES, rng),
      tag: r.roundType,
      tagColor: "green",
    });
  }

  // News from notable movements (partnerships, compute deals, etc.).
  const notableMovements = movements
    .filter((m) => m.type !== "investment" && m.type !== "grant")
    .slice(0, 4);
  for (const m of notableMovements) {
    const verb =
      m.type === "compute-deal" ? "signs compute capacity deal with"
      : m.type === "supply" ? "secures hardware supply from"
      : m.type === "energy-contract" ? "signs power agreement with"
      : m.type === "partnership" ? "enters strategic partnership with"
      : "engages with";
    const dir = m.direction === "in" ? m.counterpartyName : m.counterpartyName;
    items.push({
      id: `${entity.id}-move-${seq++}`,
      date: m.date,
      headline: `${entity.name} ${verb} ${dir} in ${formatUsd(m.amount)} deal`,
      source: pickRandom(SOURCES, rng),
      tag: m.dealLabel,
      tagColor: m.direction === "in" ? "cyan" : "yellow",
    });
  }

  // Sector-specific updates (generated from templates).
  const sectorConfig = SECTOR_UPDATES[entity.sector];
  const usedHeadlines = new Set(items.map((i) => i.headline));
  const shuffled = [...sectorConfig.headlines].sort(() => rng() - 0.5);
  for (const template of shuffled.slice(0, 3)) {
    const amtStr = entity.totalFundingUsd > 0
      ? formatUsd(Math.round(entity.totalFundingUsd * (0.1 + rng() * 0.3)))
      : "$500M";
    const headline = template
      .replace("{name}", entity.name)
      .replace("{amount}", amtStr);
    if (usedHeadlines.has(headline)) continue;
    usedHeadlines.add(headline);
    items.push({
      id: `${entity.id}-sector-${seq++}`,
      date: randomRecentDate(rng, 90),
      headline,
      source: pickRandom(SOURCES, rng),
      tag: sectorConfig.tag,
      tagColor: sectorConfig.tagColor,
    });
  }

  items.sort((a, b) => b.date.localeCompare(a.date));
  return items;
}
