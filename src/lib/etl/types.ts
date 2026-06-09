import type { CapitalFlow, Entity, FundingRound, OwnershipSnapshot } from "../types";

/**
 * ETL contracts.
 *
 * Every external data source (Crunchbase, SEC, OECD, energy reports, …)
 * implements `IngestionSource`. Each connector is responsible for its own
 * vendor-specific mapping and returns records already shaped into the domain
 * model. The pipeline then merges, dedupes, and persists the result.
 */

export interface IngestionContext {
  /** Only fetch records on/after this ISO date (incremental sync). */
  since?: string;
  /** Per-source API key, injected from environment. */
  apiKey?: string;
  /** Hard cap on records for dev / rate-limit safety. */
  limit?: number;
}

export interface IngestionResult {
  entities: Entity[];
  rounds: FundingRound[];
  flows: CapitalFlow[];
  ownership?: OwnershipSnapshot[];
}

export interface IngestionSource {
  id: string;
  label: string;
  description: string;
  /** Documentation / API endpoint reference for the live integration. */
  docsUrl?: string;
  /** Whether this connector has a live implementation (vs. stub). */
  live: boolean;
  fetch(ctx: IngestionContext): Promise<IngestionResult>;
}

export const EMPTY_RESULT: IngestionResult = { entities: [], rounds: [], flows: [], ownership: [] };
