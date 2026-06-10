import { EMPTY_RESULT, type IngestionSource } from "../types";

/**
 * NVIDIA investor-relations + datacenter-expansion connector (stub). Tracks
 * accelerator supply agreements, strategic stakes, and announced datacenter
 * campus buildouts to populate `supply` and `compute-deal` flows.
 *
 * To go live: scrape/ingest NVIDIA IR releases, hyperscaler capex disclosures,
 * and datacenter expansion announcements.
 */
export const infrastructureSource: IngestionSource = {
  id: "infrastructure",
  label: "NVIDIA IR & Datacenter Expansion",
  description: "Accelerator supply deals, strategic stakes, and datacenter buildouts.",
  docsUrl: "https://investor.nvidia.com",
  live: false,
  async fetch() {
    return EMPTY_RESULT;
  },
};

/**
 * Energy-provider connector (stub). Ingests power purchase agreements and
 * datacenter energy contracts from utilities (Constellation, Vistra, NextEra)
 * to populate `energy-contract` flows and surface power bottlenecks.
 */
export const energySource: IngestionSource = {
  id: "energy",
  label: "Energy Provider Reports",
  description: "Power purchase agreements and datacenter energy contracts.",
  docsUrl: "https://www.eia.gov/opendata/",
  live: false,
  async fetch() {
    return EMPTY_RESULT;
  },
};

/**
 * Press-release / funding-announcement connector — see `sources/press.ts`.
 * Kept here as a re-export for backwards compatibility.
 */
export { pressSource } from "./press";
