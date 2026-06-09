/**
 * Fails if the same investor → company equity flow appears twice on one date.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const flows = JSON.parse(
  readFileSync(join(__dirname, "..", "src", "lib", "data", "seed", "flows.json"), "utf8")
) as {
  id: string;
  sourceId: string;
  targetId: string;
  amountUsd: number;
  type: string;
  date: string;
  roundId?: string;
}[];

const equityTypes = new Set(["investment", "grant"]);
const byKey = new Map<string, typeof flows>();

for (const f of flows) {
  if (!equityTypes.has(f.type)) continue;
  const key = `${f.sourceId}|${f.targetId}|${f.date}`;
  const list = byKey.get(key) ?? [];
  list.push(f);
  byKey.set(key, list);
}

const dupes = [...byKey.entries()].filter(([, list]) => list.length > 1);

if (dupes.length > 0) {
  console.error(`FAIL: ${dupes.length} duplicate equity flows (same investor, company, date):`);
  for (const [key, list] of dupes) {
    console.error(`  ${key}`);
    for (const f of list) {
      console.error(`    - ${f.id}: $${(f.amountUsd / 1e9).toFixed(2)}B (${f.roundId ? "round" : "deal"})`);
    }
  }
  process.exit(1);
}

console.log(`OK: ${flows.length} flows — no duplicate equity entries per investor/company/date`);
