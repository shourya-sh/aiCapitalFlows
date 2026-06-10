import type { SOVEREIGN_PROGRAMS } from "./slideData";

export const MAP_WIDTH = 950;
export const MAP_HEIGHT = 620;
const MARGIN = 20;

type Program = (typeof SOVEREIGN_PROGRAMS)[number];

export type MapLayoutNode = {
  id: string;
  kind: "country" | "company";
  name: string;
  programId?: string;
  entityId?: string;
  countryCode?: string;
  commitment?: string;
  anchorX: number;
  anchorY: number;
  x: number;
  y: number;
  r: number;
  scale: number;
  connectionCount: number;
};

export type MapLayoutEdge = {
  id: string;
  programId: string;
  sourceId: string;
  targetId: string;
  scale: number;
};

export type SovereignMapLayout = {
  nodes: MapLayoutNode[];
  edges: MapLayoutEdge[];
  countries: MapLayoutNode[];
  companies: MapLayoutNode[];
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Hand-tuned layout on the 950×620 map — countries geo-inspired, companies
 * spread into regional lanes so nothing stacks in dense metro clusters.
 */
const COUNTRY_POSITIONS: Record<string, { x: number; y: number }> = {
  us: { x: 142, y: 268 },
  eu: { x: 408, y: 88 },
  sa: { x: 462, y: 352 },
  ae: { x: 588, y: 212 },
  cn: { x: 698, y: 98 },
  in: { x: 528, y: 448 },
  jp: { x: 872, y: 118 },
  sg: { x: 708, y: 502 },
};

/** Absolute positions for every partner logo — avoids HQ geo-clustering overlap. */
const COMPANY_POSITIONS: Record<string, { x: number; y: number }> = {
  // US partners — vertical lane on the west coast
  openai: { x: 72, y: 128 },
  nvidia: { x: 88, y: 198 },
  microsoft: { x: 108, y: 268 },
  oracle: { x: 188, y: 338 },
  amazon: { x: 68, y: 408 },
  // EU
  "mistral-ai": { x: 392, y: 178 },
  // Gulf
  g42: { x: 648, y: 168 },
  mgx: { x: 668, y: 258 },
  humain: { x: 398, y: 388 },
  "public-investment-fund": { x: 428, y: 468 },
  // China — staggered column
  bytedance: { x: 738, y: 68 },
  baidu: { x: 778, y: 132 },
  alibaba: { x: 718, y: 192 },
  tencent: { x: 798, y: 252 },
  // Asia-Pacific
  softbank: { x: 838, y: 88 },
  rapidus: { x: 888, y: 198 },
  tsmc: { x: 758, y: 328 },
  gic: { x: 768, y: 548 },
};

/** Gentle repulsion — companies only, countries stay fixed. */
function resolveCollisions(nodes: MapLayoutNode[], iterations: number) {
  const companies = nodes.filter((n) => n.kind === "company");
  const countries = nodes.filter((n) => n.kind === "country");

  for (let iter = 0; iter < iterations; iter++) {
    for (const a of companies) {
      for (const b of [...companies, ...countries]) {
        if (a.id === b.id) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.01;
        const aPad = a.kind === "country" ? 20 : 0;
        const bPad = b.kind === "country" ? 20 : 0;
        const pad = b.kind === "country" ? 22 : 14;
        const minDist = a.r + aPad + b.r + bPad + pad;
        if (dist < minDist) {
          const push = minDist - dist;
          const nx = dx / dist;
          const ny = dy / dist;
          a.x -= nx * push;
          a.y -= ny * push;
        }
      }
      a.x += (a.anchorX - a.x) * 0.06;
      a.y += (a.anchorY - a.y) * 0.06;
      a.x = clamp(a.x, MARGIN + a.r, MAP_WIDTH - MARGIN - a.r);
      a.y = clamp(a.y, MARGIN + a.r, MAP_HEIGHT - MARGIN - a.r);
    }
  }
}

export function buildSovereignMapLayout(programs: readonly Program[]): SovereignMapLayout {
  const companyConnections = new Map<string, { name: string; count: number }>();
  const edges: MapLayoutEdge[] = [];

  for (const program of programs) {
    for (const partner of program.partners) {
      const existing = companyConnections.get(partner.entityId);
      if (existing) {
        existing.count += 1;
      } else {
        companyConnections.set(partner.entityId, { name: partner.name, count: 1 });
      }
      edges.push({
        id: `${program.id}-${partner.entityId}`,
        programId: program.id,
        sourceId: `country-${program.id}`,
        targetId: `company-${partner.entityId}`,
        scale: program.scale,
      });
    }
  }

  const maxScale = Math.max(...programs.map((p) => p.scale), 0.001);
  const maxConn = Math.max(...[...companyConnections.values()].map((c) => c.count), 1);

  const countries: MapLayoutNode[] = programs.map((program) => {
    const pos = COUNTRY_POSITIONS[program.id] ?? { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 };
    const r = 7 + (program.scale / maxScale) * 12;
    return {
      id: `country-${program.id}`,
      kind: "country",
      name: program.country,
      programId: program.id,
      countryCode: program.countryCode,
      commitment: program.commitment,
      anchorX: pos.x,
      anchorY: pos.y,
      x: pos.x,
      y: pos.y,
      r,
      scale: program.scale,
      connectionCount: program.partners.length,
    };
  });

  const companies: MapLayoutNode[] = [...companyConnections.entries()].map(([entityId, c]) => {
    const pos = COMPANY_POSITIONS[entityId] ?? { x: MAP_WIDTH * 0.5, y: MAP_HEIGHT * 0.5 };
    const r = 6 + (c.count / maxConn) * 7;
    return {
      id: `company-${entityId}`,
      kind: "company",
      name: c.name,
      entityId,
      anchorX: pos.x,
      anchorY: pos.y,
      x: pos.x,
      y: pos.y,
      r,
      scale: c.count / maxConn,
      connectionCount: c.count,
    };
  });

  const nodes = [...countries, ...companies];
  resolveCollisions(nodes, 120);

  return { nodes, edges, countries, companies };
}

export function toPct(x: number, y: number) {
  return { leftPct: (x / MAP_WIDTH) * 100, topPct: (y / MAP_HEIGHT) * 100 };
}

export function curvePath(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1;
  const lift = Math.min(28, dist * 0.07 + 6);
  const mx = (x1 + x2) / 2 + (dy / dist) * lift * 0.3;
  const my = (y1 + y2) / 2 - lift;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}
