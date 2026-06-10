import type { CapitalFlow, SourceCitation } from "../../types";
import { slugifyId } from "../normalize";
import { EMPTY_RESULT, type IngestionContext, type IngestionResult, type IngestionSource } from "../types";

/**
 * Press-release and news connector. Tracks structured breaking deals plus RSS
 * headlines from major AI funding newswires. No API key required.
 */

interface BreakingDeal {
  sourceId: string;
  targetId: string;
  amountUsd: number;
  type: CapitalFlow["type"];
  date: string;
  dealStructure?: CapitalFlow["dealStructure"];
  summary: string;
  citations: SourceCitation[];
}

function cite(
  id: string,
  title: string,
  url: string,
  publisher: string,
  publishedAt: string,
  type: SourceCitation["type"] = "news"
): SourceCitation {
  return { id, title, url, publisher, publishedAt, type };
}

/** Manually tracked deals announced before the next curated seed update. */
export const BREAKING_DEALS: BreakingDeal[] = [
  {
    sourceId: "google",
    targetId: "anthropic",
    amountUsd: 35e9,
    type: "compute-deal",
    date: "2026-06-09",
    dealStructure: "compute-capacity-agreement",
    summary:
      "Google backstopped a $35B TPU lease financing package for Anthropic across five U.S. data centers (Apollo/Blackstone-led SPV).",
    citations: [
      cite(
        "apollo-xpv-2026",
        "Apollo Leads $35 Billion Capital Solution for Broadcom AI XPV Platform",
        "https://ir.apollo.com/news-events/press-releases/detail/629/apollo-leads-35-billion-capital-solution-for-broadcom-ai",
        "Apollo Global Management",
        "2026-06-09",
        "press-release"
      ),
      cite(
        "cb-anthropic-infra",
        "Anthropic - Funding & partnerships",
        "https://www.crunchbase.com/organization/anthropic/company_financials",
        "Crunchbase",
        "2026-06-09",
        "filing"
      ),
    ],
  },
  {
    sourceId: "apollo-global-management",
    targetId: "anthropic",
    amountUsd: 35e9,
    type: "investment",
    date: "2026-06-09",
    dealStructure: "debt-financing",
    summary: "Apollo led the $35B private credit package financing Google TPU capacity for Anthropic.",
    citations: [
      cite(
        "apollo-xpv-2026",
        "Apollo Leads $35 Billion Capital Solution for Broadcom AI XPV Platform",
        "https://ir.apollo.com/news-events/press-releases/detail/629/apollo-leads-35-billion-capital-solution-for-broadcom-ai",
        "Apollo Global Management",
        "2026-06-09",
        "press-release"
      ),
    ],
  },
  {
    sourceId: "blackstone",
    targetId: "anthropic",
    amountUsd: 35e9,
    type: "investment",
    date: "2026-06-09",
    dealStructure: "debt-financing",
    summary: "Blackstone co-led the $35B chip financing SPV for Anthropic's Google TPU expansion.",
    citations: [
      cite(
        "apollo-xpv-2026",
        "Apollo Leads $35 Billion Capital Solution for Broadcom AI XPV Platform",
        "https://ir.apollo.com/news-events/press-releases/detail/629/apollo-leads-35-billion-capital-solution-for-broadcom-ai",
        "Apollo Global Management",
        "2026-06-09",
        "press-release"
      ),
    ],
  },
];

const RSS_FEEDS = [
  {
    label: "Crunchbase News AI",
    url: "https://news.crunchbase.com/sections/ai/feed/",
  },
  {
    label: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
  },
] as const;

/** Entity name → id aliases for RSS headline matching. */
const ENTITY_ALIASES: Record<string, string> = {
  openai: "openai",
  anthropic: "anthropic",
  google: "google",
  microsoft: "microsoft",
  meta: "meta",
  nvidia: "nvidia",
  xai: "xai",
  mistral: "mistral-ai",
  databricks: "databricks",
  coreweave: "coreweave",
  perplexity: "perplexity",
  cursor: "cursor",
  harvey: "harvey",
  sierra: "sierra",
  figure: "figure",
  cohere: "cohere",
};

