import type { ObservatoryDataset } from "../types";
import { getSupabaseAdmin } from "./client";

/**
 * Bridges the ETL output to Supabase. `persistDataset` upserts a full dataset;
 * `loadDataset` rehydrates it. Both no-op / return null when Supabase isn't
 * configured, so the JSON-seed fallback keeps working in development.
 */

export async function persistDataset(dataset: ObservatoryDataset): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;

  const { error: eEnt } = await supabase.from("entities").upsert(dataset.entities, { onConflict: "id" });
  const { error: eRound } = await supabase.from("funding_rounds").upsert(dataset.rounds, { onConflict: "id" });
  const { error: eFlow } = await supabase.from("capital_flows").upsert(dataset.flows, { onConflict: "id" });

  if (eEnt || eRound || eFlow) {
    console.error("Supabase persist error", { eEnt, eRound, eFlow });
    return false;
  }
  return true;
}

export async function loadDataset(): Promise<ObservatoryDataset | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const [{ data: entities }, { data: rounds }, { data: flows }] = await Promise.all([
    supabase.from("entities").select("*"),
    supabase.from("funding_rounds").select("*"),
    supabase.from("capital_flows").select("*"),
  ]);

  if (!entities || !rounds || !flows) return null;
  return {
    entities,
    rounds,
    flows,
    generatedAt: new Date().toISOString(),
  } as ObservatoryDataset;
}
