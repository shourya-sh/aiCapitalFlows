import type { Entity, FundingRound } from "../../types";
import { EMPTY_RESULT, type IngestionSource } from "../types";
import { normalizeRegion, normalizeSector, parseUsd, slugifyId } from "../normalize";

/**
 * Crunchbase connector — pulls live funding rounds when CRUNCHBASE_API_KEY is set.
 * Maps vendor payloads into the domain model; citations are attached from Crunchbase URLs.
 */

interface CrunchbaseOrg {
  identifier: { value: string; permalink?: string };
  short_description?: string;
  location_identifiers?: { value: string }[];
  categories?: { value: string }[];
  funding_total?: { value_usd: number };
  founded_on?: { value: string };
}

interface CrunchbaseRound {
  identifier: { value: string; permalink?: string };
  funded_organization_identifier: { value: string; permalink?: string };
  announced_on: { value: string };
  investment_type: string;
  money_raised?: { value_usd: number };
  investor_identifiers?: { value: string; permalink?: string }[];
}

export function mapOrganization(org: CrunchbaseOrg): Entity {
  const country = org.location_identifiers?.at(-1)?.value ?? "United States";
  return {
    id: slugifyId(org.identifier.permalink ?? org.identifier.value),
    name: org.identifier.value,
    sector: normalizeSector(org.categories?.[0]?.value ?? "ai"),
    description: org.short_description ?? "",
    headquarters: org.location_identifiers?.map((l) => l.value).join(", ") ?? country,
    country,
    region: normalizeRegion(country),
    founded: org.founded_on ? new Date(org.founded_on.value).getFullYear() : undefined,
    totalFundingUsd: org.funding_total?.value_usd ?? 0,
    tags: org.categories?.slice(0, 3).map((c) => c.value) ?? [],
    dataQuality: "verified",
  };
}

export function mapFundingRound(round: CrunchbaseRound): FundingRound {
  const permalink = round.identifier.permalink ?? slugifyId(round.identifier.value);
  return {
    id: slugifyId(round.identifier.value),
    targetId: slugifyId(
      round.funded_organization_identifier.permalink ??
        round.funded_organization_identifier.value
    ),
    date: round.announced_on.value,
    roundType: "Strategic",
    amountUsd: round.money_raised?.value_usd ?? parseUsd(0),
    leadInvestorId: round.investor_identifiers?.[0]
      ? slugifyId(round.investor_identifiers[0].permalink ?? round.investor_identifiers[0].value)
      : undefined,
    investorIds:
      round.investor_identifiers?.map((i) =>
        slugifyId(i.permalink ?? i.value)
      ) ?? [],
    verified: true,
    summary: `${round.identifier.value} — ${round.investment_type} round per Crunchbase.`,
    citations: [
      {
        id: `cb-${permalink}`,
        title: round.identifier.value,
        url: `https://www.crunchbase.com/funding_round/${permalink}`,
        publisher: "Crunchbase",
        publishedAt: round.announced_on.value,
        type: "crunchbase",
      },
    ],
  };
}

async function fetchCrunchbaseRounds(apiKey: string, limit = 200): Promise<CrunchbaseRound[]> {
  const res = await fetch(
    `https://api.crunchbase.com/v4/data/searches/funding_rounds?user_key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        field_ids: [
          "identifier",
          "funded_organization_identifier",
          "announced_on",
          "investment_type",
          "money_raised",
          "investor_identifiers",
        ],
        query: [
          {
            type: "predicate",
            field_id: "announced_on",
            operator_id: "gte",
            values: ["2024-01-01"],
          },
        ],
        limit,
        order: [{ field_id: "announced_on", sort: "desc" }],
      }),
    }
  );
  if (!res.ok) throw new Error(`Crunchbase API ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { entities?: CrunchbaseRound[] };
  return json.entities ?? [];
}

export const crunchbaseSource: IngestionSource = {
  id: "crunchbase",
  label: "Crunchbase",
  description: "Company profiles, funding rounds, and investor relationships.",
  docsUrl: "https://data.crunchbase.com/docs",
  live: Boolean(process.env.CRUNCHBASE_API_KEY),
  async fetch(ctx) {
    const apiKey = ctx.apiKey ?? process.env.CRUNCHBASE_API_KEY;
    if (!apiKey) return EMPTY_RESULT;

    try {
      const rawRounds = await fetchCrunchbaseRounds(apiKey, ctx.limit ?? 200);
      const rounds = rawRounds.map(mapFundingRound);
      const entities: Entity[] = [];
      const flows = rounds.flatMap((r) =>
        r.investorIds.map((invId, i) => ({
          id: `cb-flow-${r.id}-${i}`,
          sourceId: invId,
          targetId: r.targetId,
          amountUsd: r.amountUsd / Math.max(r.investorIds.length, 1),
          type: "investment" as const,
          date: r.date,
          roundId: r.id,
          verified: true,
          summary: r.summary,
          citations: r.citations,
        }))
      );
      return { entities, rounds, flows };
    } catch (err) {
      console.warn("[crunchbase] fetch failed:", err);
      return EMPTY_RESULT;
    }
  },
};
