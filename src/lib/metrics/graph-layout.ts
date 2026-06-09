import { logoFor } from "../data/logos";
import { sectorColor } from "../sectors";
import type { Entity, CapitalFlow, Sector } from "../types";
import type { GraphEdge, GraphNode } from "./graph";

/**
 * Deterministic sector-cluster layout with zero node overlap.
 *
 * Each sector gets a fixed region. Nodes are placed largest-first via spiral
 * search with circle collision checks, then a global resolver eliminates any
 * remaining cross-cluster overlap. Runs at seed time.
 */

/** Minimum gap between node edges (px). */
export const NODE_GAP = 16;

/** Fixed cluster centers — arranged left-to-right by capital value chain. */
export const SECTOR_CLUSTERS: Record<
  Sector,
  { x: number; y: number; /** base spacing between nodes */ spacing: number }
> = {
  investor: { x: -1380, y: 0, spacing: 64 },
  government: { x: -1180, y: 640, spacing: 48 },
  "big-tech": { x: -420, y: -580, spacing: 58 },
  "foundation-model": { x: 340, y: -420, spacing: 56 },
  "enterprise-ai": { x: 1120, y: -360, spacing: 50 },
  "agent-infra": { x: 1120, y: 380, spacing: 48 },
  robotics: { x: 820, y: 920, spacing: 46 },
  infrastructure: { x: -380, y: 640, spacing: 50 },
  compute: { x: 340, y: 640, spacing: 50 },
  energy: { x: 60, y: 1060, spacing: 44 },
};

/** Sector placement order — largest clusters first for better packing. */
const SECTOR_ORDER: Sector[] = [
  "investor",
  "infrastructure",
  "enterprise-ai",
  "foundation-model",
  "big-tech",
  "compute",
  "government",
  "energy",
  "robotics",
  "agent-infra",
];

interface LayoutCircle {
  id: string;
  x: number;
  y: number;
  r: number;
  sector: Sector;
  anchorX: number;
  anchorY: number;
}

function capitalWeight(e: Entity): number {
  return e.marketCapUsd ?? e.latestValuationUsd ?? e.totalFundingUsd ?? 0;
}

function nodeDiameter(e: Entity, minW: number, maxW: number): number {
  const w = capitalWeight(e);
  if (w <= 0) return 48;
  const t = (Math.sqrt(w) - minW) / (maxW - minW || 1);
  return 46 + t * 86;
}

/** Collision radius: circle body + label beneath + gap. */
export function nodeCollisionRadius(size: number): number {
  return size * 0.58 + NODE_GAP;
}

function overlaps(a: LayoutCircle, b: LayoutCircle): boolean {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const minD = a.r + b.r;
  return dx * dx + dy * dy < minD * minD - 1e-6;
}

function anchorDistance(c: LayoutCircle): number {
  return Math.hypot(c.x - c.anchorX, c.y - c.anchorY);
}

/**
 * Spiral search for the first position that does not overlap any placed node.
 */
function findOpenPosition(
  cx: number,
  cy: number,
  radius: number,
  placed: LayoutCircle[],
  seed: number
): { x: number; y: number } {
  const probe = (x: number, y: number) => {
    const c: LayoutCircle = {
      id: "probe",
      x,
      y,
      r: radius,
      sector: "investor",
      anchorX: cx,
      anchorY: cy,
    };
    return !placed.some((p) => overlaps(c, p));
  };

  if (probe(cx, cy)) return { x: cx, y: cy };

  const golden = Math.PI * (3 - Math.sqrt(5));
  const step = Math.max(6, radius * 0.22);

  for (let i = 1; i < 3000; i++) {
    const dist = step * Math.sqrt(i);
    const angle = i * golden + seed;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    if (probe(x, y)) return { x, y };
  }

  // Last resort — push far from cluster center; resolver will refine.
  const fallback = 3000 + radius + seed * 40;
  return {
    x: cx + Math.cos(seed) * fallback,
    y: cy + Math.sin(seed) * fallback,
  };
}

function packClusterCollisionFree(
  entities: Entity[],
  cx: number,
  cy: number,
  sizeFor: (e: Entity) => number,
  placed: LayoutCircle[]
): LayoutCircle[] {
  const sorted = [...entities].sort((a, b) => capitalWeight(b) - capitalWeight(a));
  const local: LayoutCircle[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const e = sorted[i];
    const r = nodeCollisionRadius(sizeFor(e));
    const pos = findOpenPosition(cx, cy, r, [...placed, ...local], i * 0.37 + r * 0.01);
    local.push({
      id: e.id,
      x: pos.x,
      y: pos.y,
      r,
      sector: e.sector,
      anchorX: cx,
      anchorY: cy,
    });
  }

  return local;
}

