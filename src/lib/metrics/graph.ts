import { SECTOR_LIST } from "../sectors";
import type { Sector } from "../types";
import graphData from "../data/seed/graph.json";

/**
 * Runtime graph accessor.
 *
 * The graph layout is precomputed at seed time (see `graph-layout.ts`, run via
 * `npm run seed`) and serialized to `seed/graph.json`. At runtime we simply read
 * the precomputed positions — no d3-force simulation on the request path — which
 * keeps page rendering/boot fast.
 */

export interface GraphNode {
  id: string;
  name: string;
  sector: Sector;
  color: string;
  size: number; // diameter in px
  weight: number; // raw capital weight (USD)
  x: number;
  y: number;
  logo?: string;
  logoFallback?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  value: number; // aggregated USD
  width: number; // px
  type: "investment" | "value-chain";
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const data = graphData as unknown as GraphData;

export function buildGraph(): GraphData {
  return data;
}

export const SECTOR_LEGEND = SECTOR_LIST;
