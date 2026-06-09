import { generateDataset } from "../../data/generate";
import type { IngestionSource } from "../types";

/**
 * Reference connector backed by the deterministic mock generator. This is what
 * powers the app today. Real connectors below follow the same contract — swap
 * `seedSource` out of the registry for live sources to go to production.
 */
export const seedSource: IngestionSource = {
  id: "seed",
  label: "Seed Generator",
  description: "Deterministic, research-informed mock dataset for the AI economy (2024 – present).",
  live: true,
  async fetch() {
    const ds = generateDataset();
    return {
      entities: ds.entities,
      rounds: ds.rounds,
      flows: ds.flows,
      ownership: ds.ownership,
    };
  },
};
