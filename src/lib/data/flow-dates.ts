import type { CapitalFlow, FundingRound, SourceCitation } from "../types";

/** Known corrections for placeholder month-start dates (YYYY-MM-01). */
export const CANONICAL_DATES: Record<string, string> = {
  // targetId|date prefix or full key
  "anthropic|2024-10-01": "2024-10-22",
  "safe-superintelligence|2025-03-01": "2025-04-11",
  "anduril|2024-08-01": "2024-08-07",
  "waymo|2024-10-01": "2024-10-23",
  "mistral-ai|microsoft|2024-04-01": "2024-02-26",
  "google|waymo|2024-10-01": "2024-10-23",
  "anthropic|google|2024-10-01": "2024-10-22",
  "coreweave|2024-05-01": "2024-05-17",
};

function primaryCitation(citations?: SourceCitation[]): SourceCitation | undefined {
  if (!citations?.length) return undefined;
  return (
    citations.find((c) => c.type === "press-release" || c.type === "news") ?? citations[0]
  );
}

function isPlaceholderDate(date: string): boolean {
  return /-\d{2}-01$/.test(date);
}

/**
 * Prefer citation announcement date or canonical map when the stored date is a
 * month placeholder or known to be wrong.
 */
export function resolveFlowDate(
  flow: Pick<CapitalFlow, "sourceId" | "targetId" | "date" | "citations">
): string {
  const pairKey = `${flow.sourceId}|${flow.targetId}|${flow.date}`;
  const targetKey = `${flow.targetId}|${flow.date}`;
  const canonical = CANONICAL_DATES[pairKey] ?? CANONICAL_DATES[targetKey];
  if (canonical) return canonical;

  const cite = primaryCitation(flow.citations);
  if (cite?.publishedAt && isPlaceholderDate(flow.date) && cite.publishedAt !== flow.date) {
    return cite.publishedAt;
  }
  return flow.date;
}

export function resolveRoundDate(round: Pick<FundingRound, "targetId" | "date" | "citations">): string {
  const key = `${round.targetId}|${round.date}`;
  const canonical = CANONICAL_DATES[key];
  if (canonical) return canonical;

  const cite = primaryCitation(round.citations);
  if (cite?.publishedAt && isPlaceholderDate(round.date) && cite.publishedAt !== round.date) {
    return cite.publishedAt;
  }
  return round.date;
}
