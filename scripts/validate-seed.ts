/**
 * Validates the generated seed dataset for graph completeness.
 * Fails with a non-zero exit code if any entity has zero connections.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedDir = join(__dirname, "..", "src", "lib", "data", "seed");

interface Entity {
  id: string;
  name: string;
}

interface GraphEdge {
  source: string;
  target: string;
}

const entities: Entity[] = JSON.parse(
  readFileSync(join(seedDir, "entities.json"), "utf8")
);
const graph: { nodes: { id: string }[]; edges: GraphEdge[] } = JSON.parse(
  readFileSync(join(seedDir, "graph.json"), "utf8")
);
const meta = JSON.parse(readFileSync(join(seedDir, "meta.json"), "utf8"));

const connected = new Set<string>();
for (const edge of graph.edges) {
  connected.add(edge.source);
  connected.add(edge.target);
}

const isolated = entities.filter((e) => !connected.has(e.id));

if (isolated.length > 0) {
  console.error(`FAIL: ${isolated.length} isolated entities (zero graph connections):`);
  for (const e of isolated) {
    console.error(`  - ${e.name} (${e.id})`);
  }
  process.exit(1);
}

const thin = entities.filter((e) => {
  const deg = graph.edges.filter(
    (edge) => edge.source === e.id || edge.target === e.id
  ).length;
  return deg <= 1;
});

console.log(
  `OK: ${meta.counts.entities} entities, ${meta.counts.rounds} rounds, ` +
    `${meta.counts.flows} flows, ${meta.counts.graphEdges} edges — all connected`
);

if (thin.length > 0) {
  console.warn(`WARN: ${thin.length} entities have only 1 graph edge`);
}
