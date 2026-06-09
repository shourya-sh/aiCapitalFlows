import type { ObservatoryDataset, OwnershipSnapshot } from "../types";
import { dedupeEntities, dedupeFlows, dedupeRounds } from "./normalize";
import { crunchbaseSource } from "./sources/crunchbase";
import { energySource, infrastructureSource, pressSource } from "./sources/infrastructure";
import { oecdSource } from "./sources/oecd";
import { secSource } from "./sources/sec";
import { seedSource } from "./sources/seed";
import type { IngestionContext, IngestionSource } from "./types";

/**
 * The ingestion registry. Order matters for dedupe precedence (later sources
 * override earlier scalar fields). Today only `seedSource` is live; flip the
 * `live` flag and implement `fetch` on the others to bring them online.
 */
export const SOURCES: IngestionSource[] = [
  seedSource,
  crunchbaseSource,
  secSource,
  oecdSource,
  infrastructureSource,
  energySource,
  pressSource,
];

export interface PipelineReport {
  dataset: ObservatoryDataset;
  perSource: { id: string; label: string; live: boolean; entities: number; flows: number }[];
}

/**
 * Runs every (live) source, normalizes + dedupes the union, and returns a single
 * coherent dataset. This is the seam between mock and production data: the output
 * shape is identical regardless of which sources are enabled.
 */
export async function runPipeline(ctx: IngestionContext = {}): Promise<PipelineReport> {
  const perSource: PipelineReport["perSource"] = [];
  const allEntities = [];
  const allRounds = [];
  const allFlows = [];
  const allOwnership: OwnershipSnapshot[] = [];

  for (const source of SOURCES) {
    if (!source.live) {
      perSource.push({ id: source.id, label: source.label, live: false, entities: 0, flows: 0 });
      continue;
    }
    const result = await source.fetch(ctx);
    allEntities.push(...result.entities);
    allRounds.push(...result.rounds);
    allFlows.push(...result.flows);
    if (result.ownership?.length) allOwnership.push(...result.ownership);
    perSource.push({
      id: source.id,
      label: source.label,
      live: true,
      entities: result.entities.length,
      flows: result.flows.length,
    });
  }

  const dataset: ObservatoryDataset = {
    entities: dedupeEntities(allEntities),
    rounds: dedupeRounds(allRounds),
    flows: dedupeFlows(allFlows),
    ownership: allOwnership,
    generatedAt: new Date().toISOString(),
  };

  return { dataset, perSource };
}
