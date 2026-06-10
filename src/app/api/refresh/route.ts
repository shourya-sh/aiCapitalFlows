import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { runPipeline } from "@/lib/etl/pipeline";
import { computeGraphLayout } from "@/lib/metrics/graph-layout";
import type { ObservatoryDataset } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

function persistSeed(dataset: ObservatoryDataset) {
  if (process.env.NODE_ENV !== "development") return;
  const outDir = join(process.cwd(), "src", "lib", "data", "seed");
  mkdirSync(outDir, { recursive: true });
  const graph = computeGraphLayout(dataset.entities, dataset.flows);
  writeFileSync(join(outDir, "entities.json"), JSON.stringify(dataset.entities, null, 2));
  writeFileSync(join(outDir, "rounds.json"), JSON.stringify(dataset.rounds, null, 2));
  writeFileSync(join(outDir, "flows.json"), JSON.stringify(dataset.flows, null, 2));
  writeFileSync(join(outDir, "ownership.json"), JSON.stringify(dataset.ownership, null, 2));
  writeFileSync(
    join(outDir, "graph.json"),
    JSON.stringify({ nodes: graph.nodes, edges: graph.edges, generatedAt: dataset.generatedAt }, null, 2)
  );
  writeFileSync(
    join(outDir, "meta.json"),
    JSON.stringify(
      {
        generatedAt: dataset.generatedAt,
        counts: {
          entities: dataset.entities.length,
          rounds: dataset.rounds.length,
          flows: dataset.flows.length,
          graphNodes: graph.nodes.length,
          graphEdges: graph.edges.length,
        },
      },
      null,
      2
    )
  );
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { since?: string; persist?: boolean };
    const priorFlowCount = body.since ? undefined : 0;

    const { dataset, perSource } = await runPipeline({
      since: body.since,
      limit: 300,
    });

    if (body.persist) persistSeed(dataset);

    const report = {
      generatedAt: dataset.generatedAt,
      counts: {
        entities: dataset.entities.length,
        rounds: dataset.rounds.length,
        flows: dataset.flows.length,
      },
      newFlows: priorFlowCount === undefined ? 0 : Math.max(0, dataset.flows.length - priorFlowCount),
      sources: perSource,
    };

    return NextResponse.json({ dataset, report });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Refresh failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const { dataset, perSource } = await runPipeline({ limit: 50 });
  return NextResponse.json({
    generatedAt: dataset.generatedAt,
    counts: {
      entities: dataset.entities.length,
      rounds: dataset.rounds.length,
      flows: dataset.flows.length,
    },
    sources: perSource,
  });
}
