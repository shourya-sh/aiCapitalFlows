import { dataset, entityById } from "../data";
import { SECTORS } from "../sectors";
import type { CapitalFlow, Sector } from "../types";

/**
 * Builds the data for the Capital Sankey: a value-chain cascade from capital
 * sources through infrastructure, foundation models, agent infra, and on to
 * applications. It blends *direct* financings (investors → sector) with
 * *value-chain* deployment (e.g. models purchasing compute, datacenters
 * contracting power) to show how dollars cascade through the ecosystem.
 */

export interface SankeyNodeInput {
  name: string;
  color: string;
}
export interface SankeyLinkInput {
  source: number;
  target: number;
  value: number;
}
export interface SankeyGraph {
  nodes: SankeyNodeInput[];
  links: SankeyLinkInput[];
}

const { flows } = dataset;
const INVESTMENT_TYPES: CapitalFlow["type"][] = ["investment", "grant", "partnership"];

type Bucket = "infra" | "models" | "agents" | "enterprise" | "robotics";

function bucketForSector(sector: Sector): Bucket | null {
  switch (sector) {
    case "infrastructure":
    case "compute":
    case "energy":
    case "big-tech":
      return "infra";
    case "foundation-model":
      return "models";
    case "agent-infra":
      return "agents";
    case "enterprise-ai":
      return "enterprise";
    case "robotics":
      return "robotics";
    default:
      return null;
  }
}

export function buildSankey(): SankeyGraph {
  // Per-source deployment, split by destination bucket.
  const bySource = new Map<string, Record<Bucket, number>>();
  for (const f of flows) {
    const src = entityById.get(f.sourceId);
    if (!src || (src.sector !== "investor" && src.sector !== "government")) continue;
    if (!INVESTMENT_TYPES.includes(f.type)) continue;
    const tgt = entityById.get(f.targetId);
    if (!tgt) continue;
    const bucket = bucketForSector(tgt.sector);
    if (!bucket) continue;
    if (!bySource.has(f.sourceId)) {
      bySource.set(f.sourceId, { infra: 0, models: 0, agents: 0, enterprise: 0, robotics: 0 });
    }
    bySource.get(f.sourceId)![bucket] += f.amountUsd;
  }

  const sourceTotals = [...bySource.entries()]
    .map(([id, b]) => ({ id, total: b.infra + b.models + b.agents + b.enterprise + b.robotics, b }))
    .sort((a, b) => b.total - a.total);

  const TOP = 7;
  const top = sourceTotals.slice(0, TOP);
  const rest = sourceTotals.slice(TOP);
  const restAgg: Record<Bucket, number> = { infra: 0, models: 0, agents: 0, enterprise: 0, robotics: 0 };
  for (const r of rest) {
    (Object.keys(restAgg) as Bucket[]).forEach((k) => (restAgg[k] += r.b[k]));
  }

  const nodes: SankeyNodeInput[] = [];
  const nodeIndex = new Map<string, number>();
  const addNode = (name: string, color: string) => {
    if (nodeIndex.has(name)) return nodeIndex.get(name)!;
    const i = nodes.length;
    nodes.push({ name, color });
    nodeIndex.set(name, i);
    return i;
  };

  // Sector hub nodes.
  const nInfra = addNode("Infrastructure", SECTORS.infrastructure.color);
  const nModels = addNode("Foundation Models", SECTORS["foundation-model"].color);
  const nAgents = addNode("Agent Infra", SECTORS["agent-infra"].color);
  const nEnt = addNode("Enterprise AI", SECTORS["enterprise-ai"].color);
  const nRobo = addNode("Robotics", SECTORS.robotics.color);
  const nEnergy = addNode("Energy", SECTORS.energy.color);

  const links: SankeyLinkInput[] = [];

  const wireSource = (name: string, b: Record<Bucket, number>) => {
    const src = entityById.get(name);
    const color = src?.sector === "government" ? SECTORS.government.color : SECTORS.investor.color;
    const display = src?.name ?? name;
    const idx = addNode(display, color);
    if (b.infra > 0) links.push({ source: idx, target: nInfra, value: b.infra });
    if (b.models > 0) links.push({ source: idx, target: nModels, value: b.models });
    if (b.agents > 0) links.push({ source: idx, target: nAgents, value: b.agents });
    if (b.enterprise > 0) links.push({ source: idx, target: nEnt, value: b.enterprise });
    if (b.robotics > 0) links.push({ source: idx, target: nRobo, value: b.robotics });
  };

  for (const s of top) wireSource(s.id, s.b);
  if (rest.length) {
    const idx = addNode("Other Capital", "#5d6877");
    if (restAgg.infra > 0) links.push({ source: idx, target: nInfra, value: restAgg.infra });
    if (restAgg.models > 0) links.push({ source: idx, target: nModels, value: restAgg.models });
    if (restAgg.agents > 0) links.push({ source: idx, target: nAgents, value: restAgg.agents });
    if (restAgg.enterprise > 0) links.push({ source: idx, target: nEnt, value: restAgg.enterprise });
    if (restAgg.robotics > 0) links.push({ source: idx, target: nRobo, value: restAgg.robotics });
  }

  // Value-chain deployment links (downstream cascade).
  const computeDeals = flows.filter((f) => f.type === "compute-deal").reduce((s, f) => s + f.amountUsd, 0);
  const energyContracts = flows.filter((f) => f.type === "energy-contract").reduce((s, f) => s + f.amountUsd, 0);
  const agentCap = bySumSector("agent-infra");
  const enterpriseCap = bySumSector("enterprise-ai");

  if (computeDeals > 0) links.push({ source: nInfra, target: nModels, value: computeDeals });
  if (energyContracts > 0) links.push({ source: nInfra, target: nEnergy, value: energyContracts });
  if (agentCap > 0) links.push({ source: nModels, target: nAgents, value: agentCap * 0.5 });
  if (enterpriseCap > 0) links.push({ source: nModels, target: nEnt, value: enterpriseCap * 0.35 });
  if (enterpriseCap > 0) links.push({ source: nAgents, target: nEnt, value: enterpriseCap * 0.25 });

  return { nodes, links };
}

function bySumSector(sector: Sector): number {
  return dataset.entities
    .filter((e) => e.sector === sector)
    .reduce((s, e) => s + (e.totalFundingUsd || 0), 0);
}