function parseAmount(text: string): number | undefined {
  const m = text.match(/\$\s*([\d,.]+)\s*(trillion|billion|million|t|b|m)\b/i);
  if (!m) return undefined;
  const n = parseFloat(m[1].replace(/,/g, ""));
  if (Number.isNaN(n)) return undefined;
  const unit = m[2].toLowerCase();
  if (unit.startsWith("t")) return n * 1e12;
  if (unit.startsWith("b")) return n * 1e9;
  return n * 1e6;
}

function parseDate(isoOrRss: string): string {
  const d = new Date(isoOrRss);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function extractRssItems(xml: string): { title: string; link: string; pubDate: string; description: string }[] {
  const items: { title: string; link: string; pubDate: string; description: string }[] = [];
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  for (const block of blocks) {
    const title = block.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)?.[1]?.trim() ?? "";
    const link = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim() ?? "";
    const pubDate = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim() ?? "";
    const description =
      block.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i)?.[1]?.trim() ?? "";
    if (title) items.push({ title, link, pubDate, description });
  }
  return items;
}

function detectEntities(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const [alias, id] of Object.entries(ENTITY_ALIASES)) {
    if (lower.includes(alias)) found.add(id);
  }
  return [...found];
}

async function fetchRssDeals(since?: string): Promise<BreakingDeal[]> {
  const deals: BreakingDeal[] = [];
  const sinceMs = since ? new Date(since).getTime() : 0;

  for (const feed of RSS_FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: { "User-Agent": "AI-Capital-Flow-Observatory/1.0" },
        next: { revalidate: 0 },
      });
      if (!res.ok) continue;
      const xml = await res.text();
      const items = extractRssItems(xml).slice(0, 40);

      for (const item of items) {
        const text = `${item.title} ${item.description}`.replace(/<[^>]+>/g, " ");
        const pubMs = new Date(item.pubDate).getTime();
        if (sinceMs && pubMs < sinceMs) continue;

        const amount = parseAmount(text);
        if (!amount || amount < 50e6) continue;

        const entities = detectEntities(text);
        if (entities.length < 2) continue;

        const fundingVerbs = /raises?|raised|funding|investment|deal|partnership|financing|backed|closes?|closed/i;
        if (!fundingVerbs.test(text)) continue;

        const targetId = entities.find((id) => id !== "google" && id !== "microsoft" && id !== "nvidia") ?? entities[0];
        const sourceId = entities.find((id) => id !== targetId) ?? "sequoia-capital";
        const date = parseDate(item.pubDate);

        deals.push({
          sourceId,
          targetId,
          amountUsd: amount,
          type: /partnership|deal with|agreement/i.test(text) ? "partnership" : "investment",
          date,
          summary: item.title,
          citations: [
            cite(slugifyId(item.link), item.title, item.link, feed.label, date, "news"),
          ],
        });
      }
    } catch (err) {
      console.warn(`[press] RSS fetch failed for ${feed.label}:`, err);
    }
  }

  return deals;
}

function breakingToFlows(deals: BreakingDeal[], since?: string): CapitalFlow[] {
  const sinceMs = since ? new Date(since).getTime() : 0;
  return deals
    .filter((d) => !sinceMs || new Date(d.date).getTime() >= sinceMs)
    .map((d, i) => ({
      id: `press-flow-${d.sourceId}-${d.targetId}-${d.date}-${i}`,
      sourceId: d.sourceId,
      targetId: d.targetId,
      amountUsd: d.amountUsd,
      type: d.type,
      date: d.date,
      dealStructure: d.dealStructure,
      verified: true,
      summary: d.summary,
      citations: d.citations,
    }));
}

export const pressSource: IngestionSource = {
  id: "press",
  label: "Press Releases & News RSS",
  description: "Breaking AI deals from press releases and funding newswires.",
  live: true,
  async fetch(ctx: IngestionContext): Promise<IngestionResult> {
    const rssDeals = await fetchRssDeals(ctx.since);
    const allDeals = [...BREAKING_DEALS, ...rssDeals];
    const flows = breakingToFlows(allDeals, ctx.since);
    return { entities: [], rounds: [], flows };
  },
};
