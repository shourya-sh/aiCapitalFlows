import { entityById, investorsOf, verificationStats } from "@/lib/data";
import { capitalDeployedBySector, headlineStats, sectorTotalFunding } from "@/lib/metrics/analytics";
import type { Sector } from "@/lib/types";

const LAB_COLORS = {
  openai: "#10a37f",
  anthropic: "#d4a574",
} as const;

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

export interface FrontierLabSide {
  id: string;
  name: string;
  color: string;
  founded?: number;
  totalFunding: number;
  fundingShare: number;
  revenue?: number;
  investors: string[];
}

export interface FrontierRivalryData {
  openai: FrontierLabSide;
  anthropic: FrontierLabSide;
  combinedShare: number;
  sharedBackers: string[];
}

export function getFrontierRivalryData(): FrontierRivalryData {
  const openai = entityById.get("openai")!;
  const anthropic = entityById.get("anthropic")!;
  const sectorTotal = sectorTotalFunding("foundation-model") || 1;

  const openaiBackers = investorsOf("openai");
  const anthropicBackers = investorsOf("anthropic");
  const openaiIds = new Set(openaiBackers.map((e) => e.id));
  const shared = anthropicBackers.filter((e) => openaiIds.has(e.id)).map((e) => e.name);

  const toSide = (
    entity: NonNullable<ReturnType<typeof entityById.get>>,
    color: string,
    backers: ReturnType<typeof investorsOf>
  ): FrontierLabSide => ({
    id: entity.id,
    name: entity.name,
    color,
    founded: entity.founded,
    totalFunding: entity.totalFundingUsd ?? 0,
    fundingShare: (entity.totalFundingUsd ?? 0) / sectorTotal,
    revenue: entity.revenueUsd,
    investors: backers.slice(0, 5).map((e) => e.name),
  });

  const openaiFunding = openai.totalFundingUsd ?? 0;
  const anthropicFunding = anthropic.totalFundingUsd ?? 0;

  return {
    openai: toSide(openai, LAB_COLORS.openai, openaiBackers),
    anthropic: toSide(anthropic, LAB_COLORS.anthropic, anthropicBackers),
    combinedShare: (openaiFunding + anthropicFunding) / sectorTotal,
    sharedBackers: shared.length > 0 ? shared : ["Microsoft", "NVIDIA"],
  };
}

export function getLiveSlideMetrics(): LiveSlideMetrics {
  const stats = headlineStats();
  const verification = verificationStats();
  const sectors = capitalDeployedBySector();

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
