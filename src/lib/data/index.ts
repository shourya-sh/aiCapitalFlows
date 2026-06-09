import type { CapitalFlow, Entity, FundingRound, ObservatoryDataset, OwnershipSnapshot } from "../types";
import entitiesJson from "./seed/entities.json";
import roundsData from "./seed/rounds.json";
import flowsData from "./seed/flows.json";
import ownershipData from "./seed/ownership.json";
import metaData from "./seed/meta.json";

/**
 * Runtime data access layer.
 *
 * Loads the JSON seed produced by `npm run seed`. To switch to live data, point
 * these imports at the output of the ETL pipeline (or fetch from Supabase) — the
 * rest of the app only depends on the typed accessors exported here.
 */

const entities = entitiesJson as Entity[];
const rounds = roundsData as FundingRound[];
const flows = flowsData as CapitalFlow[];
const ownership = ownershipData as OwnershipSnapshot[];

export const dataset: ObservatoryDataset = {
  entities,
  rounds,
  flows,
  ownership,
  generatedAt: (metaData as { generatedAt: string }).generatedAt,
};

// ---- indices ----
export const entityById = new Map(entities.map((e) => [e.id, e]));
export const roundById = new Map(rounds.map((r) => [r.id, r]));

export function getEntity(id: string): Entity | undefined {
  return entityById.get(id);
}

export function getEntityName(id: string): string {
  return entityById.get(id)?.name ?? id;
}

/** Capital flows where the entity is the recipient. */
export function inflowsTo(entityId: string): CapitalFlow[] {
  return flows.filter((f) => f.targetId === entityId);
}

/** Capital flows where the entity is the source. */
export function outflowsFrom(entityId: string): CapitalFlow[] {
  return flows.filter((f) => f.sourceId === entityId);
}

/** Funding rounds raised by a company. */
export function roundsForTarget(entityId: string): FundingRound[] {
  return rounds
    .filter((r) => r.targetId === entityId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Distinct funders / partners that have capital flowing into an entity. */
export function investorsOf(entityId: string): Entity[] {
  const funderTypes = new Set(["investment", "grant", "partnership"]);
  const ids = new Set(
    flows
      .filter((f) => f.targetId === entityId && funderTypes.has(f.type))
      .map((f) => f.sourceId)
  );
  return [...ids].map((id) => entityById.get(id)).filter(Boolean) as Entity[];
}

/** Companies an investor (or any funder) has backed. */
export function portfolioOf(entityId: string): Entity[] {
  const ids = new Set(outflowsFrom(entityId).map((f) => f.targetId));
  return [...ids].map((id) => entityById.get(id)).filter(Boolean) as Entity[];
}

export function getOwnershipSnapshot(entityId: string): OwnershipSnapshot | undefined {
  return ownership.find((o) => o.entityId === entityId);
}

export function verificationStats(): { verified: number; total: number; pct: number } {
  const verified = flows.filter((f) => f.verified).length;
  return { verified, total: flows.length, pct: flows.length ? Math.round((verified / flows.length) * 100) : 0 };
}
