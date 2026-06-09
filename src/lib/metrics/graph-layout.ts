import { logoFor } from "../data/logos";
import { sectorColor } from "../sectors";
import type { Entity, CapitalFlow, Sector } from "../types";
import type { GraphEdge, GraphNode } from "./graph";

/**
 * Deterministic sector-cluster layout.
 *
 * Each sector gets a fixed region on the canvas. Nodes pack tightly within
 * their sector (largest at center) so clusters stay readable. Runs at seed time.
 */

/** Fixed cluster centers — arranged left-to-right by capital value chain. */
const CLUSTER: Record<
  Sector,
  { x: number; y: number; /** base spacing between nodes */ spacing: number }
> = {
  investor: { x: -1150, y: 0, spacing: 64 },
  government: { x: -1050, y: 520, spacing: 48 },
  "big-tech": { x: -320, y: -480, spacing: 58 },
  "foundation-model": { x: 280, y: -320, spacing: 56 },
  "enterprise-ai": { x: 920, y: -280, spacing: 50 },
  "agent-infra": { x: 920, y: 280, spacing: 48 },
  robotics: { x: 680, y: 720, spacing: 46 },
  infrastructure: { x: -280, y: 520, spacing: 50 },
  compute: { x: 280, y: 520, spacing: 50 },
  energy: { x: 80, y: 880, spacing: 44 },
};

function capitalWeight(e: Entity): number {
  return e.marketCapUsd ?? e.latestValuationUsd ?? e.totalFundingUsd ?? 0;
}

function nodeDiameter(e: Entity, minW: number, maxW: number): number {
  const w = capitalWeight(e);
  if (w <= 0) return 48;
  const t = (Math.sqrt(w) - minW) / (maxW - minW || 1);
  return 46 + t * 86;
}

/**
 * Phyllotaxis spiral packing within a sector cluster.
 * Heaviest entities sit closest to the cluster center.
 */
function packCluster(
  entities: Entity[],
  cx: number,
  cy: number,
  spacing: number,
  sizeFor: (e: Entity) => number
): Map<string, { x: number; y: number }> {
  const sorted = [...entities].sort((a, b) => capitalWeight(b) - capitalWeight(a));
  const golden = Math.PI * (3 - Math.sqrt(5));
  const out = new Map<string, { x: number; y: number }>();

  for (let i = 0; i < sorted.length; i++) {
    const e = sorted[i];
    const r = spacing * 0.55 * Math.sqrt(i) + sizeFor(e) * 0.12;
    const a = i * golden;
    out.set(e.id, {
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a) * r,
    });
  }
  return out;
}

export function computeGraphLayout(
  entities: Entity[],
  flows: CapitalFlow[]
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const byId = new Map(entities.map((e) => [e.id, e]));

  const weights = entities.map(capitalWeight).filter((w) => w > 0);
  const minW = Math.sqrt(Math.min(...weights));
  const maxW = Math.sqrt(Math.max(...weights));
  const sizeFor = (e: Entity) => nodeDiameter(e, minW, maxW);

  // Group by sector and pack each cluster independently.
  const bySector = new Map<Sector, Entity[]>();
  for (const e of entities) {
    const list = bySector.get(e.sector) ?? [];
    list.push(e);
    bySector.set(e.sector, list);
  }

  const positions = new Map<string, { x: number; y: number }>();
  for (const [sector, group] of bySector) {
    const cfg = CLUSTER[sector];
    const packed = packCluster(group, cfg.x, cfg.y, cfg.spacing, sizeFor);
    for (const [id, pos] of packed) positions.set(id, pos);
  }

  const nodes: GraphNode[] = entities.map((e) => {
    const p = positions.get(e.id) ?? { x: 0, y: 0 };
    const logo = logoFor(e.id);
    return {
      id: e.id,
      name: e.name,
      sector: e.sector,
      color: sectorColor(e.sector),
      size: sizeFor(e),
      weight: capitalWeight(e),
      x: Math.round(p.x * 100) / 100,
      y: Math.round(p.y * 100) / 100,
      logo: logo.primary,
      logoFallback: logo.fallback,
    };
  });

  const agg = new Map<string, { source: string; target: string; value: number; chain: boolean }>();
  for (const f of flows) {
    const key = `${f.sourceId}__${f.targetId}`;
    const chain = f.type !== "investment" && f.type !== "grant";
    const cur = agg.get(key) ?? { source: f.sourceId, target: f.targetId, value: 0, chain };
    cur.value += f.amountUsd;
    agg.set(key, cur);
  }

  const allEdges = [...agg.values()].filter(
    (e) => byId.has(e.source) && byId.has(e.target)
  );
  const maxEdge = Math.max(...allEdges.map((e) => e.value), 1);

  const edges: GraphEdge[] = allEdges.map((e, i) => ({
    id: `e-${i}`,
    source: e.source,
    target: e.target,
    value: e.value,
    width: Math.round((0.6 + (Math.sqrt(e.value) / Math.sqrt(maxEdge)) * 6) * 100) / 100,
    type: e.chain ? "value-chain" : "investment",
  }));

  return { nodes, edges };
}
