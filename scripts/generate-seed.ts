/**
 * Emits the deterministic seed dataset to JSON files under
 * `src/lib/data/seed/`. Run with `npm run seed`.
 *
 * These JSON files are what the application loads at runtime. Replacing them
 * with the output of a live ETL run (see `src/lib/etl`) is all that is required
 * to move from mock data to production data.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generateDataset } from "../src/lib/data/generate";
import { computeGraphLayout } from "../src/lib/metrics/graph-layout";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "src", "lib", "data", "seed");
mkdirSync(outDir, { recursive: true });

const dataset = generateDataset();

// Precompute the expensive graph layout once, here, so the runtime never has to.
const graph = computeGraphLayout(dataset.entities, dataset.flows);

const files: Record<string, unknown> = {
  "entities.json": dataset.entities,
  "rounds.json": dataset.rounds,
  "flows.json": dataset.flows,
  "ownership.json": dataset.ownership,
  "graph.json": { nodes: graph.nodes, edges: graph.edges, generatedAt: dataset.generatedAt },
  "meta.json": {
    generatedAt: dataset.generatedAt,
    counts: {
      entities: dataset.entities.length,
      rounds: dataset.rounds.length,
      flows: dataset.flows.length,
      graphNodes: graph.nodes.length,
      graphEdges: graph.edges.length,
    },
  },
};

for (const [name, data] of Object.entries(files)) {
  writeFileSync(join(outDir, name), JSON.stringify(data, null, 2), "utf8");
}

console.log(
  `Seed written → ${dataset.entities.length} entities, ${dataset.rounds.length} rounds, ${dataset.flows.length} flows, ${graph.edges.length} edges`
);