/** Push overlapping circles apart; nodes farther from anchor move more. */
function resolveCollisions(circles: LayoutCircle[], maxIterations = 2500): number {
  let remaining = 0;

  for (let iter = 0; iter < maxIterations; iter++) {
    remaining = 0;

    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        const a = circles[i];
        const b = circles[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let distSq = dx * dx + dy * dy;
        const minD = a.r + b.r;

        if (distSq >= minD * minD) continue;

        let dist = Math.sqrt(distSq);
        if (dist < 1e-4) {
          const angle = ((i * 2.399963 + j * 0.713) % (2 * Math.PI));
          dx = Math.cos(angle);
          dy = Math.sin(angle);
          dist = 1;
        }

        const overlap = minD - dist;
        remaining++;
        const ux = dx / dist;
        const uy = dy / dist;
        const push = overlap / 2 + 0.75;

        const aAnchor = anchorDistance(a) + a.r * 0.25;
        const bAnchor = anchorDistance(b) + b.r * 0.25;
        const total = aAnchor + bAnchor || 1;
        const aMove = push * (bAnchor / total);
        const bMove = push * (aAnchor / total);

        a.x -= ux * aMove;
        a.y -= uy * aMove;
        b.x += ux * bMove;
        b.y += uy * bMove;
      }
    }

    if (remaining === 0) return 0;
  }

  return remaining;
}

/** Shift entire sectors apart when pairs still overlap after local resolution. */
function separateClusterGroups(circles: LayoutCircle[], maxPasses = 80): void {
  const bySector = new Map<Sector, LayoutCircle[]>();
  for (const c of circles) {
    const list = bySector.get(c.sector) ?? [];
    list.push(c);
    bySector.set(c.sector, list);
  }

  for (let pass = 0; pass < maxPasses; pass++) {
    let moved = false;

    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        const a = circles[i];
        const b = circles[j];
        if (a.sector === b.sector) continue;

        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let distSq = dx * dx + dy * dy;
        const minD = a.r + b.r;
        if (distSq >= minD * minD) continue;

        let dist = Math.sqrt(distSq);
        if (dist < 1e-4) {
          dx = 1;
          dy = 0;
          dist = 1;
        }

        const overlap = minD - dist + 4;
        const ux = dx / dist;
        const uy = dy / dist;

        const aGroup = bySector.get(a.sector)!;
        const bGroup = bySector.get(b.sector)!;
        const aMove = overlap * (bGroup.length / (aGroup.length + bGroup.length));
        const bMove = overlap - aMove;

        for (const n of aGroup) {
          n.x -= ux * aMove;
          n.y -= uy * aMove;
        }
        for (const n of bGroup) {
          n.x += ux * bMove;
          n.y += uy * bMove;
        }

        moved = true;
      }
    }

    if (!moved) return;
    resolveCollisions(circles, 120);
  }
}

export interface NodeOverlap {
  a: string;
  b: string;
  overlapPx: number;
}

export function nodesCollideAt(
  id: string,
  x: number,
  y: number,
  size: number,
  others: Array<{ id: string; x: number; y: number; size: number }>
): boolean {
  const r = nodeCollisionRadius(size);
  for (const o of others) {
    if (o.id === id) continue;
    const dx = x - o.x;
    const dy = y - o.y;
    const minD = r + nodeCollisionRadius(o.size);
    if (dx * dx + dy * dy < minD * minD) return true;
  }
  return false;
}

export function findNodeOverlaps(
  nodes: Pick<GraphNode, "id" | "name" | "x" | "y" | "size">[]
): NodeOverlap[] {
  const out: NodeOverlap[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const ar = nodeCollisionRadius(a.size);
      const br = nodeCollisionRadius(b.size);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      const minD = ar + br;
      if (dist < minD) {
        out.push({
          a: a.name,
          b: b.name,
          overlapPx: Math.round((minD - dist) * 100) / 100,
        });
      }
    }
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

  const bySector = new Map<Sector, Entity[]>();
  for (const e of entities) {
    const list = bySector.get(e.sector) ?? [];
    list.push(e);
    bySector.set(e.sector, list);
  }

  const placed: LayoutCircle[] = [];
  for (const sector of SECTOR_ORDER) {
    const group = bySector.get(sector);
    if (!group?.length) continue;
    const cfg = SECTOR_CLUSTERS[sector];
    const packed = packClusterCollisionFree(group, cfg.x, cfg.y, sizeFor, placed);
    placed.push(...packed);
  }

  let remaining = resolveCollisions(placed, 2500);
  if (remaining > 0) {
    separateClusterGroups(placed, 100);
    remaining = resolveCollisions(placed, 2500);
  }

  const overlaps = findNodeOverlaps(
    placed.map((c) => ({
      id: c.id,
      name: byId.get(c.id)?.name ?? c.id,
      x: c.x,
      y: c.y,
      size: nodeDiameter(byId.get(c.id)!, minW, maxW),
    }))
  );

  if (overlaps.length > 0) {
    const sample = overlaps
      .slice(0, 5)
      .map((o) => `${o.a} ↔ ${o.b} (${o.overlapPx}px)`)
      .join("; ");
    throw new Error(
      `Graph layout has ${overlaps.length} node overlap(s) after resolution: ${sample}`
    );
  }

  const positions = new Map(placed.map((c) => [c.id, { x: c.x, y: c.y }]));

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
