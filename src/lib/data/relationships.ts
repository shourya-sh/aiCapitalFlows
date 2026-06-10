import type { DealStructure, FlowType, RoundType } from "../types";

/**
 * Research-informed, manually curated capital relationships.
 * Every graph edge is derived from this file — no random generation.
 */

const B = 1e9;
const M = 1e6;

export interface CuratedRound {
  targetId: string;
  date: string;
  roundType: RoundType;
  amountUsd: number;
  valuationUsd?: number;
  leadInvestorId?: string;
  investors: { investorId: string; amountUsd: number }[];
}

export interface CuratedDeal {
  sourceId: string;
  targetId: string;
  amountUsd: number;
  type: FlowType;
  date: string;
  dealStructure?: DealStructure;
}

function d(
  source: string,
  target: string,
  amount: number,
  type: FlowType,
  date: string,
  structure?: DealStructure
): CuratedDeal {
  return { sourceId: source, targetId: target, amountUsd: amount, type, date, dealStructure: structure };
}

// ───────────────────────────── Funding rounds ─────────────────────────────

export const CURATED_ROUNDS: CuratedRound[] = [
  // ── Foundation models ──
  { targetId: "openai", date: "2024-10-02", roundType: "Series E+", amountUsd: 6.6 * B, valuationUsd: 157 * B, leadInvestorId: "thrive-capital", investors: [
    { investorId: "thrive-capital", amountUsd: 1.2 * B }, { investorId: "microsoft", amountUsd: 1.5 * B },
    { investorId: "nvidia", amountUsd: 1 * B }, { investorId: "softbank", amountUsd: 1 * B },
    { investorId: "mgx", amountUsd: 500 * M }, { investorId: "tiger-global", amountUsd: 400 * M },
    { investorId: "coatue", amountUsd: 400 * M }, { investorId: "sequoia-capital", amountUsd: 300 * M },
    { investorId: "khosla-ventures", amountUsd: 300 * M },
  ]},
  { targetId: "openai", date: "2025-03-31", roundType: "Growth", amountUsd: 40 * B, valuationUsd: 300 * B, leadInvestorId: "softbank", investors: [
    { investorId: "softbank", amountUsd: 30 * B }, { investorId: "mgx", amountUsd: 7 * B },
    { investorId: "microsoft", amountUsd: 2 * B }, { investorId: "coatue", amountUsd: 500 * M },
  ]},
  { targetId: "anthropic", date: "2026-05-28", roundType: "Series H", amountUsd: 65 * B, valuationUsd: 965 * B, leadInvestorId: "sequoia-capital", investors: [
    { investorId: "sequoia-capital", amountUsd: 10 * B }, { investorId: "greenoaks", amountUsd: 10 * B },
    { investorId: "coatue", amountUsd: 8 * B }, { investorId: "iconiq", amountUsd: 8 * B },
    { investorId: "amazon", amountUsd: 5 * B }, { investorId: "tiger-global", amountUsd: 5 * B },
    { investorId: "fidelity", amountUsd: 5 * B }, { investorId: "nvidia", amountUsd: 5 * B },
    { investorId: "microsoft", amountUsd: 5 * B }, { investorId: "softbank", amountUsd: 4 * B },
  ]},
  { targetId: "anthropic", date: "2026-02-01", roundType: "Series G", amountUsd: 30 * B, valuationUsd: 380 * B, leadInvestorId: "iconiq", investors: [
    { investorId: "iconiq", amountUsd: 6 * B }, { investorId: "lightspeed-venture-partners", amountUsd: 5 * B },
    { investorId: "salesforce", amountUsd: 4 * B }, { investorId: "google", amountUsd: 4 * B },
    { investorId: "amazon", amountUsd: 4 * B }, { investorId: "coatue", amountUsd: 3 * B },
    { investorId: "tiger-global", amountUsd: 2 * B }, { investorId: "sequoia-capital", amountUsd: 2 * B },
  ]},
  { targetId: "anthropic", date: "2025-11-18", roundType: "Strategic", amountUsd: 15 * B, valuationUsd: 350 * B, leadInvestorId: "nvidia", investors: [
    { investorId: "nvidia", amountUsd: 10 * B }, { investorId: "microsoft", amountUsd: 5 * B },
  ]},
  // Amazon's $4B tranche (Nov 2024) completing $8B total — Amazon press release, not a multi-investor VC round.
  { targetId: "anthropic", date: "2024-11-22", roundType: "Strategic", amountUsd: 4 * B, valuationUsd: 18.4 * B, leadInvestorId: "amazon", investors: [
    { investorId: "amazon", amountUsd: 4 * B },
  ]},
  { targetId: "anthropic", date: "2024-10-22", roundType: "Strategic", amountUsd: 1 * B, valuationUsd: 18.4 * B, leadInvestorId: "google", investors: [
    { investorId: "google", amountUsd: 1 * B },
  ]},
  // Amazon's first $4B tranche is the 2023-09-25 strategic deal — not repeated here.
  { targetId: "anthropic", date: "2024-03-27", roundType: "Series D", amountUsd: 1.5 * B, valuationUsd: 18.4 * B, leadInvestorId: "google", investors: [
    { investorId: "google", amountUsd: 500 * M },
    { investorId: "salesforce", amountUsd: 300 * M }, { investorId: "lightspeed-venture-partners", amountUsd: 250 * M },
    { investorId: "iconiq", amountUsd: 200 * M }, { investorId: "tiger-global", amountUsd: 200 * M },
  ]},
  { targetId: "xai", date: "2025-07-01", roundType: "Series E+", amountUsd: 10 * B, valuationUsd: 80 * B, leadInvestorId: "andreessen-horowitz", investors: [
    { investorId: "andreessen-horowitz", amountUsd: 2 * B }, { investorId: "sequoia-capital", amountUsd: 1.5 * B },
    { investorId: "fidelity", amountUsd: 1.5 * B }, { investorId: "mgx", amountUsd: 2 * B },
    { investorId: "blackrock", amountUsd: 1 * B }, { investorId: "nvidia", amountUsd: 1 * B },
  ]},
  { targetId: "xai", date: "2024-05-26", roundType: "Series B", amountUsd: 6 * B, valuationUsd: 24 * B, leadInvestorId: "andreessen-horowitz", investors: [
    { investorId: "andreessen-horowitz", amountUsd: 1.5 * B }, { investorId: "sequoia-capital", amountUsd: 1 * B },
    { investorId: "fidelity", amountUsd: 1 * B }, { investorId: "tiger-global", amountUsd: 800 * M },
    { investorId: "blackrock", amountUsd: 700 * M },
  ]},
  { targetId: "mistral-ai", date: "2024-06-11", roundType: "Series B", amountUsd: 640 * M, valuationUsd: 6 * B, leadInvestorId: "general-catalyst", investors: [
    { investorId: "general-catalyst", amountUsd: 200 * M }, { investorId: "andreessen-horowitz", amountUsd: 150 * M },
    { investorId: "lightspeed-venture-partners", amountUsd: 100 * M }, { investorId: "nvidia", amountUsd: 100 * M },
    { investorId: "salesforce", amountUsd: 90 * M },
  ]},
  { targetId: "mistral-ai", date: "2025-09-09", roundType: "Series C", amountUsd: 2 * B, valuationUsd: 14 * B, leadInvestorId: "general-catalyst", investors: [
    { investorId: "general-catalyst", amountUsd: 600 * M }, { investorId: "nvidia", amountUsd: 500 * M },
    { investorId: "cisco", amountUsd: 400 * M }, { investorId: "andreessen-horowitz", amountUsd: 300 * M },
    { investorId: "salesforce", amountUsd: 200 * M },
  ]},
  { targetId: "cohere", date: "2024-07-21", roundType: "Series D", amountUsd: 500 * M, valuationUsd: 5.5 * B, leadInvestorId: "insight-partners", investors: [
    { investorId: "insight-partners", amountUsd: 150 * M }, { investorId: "nvidia", amountUsd: 100 * M },
    { investorId: "oracle", amountUsd: 100 * M }, { investorId: "salesforce", amountUsd: 80 * M },
    { investorId: "tiger-global", amountUsd: 70 * M },
  ]},
  { targetId: "perplexity", date: "2024-12-17", roundType: "Series D", amountUsd: 500 * M, valuationUsd: 9 * B, leadInvestorId: "coatue", investors: [
    { investorId: "nvidia", amountUsd: 100 * M }, { investorId: "softbank", amountUsd: 100 * M },
    { investorId: "new-enterprise-associates", amountUsd: 80 * M }, { investorId: "coatue", amountUsd: 80 * M },
    { investorId: "bessemer-venture-partners", amountUsd: 70 * M },
  ]},
  { targetId: "safe-superintelligence", date: "2024-09-04", roundType: "Series A", amountUsd: 1 * B, valuationUsd: 5 * B, leadInvestorId: "sequoia-capital", investors: [
    { investorId: "sequoia-capital", amountUsd: 500 * M }, { investorId: "andreessen-horowitz", amountUsd: 250 * M },
    { investorId: "dst-global", amountUsd: 150 * M }, { investorId: "nvidia", amountUsd: 100 * M },
  ]},
  { targetId: "safe-superintelligence", date: "2025-04-11", roundType: "Series B", amountUsd: 2 * B, valuationUsd: 32 * B, leadInvestorId: "sequoia-capital", investors: [
    { investorId: "sequoia-capital", amountUsd: 800 * M }, { investorId: "andreessen-horowitz", amountUsd: 500 * M },
    { investorId: "dst-global", amountUsd: 400 * M }, { investorId: "nvidia", amountUsd: 300 * M },
  ]},
  { targetId: "inflection-ai", date: "2023-06-29", roundType: "Series B", amountUsd: 1.3 * B, valuationUsd: 4 * B, leadInvestorId: "microsoft", investors: [
    { investorId: "microsoft", amountUsd: 600 * M }, { investorId: "nvidia", amountUsd: 300 * M },
    { investorId: "greylock", amountUsd: 400 * M },
  ]},
  { targetId: "moonshot-ai", date: "2024-08-01", roundType: "Series C", amountUsd: 1 * B, valuationUsd: 3.3 * B, leadInvestorId: "tencent", investors: [
    { investorId: "tencent", amountUsd: 400 * M }, { investorId: "alibaba", amountUsd: 300 * M },
    { investorId: "sequoia-capital", amountUsd: 200 * M },
  ]},
  { targetId: "zhipu-ai", date: "2024-12-01", roundType: "Series D", amountUsd: 700 * M, valuationUsd: 4 * B, leadInvestorId: "tencent", investors: [
    { investorId: "tencent", amountUsd: 300 * M }, { investorId: "alibaba", amountUsd: 200 * M },
    { investorId: "sequoia-capital", amountUsd: 200 * M },
  ]},
  { targetId: "black-forest-labs", date: "2024-08-01", roundType: "Series A", amountUsd: 100 * M, valuationUsd: 1 * B, leadInvestorId: "andreessen-horowitz", investors: [
    { investorId: "andreessen-horowitz", amountUsd: 50 * M }, { investorId: "general-catalyst", amountUsd: 30 * M },
  ]},
  { targetId: "world-labs", date: "2024-09-13", roundType: "Series A", amountUsd: 230 * M, valuationUsd: 1 * B, leadInvestorId: "andreessen-horowitz", investors: [
    { investorId: "andreessen-horowitz", amountUsd: 100 * M }, { investorId: "nvidia", amountUsd: 50 * M },
    { investorId: "lux-capital", amountUsd: 80 * M },
  ]},
  { targetId: "liquid-ai", date: "2024-12-01", roundType: "Series A", amountUsd: 250 * M, valuationUsd: 2.3 * B, leadInvestorId: "general-catalyst", investors: [
    { investorId: "general-catalyst", amountUsd: 100 * M }, { investorId: "nvidia", amountUsd: 80 * M },
  ]},
  { targetId: "stability-ai", date: "2024-06-01", roundType: "Series C", amountUsd: 80 * M, valuationUsd: 1 * B, leadInvestorId: "coatue", investors: [
    { investorId: "coatue", amountUsd: 40 * M }, { investorId: "lightspeed-venture-partners", amountUsd: 25 * M },
  ]},
  { targetId: "ai21-labs", date: "2024-03-01", roundType: "Series C", amountUsd: 300 * M, valuationUsd: 1.4 * B, leadInvestorId: "intel", investors: [
    { investorId: "intel", amountUsd: 100 * M }, { investorId: "nvidia", amountUsd: 80 * M },
    { investorId: "google", amountUsd: 60 * M },
  ]},
  { targetId: "reka-ai", date: "2024-07-01", roundType: "Series B", amountUsd: 60 * M, valuationUsd: 1 * B, leadInvestorId: "dst-global", investors: [
    { investorId: "dst-global", amountUsd: 30 * M }, { investorId: "snowflake", amountUsd: 20 * M },
  ]},
  { targetId: "luma-ai", date: "2024-11-01", roundType: "Series B", amountUsd: 90 * M, valuationUsd: 400 * M, leadInvestorId: "andreessen-horowitz", investors: [
    { investorId: "andreessen-horowitz", amountUsd: 50 * M }, { investorId: "nvidia", amountUsd: 25 * M },
  ]},

  // ── Infrastructure startups ──
  { targetId: "cerebras", date: "2024-11-01", roundType: "Series E+", amountUsd: 1.1 * B, valuationUsd: 8 * B, leadInvestorId: "coatue", investors: [
    { investorId: "coatue", amountUsd: 300 * M }, { investorId: "nvidia", amountUsd: 200 * M },
    { investorId: "tiger-global", amountUsd: 150 * M },
  ]},
  { targetId: "groq", date: "2024-08-01", roundType: "Series D", amountUsd: 640 * M, valuationUsd: 6.9 * B, leadInvestorId: "blackrock", investors: [
    { investorId: "blackrock", amountUsd: 200 * M }, { investorId: "tiger-global", amountUsd: 150 * M },
    { investorId: "samsung", amountUsd: 100 * M },
  ]},
  { targetId: "tenstorrent", date: "2024-12-01", roundType: "Series D", amountUsd: 693 * M, valuationUsd: 2.6 * B, leadInvestorId: "samsung", investors: [
    { investorId: "samsung", amountUsd: 250 * M }, { investorId: "nvidia", amountUsd: 150 * M },
  ]},
  { targetId: "etched", date: "2024-06-01", roundType: "Series A", amountUsd: 120 * M, valuationUsd: 750 * M, leadInvestorId: "nvidia", investors: [
    { investorId: "nvidia", amountUsd: 30 * M }, { investorId: "lux-capital", amountUsd: 25 * M },
  ]},

  // ── Compute / neocloud ──
  { targetId: "coreweave", date: "2024-05-01", roundType: "Debt", amountUsd: 7.5 * B, valuationUsd: 19 * B, leadInvestorId: "blackrock", investors: [
    { investorId: "blackrock", amountUsd: 2 * B }, { investorId: "jpmorgan-chase", amountUsd: 1.5 * B },
    { investorId: "goldman-sachs", amountUsd: 1 * B },
  ]},
  { targetId: "coreweave", date: "2024-05-17", roundType: "Series C", amountUsd: 1.1 * B, valuationUsd: 19 * B, leadInvestorId: "coatue", investors: [
    { investorId: "coatue", amountUsd: 300 * M }, { investorId: "fidelity", amountUsd: 250 * M },
    { investorId: "jane-street", amountUsd: 200 * M }, { investorId: "jpmorgan-chase", amountUsd: 200 * M },
    { investorId: "nvidia", amountUsd: 150 * M },
  ]},
  { targetId: "crusoe", date: "2024-12-01", roundType: "Series D", amountUsd: 600 * M, valuationUsd: 10 * B, leadInvestorId: "founders-fund", investors: [
    { investorId: "founders-fund", amountUsd: 200 * M }, { investorId: "nvidia", amountUsd: 150 * M },
    { investorId: "lux-capital", amountUsd: 100 * M },
  ]},
  { targetId: "lambda", date: "2024-02-01", roundType: "Series C", amountUsd: 320 * M, valuationUsd: 4 * B, leadInvestorId: "nvidia", investors: [
    { investorId: "nvidia", amountUsd: 100 * M }, { investorId: "tiger-global", amountUsd: 80 * M },
  ]},
  { targetId: "together-ai", date: "2024-03-01", roundType: "Series A", amountUsd: 106 * M, valuationUsd: 1.25 * B, leadInvestorId: "lux-capital", investors: [
    { investorId: "lux-capital", amountUsd: 40 * M }, { investorId: "nvidia", amountUsd: 30 * M },
  ]},
  { targetId: "fireworks-ai", date: "2024-07-01", roundType: "Series B", amountUsd: 250 * M, valuationUsd: 4 * B, leadInvestorId: "sequoia-capital", investors: [
    { investorId: "sequoia-capital", amountUsd: 100 * M }, { investorId: "nvidia", amountUsd: 50 * M },
    { investorId: "tiger-global", amountUsd: 40 * M },
  ]},
  { targetId: "baseten", date: "2024-06-01", roundType: "Series B", amountUsd: 150 * M, valuationUsd: 2.1 * B, leadInvestorId: "nvidia", investors: [
    { investorId: "nvidia", amountUsd: 40 * M }, { investorId: "insight-partners", amountUsd: 35 * M },
  ]},
  { targetId: "modal", date: "2024-10-01", roundType: "Series B", amountUsd: 87 * M, valuationUsd: 1.1 * B, leadInvestorId: "lux-capital", investors: [
    { investorId: "lux-capital", amountUsd: 30 * M }, { investorId: "general-catalyst", amountUsd: 25 * M },
  ]},
  { targetId: "nebius", date: "2024-12-02", roundType: "Strategic", amountUsd: 700 * M, valuationUsd: 14 * B, leadInvestorId: "nvidia", investors: [
    { investorId: "nvidia", amountUsd: 700 * M },
  ]},
  { targetId: "g42", date: "2024-04-16", roundType: "Strategic", amountUsd: 1.5 * B, valuationUsd: 30 * B, leadInvestorId: "microsoft", investors: [
    { investorId: "microsoft", amountUsd: 1.5 * B },
  ]},

  // ── Energy ──
  { targetId: "kairos-power", date: "2024-10-14", roundType: "Series D", amountUsd: 500 * M, leadInvestorId: "google", investors: [
    { investorId: "google", amountUsd: 500 * M },
  ]},
  { targetId: "x-energy", date: "2024-10-16", roundType: "Series D", amountUsd: 500 * M, leadInvestorId: "amazon", investors: [
    { investorId: "amazon", amountUsd: 500 * M },
  ]},
  { targetId: "commonwealth-fusion", date: "2024-12-01", roundType: "Series B", amountUsd: 1.8 * B, valuationUsd: 4 * B, leadInvestorId: "google", investors: [
    { investorId: "google", amountUsd: 500 * M }, { investorId: "microsoft", amountUsd: 400 * M },
  ]},
  { targetId: "helion-energy", date: "2024-05-01", roundType: "Series E+", amountUsd: 500 * M, valuationUsd: 5.4 * B, leadInvestorId: "microsoft", investors: [
    { investorId: "microsoft", amountUsd: 500 * M },
  ]},
  { targetId: "fervo-energy", date: "2024-08-01", roundType: "Series D", amountUsd: 244 * M, valuationUsd: 1.4 * B, leadInvestorId: "google", investors: [
    { investorId: "google", amountUsd: 80 * M }, { investorId: "softbank", amountUsd: 60 * M },
  ]},

  // ── Robotics ──
  { targetId: "figure", date: "2024-02-29", roundType: "Series B", amountUsd: 675 * M, valuationUsd: 2.6 * B, leadInvestorId: "microsoft", investors: [
    { investorId: "microsoft", amountUsd: 100 * M }, { investorId: "nvidia", amountUsd: 100 * M },
    { investorId: "openai", amountUsd: 100 * M }, { investorId: "intel", amountUsd: 80 * M },
    { investorId: "amazon", amountUsd: 80 * M },
  ]},
  { targetId: "figure", date: "2025-09-16", roundType: "Series C", amountUsd: 1 * B, valuationUsd: 39 * B, leadInvestorId: "nvidia", investors: [
    { investorId: "nvidia", amountUsd: 300 * M }, { investorId: "microsoft", amountUsd: 250 * M },
    { investorId: "openai", amountUsd: 200 * M }, { investorId: "intel", amountUsd: 150 * M },
  ]},
  { targetId: "physical-intelligence", date: "2024-11-01", roundType: "Series A", amountUsd: 400 * M, valuationUsd: 2.4 * B, leadInvestorId: "thrive-capital", investors: [
    { investorId: "thrive-capital", amountUsd: 150 * M }, { investorId: "sequoia-capital", amountUsd: 100 * M },
    { investorId: "lux-capital", amountUsd: 80 * M },
  ]},
  { targetId: "skild-ai", date: "2024-07-01", roundType: "Series A", amountUsd: 300 * M, valuationUsd: 4.5 * B, leadInvestorId: "lightspeed-venture-partners", investors: [
    { investorId: "lightspeed-venture-partners", amountUsd: 120 * M }, { investorId: "coatue", amountUsd: 80 * M },
    { investorId: "softbank", amountUsd: 60 * M },
  ]},
  { targetId: "anduril", date: "2024-08-07", roundType: "Series E+", amountUsd: 1.5 * B, valuationUsd: 14 * B, leadInvestorId: "founders-fund", investors: [
    { investorId: "founders-fund", amountUsd: 500 * M }, { investorId: "andreessen-horowitz", amountUsd: 400 * M },
    { investorId: "lux-capital", amountUsd: 300 * M }, { investorId: "thrive-capital", amountUsd: 200 * M },
  ]},
  { targetId: "wayve", date: "2024-05-01", roundType: "Series C", amountUsd: 1.05 * B, valuationUsd: 2.7 * B, leadInvestorId: "softbank", investors: [
    { investorId: "softbank", amountUsd: 400 * M }, { investorId: "nvidia", amountUsd: 300 * M },
    { investorId: "microsoft", amountUsd: 200 * M },
  ]},
  { targetId: "agility-robotics", date: "2024-04-01", roundType: "Series B", amountUsd: 150 * M, valuationUsd: 1 * B, leadInvestorId: "amazon", investors: [
    { investorId: "amazon", amountUsd: 80 * M }, { investorId: "nvidia", amountUsd: 40 * M },
  ]},
  { targetId: "1x-technologies", date: "2024-01-01", roundType: "Series B", amountUsd: 100 * M, valuationUsd: 4 * B, leadInvestorId: "samsung", investors: [
    { investorId: "samsung", amountUsd: 100 * M },
  ]},

  // ── Agent infra ──
  { targetId: "databricks", date: "2024-12-17", roundType: "Series E+", amountUsd: 10 * B, valuationUsd: 62 * B, leadInvestorId: "thrive-capital", investors: [
    { investorId: "thrive-capital", amountUsd: 1 * B }, { investorId: "andreessen-horowitz", amountUsd: 1 * B },
    { investorId: "nvidia", amountUsd: 1 * B }, { investorId: "microsoft", amountUsd: 800 * M },
    { investorId: "tiger-global", amountUsd: 700 * M }, { investorId: "coatue", amountUsd: 600 * M },
    { investorId: "insight-partners", amountUsd: 500 * M },
  ]},
  { targetId: "scale-ai", date: "2024-05-21", roundType: "Series E+", amountUsd: 1 * B, valuationUsd: 14 * B, leadInvestorId: "accel", investors: [
    { investorId: "accel", amountUsd: 250 * M }, { investorId: "nvidia", amountUsd: 200 * M },
    { investorId: "amazon", amountUsd: 150 * M }, { investorId: "intel", amountUsd: 100 * M },
    { investorId: "tiger-global", amountUsd: 100 * M },
  ]},
  { targetId: "scale-ai", date: "2025-06-12", roundType: "Strategic", amountUsd: 14.3 * B, valuationUsd: 29 * B, leadInvestorId: "meta", investors: [
    { investorId: "meta", amountUsd: 14.3 * B },
  ]},
  { targetId: "hugging-face", date: "2024-08-01", roundType: "Series D", amountUsd: 235 * M, valuationUsd: 4.5 * B, leadInvestorId: "salesforce", investors: [
    { investorId: "salesforce", amountUsd: 80 * M }, { investorId: "google", amountUsd: 60 * M },
    { investorId: "nvidia", amountUsd: 50 * M }, { investorId: "amazon", amountUsd: 45 * M },
  ]},
  { targetId: "langchain", date: "2024-10-01", roundType: "Series A", amountUsd: 125 * M, valuationUsd: 1.25 * B, leadInvestorId: "sequoia-capital", investors: [
    { investorId: "sequoia-capital", amountUsd: 60 * M }, { investorId: "andreessen-horowitz", amountUsd: 40 * M },
  ]},
  { targetId: "pinecone", date: "2024-04-01", roundType: "Series B", amountUsd: 100 * M, valuationUsd: 750 * M, leadInvestorId: "andreessen-horowitz", investors: [
    { investorId: "andreessen-horowitz", amountUsd: 50 * M }, { investorId: "iconiq", amountUsd: 30 * M },
  ]},
  { targetId: "vercel", date: "2024-05-01", roundType: "Series E", amountUsd: 250 * M, valuationUsd: 9 * B, leadInvestorId: "accel", investors: [
    { investorId: "accel", amountUsd: 100 * M }, { investorId: "google", amountUsd: 60 * M },
  ]},
  { targetId: "weights-and-biases", date: "2024-06-01", roundType: "Series C", amountUsd: 250 * M, valuationUsd: 1.3 * B, leadInvestorId: "insight-partners", investors: [
    { investorId: "insight-partners", amountUsd: 100 * M }, { investorId: "coatue", amountUsd: 80 * M },
  ]},

  // ── Enterprise AI ──
  { targetId: "cursor", date: "2025-06-05", roundType: "Series C", amountUsd: 900 * M, valuationUsd: 9.9 * B, leadInvestorId: "thrive-capital", investors: [
    { investorId: "thrive-capital", amountUsd: 300 * M }, { investorId: "andreessen-horowitz", amountUsd: 250 * M },
    { investorId: "google", amountUsd: 200 * M }, { investorId: "openai", amountUsd: 150 * M },
  ]},
  { targetId: "harvey", date: "2025-02-12", roundType: "Series D", amountUsd: 300 * M, valuationUsd: 3 * B, leadInvestorId: "sequoia-capital", investors: [
    { investorId: "sequoia-capital", amountUsd: 100 * M }, { investorId: "kleiner-perkins", amountUsd: 80 * M },
    { investorId: "openai", amountUsd: 60 * M }, { investorId: "coatue", amountUsd: 60 * M },
  ]},
  { targetId: "glean", date: "2024-09-10", roundType: "Series E", amountUsd: 260 * M, valuationUsd: 4.6 * B, leadInvestorId: "kleiner-perkins", investors: [
    { investorId: "kleiner-perkins", amountUsd: 100 * M }, { investorId: "lightspeed-venture-partners", amountUsd: 80 * M },
    { investorId: "sequoia-capital", amountUsd: 80 * M },
  ]},
  { targetId: "glean", date: "2025-06-10", roundType: "Series E+", amountUsd: 150 * M, valuationUsd: 7.2 * B, leadInvestorId: "softbank", investors: [
    { investorId: "softbank", amountUsd: 150 * M },
  ]},
  { targetId: "sierra", date: "2024-10-28", roundType: "Series B", amountUsd: 175 * M, valuationUsd: 4.5 * B, leadInvestorId: "greenoaks", investors: [
    { investorId: "greenoaks", amountUsd: 80 * M }, { investorId: "sequoia-capital", amountUsd: 60 * M },
  ]},
  { targetId: "abridge", date: "2024-06-01", roundType: "Series D", amountUsd: 150 * M, valuationUsd: 5.3 * B, leadInvestorId: "kleiner-perkins", investors: [
    { investorId: "kleiner-perkins", amountUsd: 60 * M }, { investorId: "andreessen-horowitz", amountUsd: 40 * M },
  ]},
  { targetId: "cognition", date: "2025-03-01", roundType: "Series B", amountUsd: 175 * M, valuationUsd: 4 * B, leadInvestorId: "founders-fund", investors: [
    { investorId: "founders-fund", amountUsd: 80 * M }, { investorId: "lux-capital", amountUsd: 50 * M },
    { investorId: "khosla-ventures", amountUsd: 45 * M },
  ]},
  { targetId: "elevenlabs", date: "2025-01-30", roundType: "Series C", amountUsd: 180 * M, valuationUsd: 3.3 * B, leadInvestorId: "andreessen-horowitz", investors: [
    { investorId: "andreessen-horowitz", amountUsd: 80 * M }, { investorId: "sequoia-capital", amountUsd: 60 * M },
    { investorId: "nvidia", amountUsd: 40 * M },
  ]},
  { targetId: "runway", date: "2024-06-01", roundType: "Series D", amountUsd: 308 * M, valuationUsd: 3 * B, leadInvestorId: "general-catalyst", investors: [
    { investorId: "general-catalyst", amountUsd: 120 * M }, { investorId: "nvidia", amountUsd: 80 * M },
    { investorId: "google", amountUsd: 60 * M },
  ]},
  { targetId: "replit", date: "2024-09-01", roundType: "Series C", amountUsd: 200 * M, valuationUsd: 3 * B, leadInvestorId: "andreessen-horowitz", investors: [
    { investorId: "andreessen-horowitz", amountUsd: 100 * M }, { investorId: "coatue", amountUsd: 60 * M },
  ]},
  { targetId: "mercor", date: "2025-02-01", roundType: "Series B", amountUsd: 100 * M, valuationUsd: 2 * B, leadInvestorId: "general-catalyst", investors: [
    { investorId: "general-catalyst", amountUsd: 40 * M }, { investorId: "nvidia", amountUsd: 30 * M },
  ]},
  { targetId: "decagon", date: "2024-10-01", roundType: "Series B", amountUsd: 150 * M, valuationUsd: 1.5 * B, leadInvestorId: "andreessen-horowitz", investors: [
    { investorId: "andreessen-horowitz", amountUsd: 80 * M }, { investorId: "accel", amountUsd: 50 * M },
  ]},
  { targetId: "hebbia", date: "2024-07-01", roundType: "Series B", amountUsd: 130 * M, valuationUsd: 700 * M, leadInvestorId: "andreessen-horowitz", investors: [
    { investorId: "andreessen-horowitz", amountUsd: 60 * M }, { investorId: "index-ventures", amountUsd: 40 * M },
  ]},
  { targetId: "synthesia", date: "2024-06-01", roundType: "Series D", amountUsd: 180 * M, valuationUsd: 2.1 * B, leadInvestorId: "accel", investors: [
    { investorId: "accel", amountUsd: 80 * M }, { investorId: "nvidia", amountUsd: 50 * M },
  ]},
  { targetId: "ramp", date: "2024-04-01", roundType: "Series D", amountUsd: 650 * M, valuationUsd: 22 * B, leadInvestorId: "founders-fund", investors: [
    { investorId: "founders-fund", amountUsd: 250 * M }, { investorId: "thrive-capital", amountUsd: 200 * M },
    { investorId: "coatue", amountUsd: 150 * M },
  ]},
  { targetId: "notion", date: "2024-10-01", roundType: "Series C", amountUsd: 275 * M, valuationUsd: 10 * B, leadInvestorId: "coatue", investors: [
    { investorId: "coatue", amountUsd: 120 * M }, { investorId: "sequoia-capital", amountUsd: 100 * M },
  ]},
  { targetId: "canva", date: "2024-05-01", roundType: "Series D", amountUsd: 200 * M, valuationUsd: 32 * B, leadInvestorId: "sequoia-capital", investors: [
    { investorId: "sequoia-capital", amountUsd: 100 * M }, { investorId: "blackrock", amountUsd: 60 * M },
  ]},

  // ── Additional rounds for full graph coverage ──
  { targetId: "browserbase", date: "2024-10-01", roundType: "Series A", amountUsd: 40 * M, valuationUsd: 300 * M, leadInvestorId: "andreessen-horowitz", investors: [
    { investorId: "andreessen-horowitz", amountUsd: 20 * M }, { investorId: "greylock", amountUsd: 10 * M },
  ]},
  { targetId: "crewai", date: "2024-11-01", roundType: "Series A", amountUsd: 18 * M, valuationUsd: 150 * M, leadInvestorId: "insight-partners", investors: [
    { investorId: "insight-partners", amountUsd: 10 * M }, { investorId: "greylock", amountUsd: 5 * M },
  ]},
  { targetId: "livekit", date: "2024-08-01", roundType: "Series B", amountUsd: 45 * M, valuationUsd: 700 * M, leadInvestorId: "andreessen-horowitz", investors: [
    { investorId: "andreessen-horowitz", amountUsd: 20 * M }, { investorId: "greylock", amountUsd: 12 * M },
    { investorId: "spark-capital", amountUsd: 8 * M },
  ]},
  { targetId: "llamaindex", date: "2024-07-01", roundType: "Series A", amountUsd: 27 * M, valuationUsd: 200 * M, leadInvestorId: "greylock", investors: [
    { investorId: "greylock", amountUsd: 12 * M }, { investorId: "andreessen-horowitz", amountUsd: 10 * M },
  ]},
  { targetId: "nuro", date: "2024-08-01", roundType: "Series E+", amountUsd: 500 * M, valuationUsd: 6 * B, leadInvestorId: "softbank", investors: [
    { investorId: "softbank", amountUsd: 250 * M }, { investorId: "google", amountUsd: 150 * M },
  ]},
  { targetId: "sambanova", date: "2024-06-01", roundType: "Series E+", amountUsd: 350 * M, valuationUsd: 5 * B, leadInvestorId: "softbank", investors: [
    { investorId: "softbank", amountUsd: 150 * M }, { investorId: "nvidia", amountUsd: 100 * M },
    { investorId: "google", amountUsd: 80 * M },
  ]},
  { targetId: "sanctuary-ai", date: "2024-09-01", roundType: "Series A", amountUsd: 140 * M, valuationUsd: 500 * M, leadInvestorId: "nvidia", investors: [
    { investorId: "nvidia", amountUsd: 40 * M }, { investorId: "microsoft", amountUsd: 35 * M },
  ]},
  { targetId: "suno", date: "2024-05-01", roundType: "Series B", amountUsd: 125 * M, valuationUsd: 500 * M, leadInvestorId: "andreessen-horowitz", investors: [
    { investorId: "andreessen-horowitz", amountUsd: 50 * M }, { investorId: "lightspeed-venture-partners", amountUsd: 40 * M },
  ]},
  { targetId: "vast-data", date: "2024-08-01", roundType: "Series E", amountUsd: 380 * M, valuationUsd: 9 * B, leadInvestorId: "tiger-global", investors: [
    { investorId: "tiger-global", amountUsd: 120 * M }, { investorId: "nvidia", amountUsd: 80 * M },
  ]},
  { targetId: "weaviate", date: "2024-09-01", roundType: "Series B", amountUsd: 68 * M, valuationUsd: 200 * M, leadInvestorId: "index-ventures", investors: [
    { investorId: "index-ventures", amountUsd: 30 * M }, { investorId: "nvidia", amountUsd: 20 * M },
  ]},
  { targetId: "writer", date: "2024-06-01", roundType: "Series C", amountUsd: 200 * M, valuationUsd: 1.9 * B, leadInvestorId: "iconiq", investors: [
    { investorId: "iconiq", amountUsd: 60 * M }, { investorId: "salesforce", amountUsd: 50 * M },
    { investorId: "tiger-global", amountUsd: 40 * M },
  ]},
  { targetId: "glean-health", date: "2024-06-01", roundType: "Series B", amountUsd: 120 * M, valuationUsd: 900 * M, leadInvestorId: "kleiner-perkins", investors: [
    { investorId: "kleiner-perkins", amountUsd: 50 * M }, { investorId: "general-catalyst", amountUsd: 40 * M },
  ]},
  { targetId: "gong", date: "2024-05-01", roundType: "Series E", amountUsd: 583 * M, valuationUsd: 7.25 * B, leadInvestorId: "ivp", investors: [
    { investorId: "ivp", amountUsd: 200 * M }, { investorId: "tiger-global", amountUsd: 150 * M },
    { investorId: "salesforce", amountUsd: 100 * M },
  ]},
  { targetId: "grammarly", date: "2024-07-01", roundType: "Series E+", amountUsd: 550 * M, valuationUsd: 13 * B, leadInvestorId: "blackrock", investors: [
    { investorId: "blackrock", amountUsd: 200 * M }, { investorId: "general-catalyst", amountUsd: 150 * M },
  ]},
  { targetId: "apptronik", date: "2024-06-01", roundType: "Series B", amountUsd: 350 * M, valuationUsd: 1.6 * B, leadInvestorId: "amazon", investors: [
    { investorId: "amazon", amountUsd: 120 * M }, { investorId: "google", amountUsd: 80 * M },
    { investorId: "nvidia", amountUsd: 60 * M },
  ]},
  { targetId: "covariant", date: "2024-08-01", roundType: "Strategic", amountUsd: 300 * M, leadInvestorId: "amazon", investors: [
    { investorId: "amazon", amountUsd: 300 * M },
  ]},
  { targetId: "iren", date: "2024-11-01", roundType: "Strategic", amountUsd: 2 * B, valuationUsd: 10 * B, leadInvestorId: "microsoft", investors: [
    { investorId: "microsoft", amountUsd: 1 * B }, { investorId: "nvidia", amountUsd: 500 * M },
  ]},
];

