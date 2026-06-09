import type { Sector, SectorMeta } from "./types";

/**
 * Single source of truth for sector metadata: labels, accent colors (kept in
 * sync with the CSS variables in globals.css) and the conceptual layer used to
 * lay out the Capital Sankey (capital sources → infra/energy → models → agents
 * → applications).
 */
export const SECTORS: Record<Sector, SectorMeta> = {
  investor: {
    id: "investor",
    label: "Investors",
    color: "#f5b301",
    layer: 0,
    blurb: "Venture, growth, and sovereign capital allocators.",
  },
  government: {
    id: "government",
    label: "Government",
    color: "#2dd4bf",
    layer: 0,
    blurb: "National and supranational AI investment programs.",
  },
  "big-tech": {
    id: "big-tech",
    label: "Big Tech",
    color: "#6366f1",
    layer: 1,
    blurb: "Hyperscalers and platform incumbents funding and consuming AI.",
  },
  energy: {
    id: "energy",
    label: "Energy",
    color: "#10b981",
    layer: 1,
    blurb: "Power generation underpinning AI datacenter demand.",
  },
  compute: {
    id: "compute",
    label: "Datacenter / Compute",
    color: "#3b82f6",
    layer: 1,
    blurb: "Neocloud and datacenter capacity for model training.",
  },
  infrastructure: {
    id: "infrastructure",
    label: "Infrastructure",
    color: "#22d3ee",
    layer: 1,
    blurb: "Silicon, accelerators, and core AI infrastructure.",
  },
  "foundation-model": {
    id: "foundation-model",
    label: "Foundation Models",
    color: "#8b5cf6",
    layer: 2,
    blurb: "Frontier and open-weight model developers.",
  },
  "agent-infra": {
    id: "agent-infra",
    label: "Agent Infrastructure",
    color: "#e879f9",
    layer: 3,
    blurb: "Orchestration, retrieval, and agent tooling.",
  },
  "enterprise-ai": {
    id: "enterprise-ai",
    label: "Enterprise AI",
    color: "#fb923c",
    layer: 4,
    blurb: "Vertical and horizontal applied AI applications.",
  },
  robotics: {
    id: "robotics",
    label: "Robotics",
    color: "#fb7185",
    layer: 4,
    blurb: "Humanoids, manipulation, and embodied intelligence.",
  },
};

export const SECTOR_LIST: SectorMeta[] = Object.values(SECTORS);

export function sectorColor(sector: Sector): string {
  return SECTORS[sector]?.color ?? "#8b97a8";
}

export function sectorLabel(sector: Sector): string {
  return SECTORS[sector]?.label ?? sector;
}
