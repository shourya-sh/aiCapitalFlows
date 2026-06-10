import { entityById } from "./index";
import type { EntityDetail } from "./detail";
import { resolveFlowDate, resolveRoundDate } from "./flow-dates";
import { formatUsd } from "../utils";
import type { SourceCitation } from "../types";

export interface NewsItem {
  id: string;
  date: string;
  headline: string;
  source: string;
  tag: string;
  tagColor: "green" | "blue" | "yellow" | "purple" | "red" | "cyan";
  /** Present only when backed by a verified public source. */
  url?: string;
}

const UNSOURCED_LABEL = "Dashboard data";

function primaryCitation(citations?: SourceCitation[]): SourceCitation | undefined {
  if (!citations?.length) return undefined;
  return (
    citations.find((c) => c.type === "news" || c.type === "press-release") ??
    citations[0]
  );
}

function sourceFromCitation(citation?: SourceCitation): string {
  return citation?.publisher ?? UNSOURCED_LABEL;
}

function relativeTime(dateStr: string): string {
  const now = new Date("2026-06-10").getTime();
  const then = new Date(dateStr).getTime();
  const days = Math.floor((now - then) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export { relativeTime };

/** Overview feed — only sourced rounds and verified movements (no fabricated dates). */
export function generateNewsForEntity(detail: EntityDetail): NewsItem[] {
  const { entity, rounds, movements } = detail;
  const items: NewsItem[] = [];
  let seq = 0;

  for (const r of rounds.slice(-5)) {
    const lead = r.leadInvestorId ? entityById.get(r.leadInvestorId) : null;
    const leadStr = lead ? `, led by ${lead.name}` : "";
    const valStr = r.valuationUsd ? ` at a ${formatUsd(r.valuationUsd)} valuation` : "";
    const citation = primaryCitation(r.citations);
    const date = resolveRoundDate(r);
    items.push({
      id: `${entity.id}-round-${seq++}`,
      date,
      headline: `${entity.name} closes ${formatUsd(r.amountUsd)} ${r.roundType}${valStr}${leadStr}`,
      source: sourceFromCitation(citation),
      tag: r.roundType,
      tagColor: "green",
      url: citation?.url,
    });
  }

  const notableMovements = movements
    .filter((m) => m.verified && m.citations?.length)
    .slice(0, 6);
  for (const m of notableMovements) {
    const verb =
      m.type === "compute-deal" ? "signs compute capacity deal with"
      : m.type === "supply" ? "secures hardware supply from"
      : m.type === "energy-contract" ? "signs power agreement with"
      : m.type === "partnership" ? "enters strategic partnership with"
      : "closes deal with";
    const citation = primaryCitation(m.citations);
    items.push({
      id: `${entity.id}-move-${seq++}`,
      date: m.date,
      headline: m.summary ?? `${entity.name} ${verb} ${m.counterpartyName} (${formatUsd(m.amount)})`,
      source: sourceFromCitation(citation),
      tag: m.dealLabel,
      tagColor: m.direction === "in" ? "cyan" : "yellow",
      url: citation?.url,
    });
  }

  items.sort((a, b) => b.date.localeCompare(a.date));
  return items.slice(0, 8);
}
