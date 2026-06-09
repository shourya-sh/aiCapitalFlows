/**
 * ETL entrypoint. Runs the ingestion pipeline across all configured sources and
 * either writes JSON seed files (default) or persists to Supabase (--supabase).
 *
 *   npm run ingest              # write src/lib/data/seed/*.json
 *   npm run ingest -- --supabase  # upsert into Supabase
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runPipeline } from "../src/lib/etl/pipeline";
import { persistDataset } from "../src/lib/supabase/sync";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const useSupabase = process.argv.includes("--supabase");
  const { dataset, perSource } = await runPipeline();

  console.log("Ingestion report:");
  for (const s of perSource) {
    console.log(`  ${s.live ? "●" : "○"} ${s.label.padEnd(32)} ${s.entities} entities · ${s.flows} flows`);
  }

  if (useSupabase) {
    const ok = await persistDataset(dataset);
    console.log(ok ? "Persisted to Supabase." : "Supabase not configured — set env vars first.");
    return;
  }

  const outDir = join(__dirname, "..", "src", "lib", "data", "seed");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entities.json"), JSON.stringify(dataset.entities, null, 2));
  writeFileSync(join(outDir, "rounds.json"), JSON.stringify(dataset.rounds, null, 2));
  writeFileSync(join(outDir, "flows.json"), JSON.stringify(dataset.flows, null, 2));
  writeFileSync(join(outDir, "ownership.json"), JSON.stringify(dataset.ownership, null, 2));
  writeFileSync(
    join(outDir, "meta.json"),
    JSON.stringify(
      {
        generatedAt: dataset.generatedAt,
        counts: {
          entities: dataset.entities.length,
          rounds: dataset.rounds.length,
          flows: dataset.flows.length,
        },
      },
      null,
      2
    )
  );
  console.log(
    `Wrote seed → ${dataset.entities.length} entities, ${dataset.rounds.length} rounds, ${dataset.flows.length} flows`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