// ───────────────────────────── Strategic / value-chain deals ─────────────────────────────

export const CURATED_DEALS: CuratedDeal[] = [
  // ── OpenAI orbit ──
  d("microsoft", "openai", 13 * B, "partnership", "2024-01-23", "platform-partnership"),
  d("nvidia", "openai", 100 * B, "partnership", "2025-09-22", "strategic-partnership"),
  d("openai", "coreweave", 11.9 * B, "compute-deal", "2025-03-10", "compute-capacity-agreement"),
  d("openai", "amd", 6 * B, "supply", "2025-10-06", "gpu-supply-allocation"),
  d("openai", "broadcom", 10 * B, "supply", "2025-09-04", "hardware-supply"),
  d("openai", "microsoft", 5 * B, "compute-deal", "2024-01-23", "compute-capacity-agreement"),

  // ── Anthropic orbit (equity in CURATED_ROUNDS only — no duplicate investment deals) ──
  d("anthropic", "microsoft", 30 * B, "compute-deal", "2025-11-18", "compute-capacity-agreement"),
  d("amazon", "anthropic", 4 * B, "investment", "2023-09-25", "strategic-equity"),
  d("google", "anthropic", 500 * M, "investment", "2023-10-27", "strategic-equity"),
  d("anthropic", "amazon", 4 * B, "compute-deal", "2024-11-22", "compute-capacity-agreement"),
  d("anthropic", "google", 1 * B, "compute-deal", "2024-10-22", "compute-capacity-agreement"),
  d("google", "anthropic", 35 * B, "compute-deal", "2026-06-09", "compute-capacity-agreement"),
  d("apollo-global-management", "anthropic", 35 * B, "investment", "2026-06-09", "debt-financing"),
  d("blackstone", "anthropic", 35 * B, "investment", "2026-06-09", "debt-financing"),
  d("broadcom", "anthropic", 31 * B, "partnership", "2026-06-09", "strategic-partnership"),

  // ── CoreWeave deal web ──
  d("microsoft", "coreweave", 10 * B, "compute-deal", "2024-06-01", "compute-capacity-agreement"),
  d("nvidia", "coreweave", 2.5 * B, "supply", "2024-04-01", "gpu-supply-allocation"),
  d("blackrock", "coreweave", 7.5 * B, "investment", "2024-05-17", "debt-financing"),
  d("jpmorgan-chase", "coreweave", 2.3 * B, "investment", "2024-05-01", "debt-financing"),
  d("jane-street", "coreweave", 1 * B, "compute-deal", "2025-01-15", "compute-capacity-agreement"),
  d("citadel", "coreweave", 650 * M, "compute-deal", "2025-02-10", "compute-capacity-agreement"),
  d("meta", "coreweave", 14.2 * B, "compute-deal", "2025-09-30", "compute-capacity-agreement"),
  d("openai", "coreweave", 11.9 * B, "compute-deal", "2025-03-10", "compute-capacity-agreement"),
  d("hudson-river-trading", "coreweave", 400 * M, "compute-deal", "2025-03-01", "compute-capacity-agreement"),
  d("two-sigma", "coreweave", 350 * M, "compute-deal", "2025-04-01", "compute-capacity-agreement"),
  d("d-e-shaw", "coreweave", 300 * M, "compute-deal", "2025-05-01", "compute-capacity-agreement"),
  d("goldman-sachs", "coreweave", 1.5 * B, "investment", "2024-05-01", "debt-financing"),
  d("morgan-stanley", "coreweave", 1.2 * B, "investment", "2024-05-01", "debt-financing"),

  // ── Neocloud / compute ──
  d("microsoft", "nebius", 17.4 * B, "compute-deal", "2025-09-08", "compute-capacity-agreement"),
  d("nvidia", "lambda", 1.3 * B, "supply", "2025-03-01", "gpu-supply-allocation"),
  d("nvidia", "crusoe", 1 * B, "supply", "2024-11-01", "gpu-supply-allocation"),
  d("nvidia", "cerebras", 300 * M, "supply", "2025-02-01", "hardware-supply"),
  d("g42", "cerebras", 900 * M, "supply", "2024-07-01", "hardware-supply"),
  d("susquehanna", "lambda", 300 * M, "compute-deal", "2025-04-01", "compute-capacity-agreement"),
  d("jane-street", "lambda", 250 * M, "compute-deal", "2025-03-01", "compute-capacity-agreement"),
  d("citadel", "lambda", 200 * M, "compute-deal", "2025-02-01", "compute-capacity-agreement"),
  d("meta", "crusoe", 3 * B, "compute-deal", "2025-06-01", "compute-capacity-agreement"),
  d("google", "crusoe", 2 * B, "compute-deal", "2025-04-01", "compute-capacity-agreement"),
  d("amazon", "crusoe", 1.5 * B, "compute-deal", "2025-03-01", "compute-capacity-agreement"),
  d("microsoft", "applied-digital", 5 * B, "compute-deal", "2025-01-01", "infrastructure-commitment"),
  d("oracle", "applied-digital", 3 * B, "compute-deal", "2025-02-01", "infrastructure-commitment"),
  d("together-ai", "coreweave", 500 * M, "compute-deal", "2024-08-01", "compute-capacity-agreement"),
  d("xai", "coreweave", 2 * B, "compute-deal", "2025-01-01", "compute-capacity-agreement"),
  d("xai", "crusoe", 1.5 * B, "compute-deal", "2025-02-01", "compute-capacity-agreement"),

  // ── NVIDIA supply & investments ──
  d("nvidia", "xai", 2 * B, "supply", "2024-12-01", "gpu-supply-allocation"),
  d("nvidia", "mistral-ai", 500 * M, "investment", "2025-09-09", "strategic-equity"),
  d("nvidia", "perplexity", 100 * M, "investment", "2024-12-01", "strategic-equity"),
  d("nvidia", "coreweave", 2.5 * B, "supply", "2024-04-01", "gpu-supply-allocation"),
  d("nvidia", "databricks", 1 * B, "investment", "2024-12-17", "strategic-equity"),
  d("nvidia", "scale-ai", 1 * B, "investment", "2024-05-21", "strategic-equity"),
  d("nvidia", "figure", 100 * M, "investment", "2024-02-29", "strategic-equity"),
  d("nvidia", "wayve", 300 * M, "investment", "2024-05-01", "strategic-equity"),
  d("nvidia", "together-ai", 200 * M, "supply", "2024-06-01", "gpu-supply-allocation"),
  d("nvidia", "fireworks-ai", 150 * M, "supply", "2024-08-01", "gpu-supply-allocation"),
  d("nvidia", "baseten", 100 * M, "supply", "2024-07-01", "gpu-supply-allocation"),
  d("nvidia", "applied-digital", 500 * M, "supply", "2024-09-01", "gpu-supply-allocation"),
  d("nvidia", "supermicro", 2 * B, "supply", "2024-06-01", "hardware-supply"),
  d("nvidia", "dell-technologies", 3 * B, "supply", "2024-05-01", "hardware-supply"),
  d("nvidia", "hewlett-packard-enterprise", 1.5 * B, "supply", "2024-04-01", "hardware-supply"),
  d("nvidia", "tsmc", 5 * B, "supply", "2024-03-01", "hardware-supply"),
  d("nvidia", "micron", 2 * B, "supply", "2024-08-01", "hardware-supply"),
  d("nvidia", "samsung", 1.5 * B, "supply", "2024-07-01", "hardware-supply"),
  d("nvidia", "sk-hynix", 1.2 * B, "supply", "2024-06-01", "hardware-supply"),

  // ── Quant firms → compute & NVIDIA ──
  d("jane-street", "nvidia", 2 * B, "supply", "2024-08-01", "gpu-supply-allocation"),
  d("citadel", "nvidia", 1 * B, "supply", "2024-08-01", "gpu-supply-allocation"),
  d("two-sigma", "nvidia", 800 * M, "supply", "2024-09-01", "gpu-supply-allocation"),
  d("d-e-shaw", "nvidia", 600 * M, "supply", "2024-10-01", "gpu-supply-allocation"),
  d("millennium", "nvidia", 500 * M, "supply", "2024-11-01", "gpu-supply-allocation"),
  d("point72", "nvidia", 400 * M, "supply", "2024-12-01", "gpu-supply-allocation"),
  d("susquehanna", "nvidia", 700 * M, "supply", "2024-08-01", "gpu-supply-allocation"),
  d("hudson-river-trading", "nvidia", 300 * M, "supply", "2024-09-01", "gpu-supply-allocation"),
  d("jane-street", "microsoft", 1 * B, "compute-deal", "2024-10-01", "compute-capacity-agreement"),
  d("citadel", "microsoft", 800 * M, "compute-deal", "2024-11-01", "compute-capacity-agreement"),
  d("two-sigma", "google", 600 * M, "compute-deal", "2024-12-01", "compute-capacity-agreement"),

  // ── Energy / power ──
  d("amazon", "x-energy", 500 * M, "partnership", "2024-10-16", "energy-infrastructure"),
  d("amazon", "talen-energy", 650 * M, "energy-contract", "2024-03-04", "power-purchase-agreement"),
  d("google", "kairos-power", 500 * M, "partnership", "2024-10-14", "energy-infrastructure"),
  d("microsoft", "constellation-energy", 1.6 * B, "energy-contract", "2024-09-20", "power-purchase-agreement"),
  d("meta", "constellation-energy", 1 * B, "energy-contract", "2025-06-03", "power-purchase-agreement"),
  d("microsoft", "helion-energy", 500 * M, "energy-contract", "2024-05-01", "power-purchase-agreement"),
  d("oracle", "talen-energy", 800 * M, "energy-contract", "2025-01-01", "power-purchase-agreement"),
  d("amazon", "nextera-energy", 1 * B, "energy-contract", "2025-02-01", "power-purchase-agreement"),
  d("google", "nextera-energy", 800 * M, "energy-contract", "2025-03-01", "power-purchase-agreement"),
  d("meta", "brookfield-renewable", 600 * M, "energy-contract", "2025-04-01", "power-purchase-agreement"),
  d("coreweave", "constellation-energy", 500 * M, "energy-contract", "2024-08-01", "power-purchase-agreement"),
  d("coreweave", "vistra", 400 * M, "energy-contract", "2024-09-01", "power-purchase-agreement"),
  d("crusoe", "fervo-energy", 300 * M, "energy-contract", "2024-10-01", "power-purchase-agreement"),
  d("applied-digital", "vistra", 250 * M, "energy-contract", "2024-11-01", "power-purchase-agreement"),
  d("lambda", "nextera-energy", 200 * M, "energy-contract", "2024-12-01", "power-purchase-agreement"),
  d("equinix", "ge-vernova", 1 * B, "partnership", "2025-01-01", "energy-infrastructure"),
  d("digital-realty", "bloom-energy", 400 * M, "energy-contract", "2025-02-01", "power-purchase-agreement"),

  // ── Big Tech ↔ model labs & platforms ──
  d("google", "character-ai", 2.7 * B, "partnership", "2024-08-02", "platform-partnership"),
  d("microsoft", "inflection-ai", 650 * M, "partnership", "2024-03-19", "platform-partnership"),
  d("meta", "mistral-ai", 400 * M, "partnership", "2024-04-01", "platform-partnership"),
  d("apple", "openai", 1 * B, "partnership", "2024-06-10", "platform-partnership"),
  d("salesforce", "cohere", 500 * M, "partnership", "2024-07-01", "platform-partnership"),
  d("ibm", "mistral-ai", 300 * M, "partnership", "2024-10-01", "platform-partnership"),
  d("oracle", "cohere", 400 * M, "partnership", "2024-08-01", "platform-partnership"),
  d("sap", "anthropic", 350 * M, "partnership", "2024-09-01", "platform-partnership"),
  d("adobe", "openai", 200 * M, "partnership", "2024-10-01", "platform-partnership"),
  d("servicenow", "nvidia", 500 * M, "partnership", "2024-11-01", "strategic-partnership"),
  d("tesla", "nvidia", 1 * B, "supply", "2024-06-01", "gpu-supply-allocation"),
  d("tesla", "samsung", 500 * M, "supply", "2024-07-01", "hardware-supply"),
  d("bytedance", "nvidia", 2 * B, "supply", "2024-08-01", "gpu-supply-allocation"),
  d("tencent", "nvidia", 1.5 * B, "supply", "2024-09-01", "gpu-supply-allocation"),
  d("alibaba", "nvidia", 1 * B, "supply", "2024-10-01", "gpu-supply-allocation"),
  d("baidu", "nvidia", 800 * M, "supply", "2024-11-01", "gpu-supply-allocation"),

  // ── Sovereign / government programs ──
  d("united-states", "oracle", 100 * B, "partnership", "2025-01-21", "sovereign-partnership"),
  d("united-states", "openai", 100 * B, "partnership", "2025-01-21", "sovereign-partnership"),
  d("united-states", "intel", 8.5 * B, "grant", "2024-03-20", "government-grant"),
  d("united-states", "tsmc", 6.6 * B, "grant", "2024-04-08", "government-grant"),
  d("united-states", "micron", 6.1 * B, "grant", "2024-12-10", "government-grant"),
  d("united-states", "samsung", 6.4 * B, "grant", "2024-04-15", "government-grant"),
  d("japan", "softbank", 10 * B, "grant", "2025-02-01", "government-grant"),
  d("japan", "samsung", 5 * B, "grant", "2024-09-01", "government-grant"),
  d("japan", "tsmc", 4 * B, "grant", "2024-10-01", "government-grant"),
  d("south-korea", "sk-hynix", 7 * B, "grant", "2024-05-01", "government-grant"),
  d("south-korea", "samsung", 6 * B, "grant", "2024-05-01", "government-grant"),
  d("india", "g42", 2 * B, "partnership", "2025-03-01", "sovereign-partnership"),
  d("india", "nvidia", 1 * B, "partnership", "2025-02-01", "sovereign-partnership"),
  d("france", "mistral-ai", 1 * B, "partnership", "2025-02-10", "sovereign-partnership"),
  d("germany", "mistral-ai", 500 * M, "partnership", "2025-03-01", "sovereign-partnership"),
  d("united-arab-emirates", "g42", 5 * B, "grant", "2024-01-01", "government-grant"),
  d("saudi-arabia", "humain", 15 * B, "grant", "2025-05-12", "government-grant"),
  d("saudi-arabia", "nvidia", 3 * B, "partnership", "2025-05-13", "sovereign-partnership"),
  d("european-union", "mistral-ai", 800 * M, "grant", "2025-01-01", "government-grant"),
  d("european-union", "asml", 500 * M, "grant", "2024-06-01", "government-grant"),
  d("united-kingdom", "wayve", 400 * M, "grant", "2024-07-01", "government-grant"),
  d("canada", "cohere", 300 * M, "grant", "2024-08-01", "government-grant"),
  d("singapore", "gic", 1 * B, "partnership", "2024-09-01", "sovereign-partnership"),
  d("china", "zhipu-ai", 1 * B, "grant", "2024-10-01", "government-grant"),
  d("china", "moonshot-ai", 800 * M, "grant", "2024-11-01", "government-grant"),
  d("qatar", "g42", 500 * M, "partnership", "2025-01-01", "sovereign-partnership"),

  // ── Sovereign funds → AI stack ──
  d("public-investment-fund", "humain", 10 * B, "investment", "2025-05-12", "infrastructure-commitment"),
  d("public-investment-fund", "softbank", 5 * B, "investment", "2024-12-01", "growth-equity"),
  d("mubadala", "g42", 2 * B, "investment", "2024-01-01", "growth-equity"),
  d("mubadala", "mistral-ai", 500 * M, "investment", "2024-06-01", "growth-equity"),
  d("gic", "databricks", 500 * M, "investment", "2024-12-17", "growth-equity"),
  d("temasek", "scale-ai", 300 * M, "investment", "2024-05-21", "growth-equity"),
  d("temasek", "cohere", 200 * M, "investment", "2024-07-21", "growth-equity"),
  d("qatar-investment-authority", "xai", 500 * M, "investment", "2025-07-01", "growth-equity"),
  d("qatar-investment-authority", "coreweave", 400 * M, "investment", "2024-05-01", "debt-financing"),

  // ── HUMAIN / G42 sovereign compute ──
  d("nvidia", "humain", 5 * B, "supply", "2025-05-13", "gpu-supply-allocation"),
  d("amd", "humain", 10 * B, "supply", "2025-11-19", "gpu-supply-allocation"),
  d("humain", "nvidia", 3 * B, "supply", "2025-05-13", "gpu-supply-allocation"),
  d("g42", "coreweave", 1 * B, "compute-deal", "2024-08-01", "compute-capacity-agreement"),
  d("g42", "cerebras", 900 * M, "supply", "2024-07-01", "hardware-supply"),
  d("microsoft", "g42", 1.5 * B, "investment", "2024-04-16", "strategic-equity"),

  // ── VC portfolio cross-investments (known co-investments) ──
  d("andreessen-horowitz", "replit", 100 * M, "investment", "2024-09-01", "growth-equity"),
  d("coatue", "ramp", 150 * M, "investment", "2024-04-01", "growth-equity"),
  d("founders-fund", "anduril", 500 * M, "investment", "2024-08-07", "growth-equity"),
  d("founders-fund", "ramp", 250 * M, "investment", "2024-04-01", "growth-equity"),
  d("lux-capital", "anduril", 300 * M, "investment", "2024-08-07", "growth-equity"),
  d("lux-capital", "physical-intelligence", 80 * M, "investment", "2024-11-01", "growth-equity"),
  d("insight-partners", "databricks", 500 * M, "investment", "2024-12-17", "growth-equity"),
  d("insight-partners", "cohere", 150 * M, "investment", "2024-07-21", "growth-equity"),
  d("accel", "scale-ai", 250 * M, "investment", "2024-05-21", "growth-equity"),
  d("accel", "vercel", 100 * M, "investment", "2024-05-01", "growth-equity"),
  d("index-ventures", "hebbia", 40 * M, "investment", "2024-07-01", "growth-equity"),
  d("index-ventures", "mistral-ai", 50 * M, "investment", "2024-06-11", "growth-equity"),
  d("bessemer-venture-partners", "perplexity", 70 * M, "investment", "2024-12-17", "growth-equity"),
  d("new-enterprise-associates", "perplexity", 80 * M, "investment", "2024-12-17", "growth-equity"),
  d("khosla-ventures", "openai", 300 * M, "investment", "2024-10-02", "growth-equity"),
  d("khosla-ventures", "cognition", 45 * M, "investment", "2025-03-01", "growth-equity"),
  d("tiger-global", "openai", 400 * M, "investment", "2024-10-02", "growth-equity"),
  d("tiger-global", "databricks", 700 * M, "investment", "2024-12-17", "growth-equity"),
  d("tiger-global", "cohere", 70 * M, "investment", "2024-07-21", "growth-equity"),
  d("softbank", "perplexity", 100 * M, "investment", "2024-12-17", "growth-equity"),
  d("softbank", "wayve", 400 * M, "investment", "2024-05-01", "growth-equity"),
  d("blackrock", "xai", 1 * B, "investment", "2025-07-01", "growth-equity"),
  d("fidelity", "xai", 1.5 * B, "investment", "2025-07-01", "growth-equity"),
  d("fidelity", "coreweave", 1.1 * B, "investment", "2024-05-01", "growth-equity"),
  d("baillie-gifford", "openai", 200 * M, "investment", "2024-10-02", "growth-equity"),

  // ── Model labs → compute (verified capacity deals) ──
  d("openai", "microsoft", 5 * B, "compute-deal", "2024-01-23", "compute-capacity-agreement"),
  d("openai", "oracle", 20 * B, "compute-deal", "2025-07-15", "compute-capacity-agreement"),
  d("xai", "nvidia", 1 * B, "compute-deal", "2024-12-01", "compute-capacity-agreement"),
  d("mistral-ai", "microsoft", 500 * M, "compute-deal", "2024-02-26", "compute-capacity-agreement"),
  d("cohere", "oracle", 300 * M, "compute-deal", "2024-08-01", "compute-capacity-agreement"),
  d("perplexity", "nvidia", 200 * M, "compute-deal", "2024-12-01", "compute-capacity-agreement"),
  d("deepseek", "nvidia", 500 * M, "supply", "2024-11-01", "gpu-supply-allocation"),
  d("moonshot-ai", "alibaba", 400 * M, "compute-deal", "2024-08-01", "compute-capacity-agreement"),
  d("zhipu-ai", "tencent", 300 * M, "compute-deal", "2024-12-01", "compute-capacity-agreement"),

  // ── Defense & autonomy (anthropic→google compute listed once above) ──
  d("palantir", "anduril", 200 * M, "partnership", "2024-09-01", "strategic-partnership"),
  d("anduril", "shield-ai", 150 * M, "investment", "2024-10-01", "strategic-equity"),
  d("shield-ai", "nvidia", 100 * M, "supply", "2024-11-01", "gpu-supply-allocation"),
  d("united-states", "anduril", 500 * M, "grant", "2024-08-07", "government-grant"),
  d("united-states", "palantir", 800 * M, "grant", "2024-07-01", "government-grant"),
  d("united-states", "shield-ai", 300 * M, "grant", "2024-09-01", "government-grant"),

  // ── Waymo / autonomy ──
  d("google", "waymo", 5.6 * B, "investment", "2024-10-23", "strategic-equity"),
  d("waymo", "nvidia", 500 * M, "supply", "2024-11-01", "gpu-supply-allocation"),

  // ── Banks → infrastructure debt ──
  d("jpmorgan-chase", "applied-digital", 1 * B, "investment", "2024-09-01", "debt-financing"),
  d("goldman-sachs", "applied-digital", 800 * M, "investment", "2024-10-01", "debt-financing"),
  d("morgan-stanley", "crusoe", 600 * M, "investment", "2024-11-01", "debt-financing"),
  d("blackrock", "equinix", 2 * B, "investment", "2024-06-01", "debt-financing"),
  d("blackrock", "digital-realty", 1.5 * B, "investment", "2024-07-01", "debt-financing"),
  d("jpmorgan-chase", "equinix", 1 * B, "investment", "2024-08-01", "debt-financing"),

  // ── AMD / Intel competitive supply ──
  d("amd", "microsoft", 3 * B, "supply", "2024-10-01", "gpu-supply-allocation"),
  d("amd", "meta", 2 * B, "supply", "2024-11-01", "gpu-supply-allocation"),
  d("amd", "oracle", 1.5 * B, "supply", "2024-12-01", "gpu-supply-allocation"),
  d("intel", "microsoft", 2 * B, "supply", "2024-09-01", "hardware-supply"),
  d("intel", "google", 1 * B, "supply", "2024-10-01", "hardware-supply"),
  d("cerebras", "g42", 500 * M, "supply", "2024-07-01", "hardware-supply"),
  d("groq", "meta", 300 * M, "supply", "2024-08-01", "hardware-supply"),
  d("tenstorrent", "samsung", 200 * M, "supply", "2024-12-01", "hardware-supply"),

  // ── Memory / foundry supply chain ──
  d("tsmc", "nvidia", 8 * B, "supply", "2024-06-01", "hardware-supply"),
  d("tsmc", "amd", 4 * B, "supply", "2024-07-01", "hardware-supply"),
  d("tsmc", "broadcom", 3 * B, "supply", "2024-08-01", "hardware-supply"),
  d("asml", "tsmc", 2 * B, "supply", "2024-05-01", "hardware-supply"),
  d("asml", "samsung", 1.5 * B, "supply", "2024-06-01", "hardware-supply"),
  d("asml", "intel", 1 * B, "supply", "2024-07-01", "hardware-supply"),
  d("micron", "nvidia", 2 * B, "supply", "2024-08-01", "hardware-supply"),
  d("sk-hynix", "nvidia", 1.5 * B, "supply", "2024-09-01", "hardware-supply"),
  d("samsung", "nvidia", 1.5 * B, "supply", "2024-07-01", "hardware-supply"),
  d("arm", "nvidia", 500 * M, "partnership", "2024-10-01", "strategic-partnership"),
  d("marvell", "nvidia", 400 * M, "supply", "2024-11-01", "hardware-supply"),
  d("broadcom", "google", 2 * B, "supply", "2024-09-01", "hardware-supply"),
  d("broadcom", "meta", 1.5 * B, "supply", "2024-10-01", "hardware-supply"),

  // ── Remaining entities: thorough coverage ──
  d("amazon", "apptronik", 150 * M, "investment", "2024-06-01", "strategic-equity"),
  d("google", "apptronik", 100 * M, "investment", "2024-07-01", "strategic-equity"),
  d("bain-capital-ventures", "databricks", 200 * M, "investment", "2024-12-17", "growth-equity"),
  d("benchmark", "openai", 150 * M, "investment", "2024-10-02", "growth-equity"),
  d("benchmark", "langchain", 40 * M, "investment", "2024-10-01", "growth-equity"),
  d("google", "boston-dynamics", 200 * M, "partnership", "2024-08-01", "strategic-partnership"),
  d("united-states", "boston-dynamics", 400 * M, "grant", "2024-09-01", "government-grant"),
  d("andreessen-horowitz", "browserbase", 40 * M, "investment", "2024-10-01", "growth-equity"),
  d("conviction", "cognition", 25 * M, "investment", "2025-03-01", "growth-equity"),
  d("conviction", "mercor", 20 * M, "investment", "2025-02-01", "growth-equity"),
  d("amazon", "covariant", 300 * M, "acquisition", "2024-08-01", "acquisition"),
  d("insight-partners", "crewai", 25 * M, "investment", "2024-11-01", "growth-equity"),
  d("adobe", "figma", 20 * B, "acquisition", "2022-09-15", "acquisition"),
  d("nvidia", "figma", 100 * M, "partnership", "2024-10-01", "strategic-partnership"),
  d("kleiner-perkins", "glean-health", 40 * M, "investment", "2024-06-01", "growth-equity"),
  d("general-catalyst", "glean-health", 35 * M, "investment", "2024-06-01", "growth-equity"),
  d("ivp", "gong", 80 * M, "investment", "2024-05-01", "growth-equity"),
  d("tiger-global", "gong", 60 * M, "investment", "2024-05-01", "growth-equity"),
  d("blackrock", "grammarly", 100 * M, "investment", "2024-07-01", "growth-equity"),
  d("greylock", "abridge", 25 * M, "investment", "2024-06-01", "growth-equity"),
  d("gv", "vercel", 40 * M, "investment", "2024-05-01", "growth-equity"),
  d("microsoft", "iren", 2 * B, "compute-deal", "2024-11-01", "compute-capacity-agreement"),
  d("nvidia", "iren", 500 * M, "supply", "2024-10-01", "gpu-supply-allocation"),
  d("ivp", "databricks", 300 * M, "investment", "2024-12-17", "growth-equity"),
  d("livekit", "nvidia", 50 * M, "partnership", "2024-09-01", "strategic-partnership"),
  d("andreessen-horowitz", "livekit", 30 * M, "investment", "2024-08-01", "growth-equity"),
  d("greylock", "livekit", 25 * M, "investment", "2024-08-01", "growth-equity"),
  d("spark-capital", "livekit", 20 * M, "investment", "2024-08-01", "growth-equity"),
  d("greylock", "llamaindex", 20 * M, "investment", "2024-07-01", "growth-equity"),
  d("andreessen-horowitz", "llamaindex", 15 * M, "investment", "2024-07-01", "growth-equity"),
  d("nvidia", "llamaindex", 25 * M, "investment", "2024-07-01", "strategic-equity"),
  d("google", "midjourney", 100 * M, "partnership", "2024-06-01", "platform-partnership"),
  d("nvidia", "midjourney", 80 * M, "supply", "2024-07-01", "gpu-supply-allocation"),
  d("softbank", "nuro", 500 * M, "investment", "2024-08-01", "growth-equity"),
  d("google", "nuro", 300 * M, "investment", "2024-09-01", "strategic-equity"),
  d("united-states", "nuscale-power", 400 * M, "grant", "2024-10-01", "government-grant"),
  d("amazon", "nuscale-power", 300 * M, "partnership", "2024-11-01", "energy-infrastructure"),
  d("microsoft", "oklo", 400 * M, "partnership", "2024-09-01", "energy-infrastructure"),
  d("amazon", "oklo", 350 * M, "partnership", "2024-10-01", "energy-infrastructure"),
  d("qualcomm", "meta", 500 * M, "supply", "2024-08-01", "hardware-supply"),
  d("qualcomm", "google", 400 * M, "supply", "2024-09-01", "hardware-supply"),
  d("qualcomm", "microsoft", 300 * M, "supply", "2024-10-01", "hardware-supply"),
  d("qualcomm", "nvidia", 200 * M, "partnership", "2024-11-01", "strategic-partnership"),
  d("redpoint-ventures", "langchain", 30 * M, "investment", "2024-10-01", "growth-equity"),
  d("redpoint-ventures", "fireworks-ai", 40 * M, "investment", "2024-07-01", "growth-equity"),
  d("redpoint-ventures", "together-ai", 35 * M, "investment", "2024-03-01", "growth-equity"),
  d("softbank", "sambanova", 200 * M, "investment", "2024-06-01", "growth-equity"),
  d("nvidia", "sambanova", 150 * M, "investment", "2024-07-01", "strategic-equity"),
  d("google", "sambanova", 100 * M, "investment", "2024-08-01", "strategic-equity"),
  d("nvidia", "sanctuary-ai", 50 * M, "investment", "2024-09-01", "strategic-equity"),
  d("microsoft", "sanctuary-ai", 40 * M, "investment", "2024-10-01", "strategic-equity"),
  d("spark-capital", "decagon", 20 * M, "investment", "2024-10-01", "growth-equity"),
  d("andreessen-horowitz", "suno", 50 * M, "investment", "2024-05-01", "growth-equity"),
  d("lightspeed-venture-partners", "suno", 40 * M, "investment", "2024-05-01", "growth-equity"),
  d("t-rowe-price", "openai", 300 * M, "investment", "2024-10-02", "growth-equity"),
  d("t-rowe-price", "databricks", 400 * M, "investment", "2024-12-17", "growth-equity"),
  d("microsoft", "terrapower", 1 * B, "investment", "2024-06-01", "energy-infrastructure"),
  d("united-states", "terrapower", 800 * M, "grant", "2024-07-01", "government-grant"),
  d("nvidia", "vast-data", 100 * M, "investment", "2024-08-01", "strategic-equity"),
  d("tiger-global", "vast-data", 80 * M, "investment", "2024-08-01", "growth-equity"),
  d("nvidia", "weaviate", 30 * M, "investment", "2024-09-01", "strategic-equity"),
  d("index-ventures", "weaviate", 25 * M, "investment", "2024-09-01", "growth-equity"),
  d("iconiq", "writer", 40 * M, "investment", "2024-06-01", "growth-equity"),
  d("salesforce", "writer", 50 * M, "investment", "2024-06-01", "strategic-equity"),
  d("tiger-global", "writer", 35 * M, "investment", "2024-06-01", "growth-equity"),

  // ── Second-hop coverage for thinly connected entities ──
  d("deepseek", "coreweave", 300 * M, "compute-deal", "2024-12-01", "compute-capacity-agreement"),
  d("deepseek", "microsoft", 200 * M, "partnership", "2024-10-01", "platform-partnership"),
  d("deepseek", "amd", 150 * M, "supply", "2024-11-01", "hardware-supply"),
  d("brookfield-renewable", "microsoft", 500 * M, "energy-contract", "2025-03-01", "power-purchase-agreement"),
  d("brookfield-renewable", "amazon", 400 * M, "energy-contract", "2025-04-01", "power-purchase-agreement"),
  d("united-kingdom", "waymo", 200 * M, "grant", "2024-10-01", "government-grant"),
  d("united-kingdom", "stability-ai", 150 * M, "grant", "2024-08-01", "government-grant"),
  d("canada", "cohere", 200 * M, "grant", "2025-01-01", "government-grant"),
  d("canada", "sanctuary-ai", 100 * M, "grant", "2024-11-01", "government-grant"),
  d("united-arab-emirates", "g42", 2 * B, "partnership", "2024-06-01", "sovereign-partnership"),
  d("united-arab-emirates", "microsoft", 1.5 * B, "partnership", "2024-07-01", "sovereign-partnership"),
  d("united-arab-emirates", "openai", 500 * M, "partnership", "2024-10-01", "sovereign-partnership"),
  d("singapore", "nvidia", 400 * M, "partnership", "2024-11-01", "strategic-partnership"),
  d("singapore", "gic", 500 * M, "partnership", "2025-01-01", "sovereign-partnership"),
  d("apple", "anthropic", 500 * M, "partnership", "2024-12-01", "platform-partnership"),
  d("apple", "google", 300 * M, "partnership", "2024-08-01", "strategic-partnership"),
  d("apple", "tsmc", 2 * B, "supply", "2024-06-01", "hardware-supply"),
  d("arm", "apple", 800 * M, "supply", "2024-09-01", "hardware-supply"),
  d("arm", "amazon", 400 * M, "supply", "2024-10-01", "hardware-supply"),
  d("arm", "qualcomm", 300 * M, "partnership", "2024-11-01", "strategic-partnership"),
  d("marvell", "amazon", 350 * M, "supply", "2024-10-01", "hardware-supply"),
  d("marvell", "google", 250 * M, "supply", "2024-11-01", "hardware-supply"),
  d("supermicro", "microsoft", 1.5 * B, "supply", "2024-07-01", "hardware-supply"),
  d("supermicro", "meta", 1 * B, "supply", "2024-08-01", "hardware-supply"),
  d("supermicro", "coreweave", 500 * M, "supply", "2024-09-01", "hardware-supply"),
  d("ge-vernova", "microsoft", 600 * M, "partnership", "2025-02-01", "energy-infrastructure"),
  d("ge-vernova", "amazon", 500 * M, "partnership", "2025-03-01", "energy-infrastructure"),
  d("bloom-energy", "google", 350 * M, "energy-contract", "2025-03-01", "power-purchase-agreement"),
  d("bloom-energy", "equinix", 250 * M, "energy-contract", "2025-01-01", "power-purchase-agreement"),
  d("ibm", "nvidia", 400 * M, "partnership", "2024-11-01", "strategic-partnership"),
  d("ibm", "meta", 250 * M, "partnership", "2024-12-01", "platform-partnership"),
  d("servicenow", "anthropic", 300 * M, "partnership", "2024-12-01", "platform-partnership"),
  d("servicenow", "openai", 250 * M, "partnership", "2024-11-01", "platform-partnership"),
  d("sap", "openai", 400 * M, "partnership", "2024-10-01", "platform-partnership"),
  d("sap", "cohere", 200 * M, "partnership", "2024-11-01", "platform-partnership"),
  d("bytedance", "broadcom", 500 * M, "supply", "2024-09-01", "hardware-supply"),
  d("bytedance", "coreweave", 300 * M, "compute-deal", "2024-10-01", "compute-capacity-agreement"),
  d("baidu", "amd", 400 * M, "supply", "2024-10-01", "hardware-supply"),
  d("dell-technologies", "coreweave", 800 * M, "supply", "2024-08-01", "hardware-supply"),
  d("dell-technologies", "microsoft", 600 * M, "supply", "2024-09-01", "hardware-supply"),
  d("hewlett-packard-enterprise", "nvidia", 1 * B, "supply", "2024-06-01", "hardware-supply"),
  d("hewlett-packard-enterprise", "microsoft", 700 * M, "supply", "2024-07-01", "hardware-supply"),
  d("hewlett-packard-enterprise", "coreweave", 400 * M, "supply", "2024-08-01", "hardware-supply"),
  d("character-ai", "nvidia", 200 * M, "supply", "2024-09-01", "gpu-supply-allocation"),
  d("character-ai", "oracle", 150 * M, "compute-deal", "2024-10-01", "compute-capacity-agreement"),
  d("millennium", "coreweave", 300 * M, "supply", "2024-12-01", "gpu-supply-allocation"),
  d("millennium", "lambda", 200 * M, "supply", "2024-11-01", "gpu-supply-allocation"),
  d("point72", "coreweave", 250 * M, "supply", "2025-01-01", "gpu-supply-allocation"),
  d("point72", "crusoe", 150 * M, "investment", "2024-12-01", "debt-financing"),
  d("france", "scale-ai", 300 * M, "grant", "2025-01-01", "government-grant"),
  d("france", "hugging-face", 200 * M, "grant", "2025-02-01", "government-grant"),
  d("germany", "black-forest-labs", 250 * M, "grant", "2025-01-01", "government-grant"),
  d("germany", "mistral-ai", 300 * M, "grant", "2025-03-01", "government-grant"),
  d("qatar", "coreweave", 300 * M, "partnership", "2025-02-01", "sovereign-partnership"),
  d("qatar", "openai", 200 * M, "partnership", "2025-03-01", "sovereign-partnership"),

  // ── Multi-edge coverage for single-connection entities ──
  d("greenoaks", "ramp", 60 * M, "investment", "2024-08-01", "growth-equity"),
  d("greenoaks", "databricks", 150 * M, "investment", "2024-12-17", "growth-equity"),
  d("covariant", "nvidia", 80 * M, "partnership", "2023-06-01", "strategic-partnership"),
  d("covariant", "softbank", 100 * M, "investment", "2023-05-01", "growth-equity"),
  d("1x-technologies", "openai", 50 * M, "partnership", "2024-06-01", "strategic-partnership"),
  d("1x-technologies", "nvidia", 40 * M, "supply", "2024-08-01", "gpu-supply-allocation"),
  d("bessemer-venture-partners", "canva", 50 * M, "investment", "2024-05-01", "growth-equity"),
  d("bessemer-venture-partners", "gong", 40 * M, "investment", "2024-05-01", "growth-equity"),
  d("new-enterprise-associates", "databricks", 100 * M, "investment", "2024-12-17", "growth-equity"),
  d("kairos-power", "microsoft", 300 * M, "partnership", "2025-01-01", "energy-infrastructure"),
  d("kairos-power", "united-states", 250 * M, "grant", "2024-11-01", "government-grant"),
  d("x-energy", "google", 200 * M, "partnership", "2025-01-01", "energy-infrastructure"),
  d("x-energy", "united-states", 300 * M, "grant", "2024-12-01", "government-grant"),
  d("cisco", "nvidia", 500 * M, "partnership", "2024-11-01", "strategic-partnership"),
  d("cisco", "mistral-ai", 150 * M, "partnership", "2024-10-01", "platform-partnership"),
  d("snowflake", "nvidia", 200 * M, "partnership", "2024-09-01", "strategic-partnership"),
  d("snowflake", "databricks", 150 * M, "partnership", "2024-10-01", "strategic-partnership"),
  d("helion-energy", "openai", 400 * M, "energy-contract", "2024-08-01", "power-purchase-agreement"),
  d("helion-energy", "amazon", 300 * M, "partnership", "2025-01-01", "energy-infrastructure"),

  // ── Foundational deals (always pinned in detailed mode) ──
  d("public-investment-fund", "xai", 1 * B, "investment", "2025-07-01", "growth-equity"),
  d("nvidia", "hugging-face", 200 * M, "investment", "2024-08-01", "strategic-equity"),
  d("nvidia", "runway", 150 * M, "investment", "2024-06-01", "strategic-equity"),
  d("united-states", "openai", 200 * M, "grant", "2024-07-01", "government-grant"),
  d("intel", "hugging-face", 80 * M, "investment", "2024-08-01", "strategic-equity"),
  d("microsoft", "g42", 1.5 * B, "partnership", "2024-04-01", "sovereign-partnership"),
  d("nvidia", "g42", 500 * M, "supply", "2024-07-01", "hardware-supply"),
];
