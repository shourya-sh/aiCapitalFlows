import { landmarksForTier } from "../data/landmark-deals";
import type { GraphEdge, GraphNode } from "./graph";

export type MapComplexity = "overview" | "standard" | "detailed" | "complete";

export interface ComplexityPreset {
  id: MapComplexity;
  label: string;
  description: string;
  minValueUsd: number;
  maxEdges: number;
  /** Always show the N largest entities even if they have no edge above the threshold. */
  anchorNodes: number;
}

export const COMPLEXITY_PRESETS: ComplexityPreset[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Landmark flows only — fastest, clearest map",
    minValueUsd: 1_000_000_000,
    maxEdges: 55,
    anchorNodes: 28,
  },
  {
    id: "standard",
    label: "Standard",
    description: "Major deals ($250M+) — balanced detail & speed",
    minValueUsd: 250_000_000,
    maxEdges: 140,
    anchorNodes: 40,
  },
  {
    id: "detailed",
    label: "Detailed",
    description: "Foundational deals + most relationships ($25M+)",
    minValueUsd: 25_000_000,
    maxEdges: 420,
    anchorNodes: 80,
  },
  {
    id: "complete",
    label: "Complete",
    description: "Every curated connection — may feel heavy",
    minValueUsd: 0,
    maxEdges: Infinity,
    anchorNodes: 0,
  },
];

export const DEFAULT_COMPLEXITY: MapComplexity = "detailed";

export function presetFor(id: MapComplexity): ComplexityPreset {
  return COMPLEXITY_PRESETS.find((p) => p.id === id) ?? COMPLEXITY_PRESETS[1];
}

export interface FilteredGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats: { nodeCount: number; edgeCount: number; totalNodes: number; totalEdges: number };
}

/**
 * Filters graph edges by deal size, then keeps nodes that participate in visible
 * edges plus the largest anchor entities so the map never looks empty.
 */
export function filterGraphByComplexity(
  nodes: GraphNode[],
  edges: GraphEdge[],
  complexity: MapComplexity
): FilteredGraph {
  const preset = presetFor(complexity);
  const landmarkKeys = landmarksForTier(complexity);
  const edgeByKey = new Map(edges.map((e) => [`${e.source}|${e.target}`, e]));

  const visibleEdges: GraphEdge[] = [];
  const seen = new Set<string>();

  // 1. Always pin foundational landmark deals for this tier.
  for (const key of landmarkKeys) {
    const edge = edgeByKey.get(key);
    if (edge && !seen.has(edge.id)) {
      visibleEdges.push(edge);
      seen.add(edge.id);
    }
  }

  // 2. Fill remaining slots by deal size.
  const sorted = [...edges].sort((a, b) => b.value - a.value);
  for (const edge of sorted) {
    if (seen.has(edge.id)) continue;
    if (edge.value < preset.minValueUsd) continue;
    if (visibleEdges.length >= preset.maxEdges) break;
    visibleEdges.push(edge);
    seen.add(edge.id);
  }

  const connectedIds = new Set<string>();
  for (const e of visibleEdges) {
    connectedIds.add(e.source);
    connectedIds.add(e.target);
  }

  if (preset.anchorNodes > 0) {
    const anchors = [...nodes].sort((a, b) => b.weight - a.weight).slice(0, preset.anchorNodes);
    for (const n of anchors) connectedIds.add(n.id);
  }

  const visibleNodes = nodes.filter((n) => connectedIds.has(n.id));

  return {
    nodes: visibleNodes,
    edges: visibleEdges,
    stats: {
      nodeCount: visibleNodes.length,
      edgeCount: visibleEdges.length,
      totalNodes: nodes.length,
      totalEdges: edges.length,
    },
  };
}
