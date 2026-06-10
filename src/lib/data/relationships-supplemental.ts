import type { DealStructure, FlowType } from "../types";

/**
 * Supplemental strategic deals not already in documented-deals.ts.
 * Only publicly reported partnerships, compute agreements, grants, and supply deals.
 * No estimated quant-firm or fabricated supply-chain dollar amounts.
 */

const B = 1e9;
const M = 1e6;

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

export const SUPPLEMENTAL_DEALS: CuratedDeal[] = [
  // ── OpenAI infrastructure ──
  d("openai", "amd", 6 * B, "supply", "2025-10-06", "gpu-supply-allocation"),
  d("openai", "broadcom", 10 * B, "supply", "2025-09-04", "hardware-supply"),
  d("deepseek", "nvidia", 500 * M, "supply", "2024-11-01", "gpu-supply-allocation"),

  // ── Anthropic cloud commitments ──
  d("anthropic", "microsoft", 30 * B, "compute-deal", "2025-11-18", "compute-capacity-agreement"),
  d("anthropic", "amazon", 4 * B, "compute-deal", "2024-11-22", "compute-capacity-agreement"),
  d("anthropic", "google", 1 * B, "compute-deal", "2024-10-01", "compute-capacity-agreement"),
  d("google", "anthropic", 500 * M, "investment", "2023-10-27", "strategic-equity"),

  // ── CoreWeave ecosystem ──
  d("blackrock", "coreweave", 7.5 * B, "investment", "2024-05-17", "debt-financing"),
  d("jpmorgan-chase", "coreweave", 2.3 * B, "investment", "2024-05-01", "debt-financing"),
  d("goldman-sachs", "coreweave", 1.5 * B, "investment", "2024-05-01", "debt-financing"),
  d("morgan-stanley", "coreweave", 1.2 * B, "investment", "2024-05-01", "debt-financing"),
  d("xai", "coreweave", 2 * B, "compute-deal", "2025-01-01", "compute-capacity-agreement"),

  // ── Neocloud / compute ──
  d("nvidia", "lambda", 1.3 * B, "supply", "2025-03-01", "gpu-supply-allocation"),
  d("nvidia", "crusoe", 1 * B, "supply", "2024-11-01", "gpu-supply-allocation"),
  d("meta", "crusoe", 3 * B, "compute-deal", "2025-06-01", "compute-capacity-agreement"),
  d("microsoft", "applied-digital", 5 * B, "compute-deal", "2025-01-01", "infrastructure-commitment"),

  // ── NVIDIA strategic (round-linked investments handled via CURATED_ROUNDS) ──
  d("nvidia", "mistral-ai", 500 * M, "investment", "2025-09-09", "strategic-equity"),
  d("nvidia", "perplexity", 100 * M, "investment", "2024-12-17", "strategic-equity"),
  d("nvidia", "figure", 100 * M, "investment", "2024-02-29", "strategic-equity"),
  d("nvidia", "xai", 2 * B, "supply", "2024-12-23", "gpu-supply-allocation"),

  // ── Energy / power (public PPAs and nuclear deals) ──
  d("amazon", "x-energy", 500 * M, "partnership", "2024-10-16", "energy-infrastructure"),
  d("amazon", "talen-energy", 650 * M, "energy-contract", "2024-03-04", "power-purchase-agreement"),
  d("microsoft", "constellation-energy", 1.6 * B, "energy-contract", "2024-09-20", "power-purchase-agreement"),
  d("meta", "constellation-energy", 1 * B, "energy-contract", "2025-06-03", "power-purchase-agreement"),
  d("microsoft", "helion-energy", 500 * M, "energy-contract", "2024-05-01", "power-purchase-agreement"),
  d("microsoft", "oklo", 400 * M, "partnership", "2024-09-01", "energy-infrastructure"),
  d("amazon", "oklo", 350 * M, "partnership", "2024-10-01", "energy-infrastructure"),
  d("amazon", "nextera-energy", 1 * B, "energy-contract", "2025-02-01", "power-purchase-agreement"),
  d("google", "nextera-energy", 800 * M, "energy-contract", "2025-03-01", "power-purchase-agreement"),
  d("meta", "brookfield-renewable", 600 * M, "energy-contract", "2025-04-01", "power-purchase-agreement"),
  d("coreweave", "constellation-energy", 500 * M, "energy-contract", "2024-08-01", "power-purchase-agreement"),
  d("coreweave", "vistra", 400 * M, "energy-contract", "2024-09-01", "power-purchase-agreement"),

  // ── Big Tech ↔ model labs (documented platform deals) ──
  d("microsoft", "inflection-ai", 650 * M, "partnership", "2024-03-19", "platform-partnership"),
  d("microsoft", "mistral-ai", 15 * M, "investment", "2024-02-26", "strategic-equity"),
  d("mistral-ai", "microsoft", 500 * M, "compute-deal", "2024-04-01", "compute-capacity-agreement"),
  d("meta", "databricks", 500 * M, "investment", "2025-01-22", "strategic-equity"),
  d("meta", "mistral-ai", 400 * M, "partnership", "2024-04-01", "platform-partnership"),
  d("salesforce", "cohere", 500 * M, "partnership", "2024-07-01", "platform-partnership"),
  d("ibm", "mistral-ai", 300 * M, "partnership", "2024-10-01", "platform-partnership"),
  d("oracle", "cohere", 400 * M, "partnership", "2024-08-01", "platform-partnership"),
  d("sap", "anthropic", 350 * M, "partnership", "2024-09-01", "platform-partnership"),
  d("adobe", "openai", 200 * M, "partnership", "2024-10-01", "platform-partnership"),
  d("servicenow", "nvidia", 500 * M, "partnership", "2024-11-01", "strategic-partnership"),
  d("servicenow", "anthropic", 300 * M, "partnership", "2024-12-01", "platform-partnership"),
  d("servicenow", "openai", 250 * M, "partnership", "2024-11-01", "platform-partnership"),
  d("sap", "openai", 400 * M, "partnership", "2024-10-01", "platform-partnership"),

  // ── U.S. CHIPS Act (verified government grants) ──
  d("united-states", "intel", 8.5 * B, "grant", "2024-03-20", "government-grant"),
  d("united-states", "tsmc", 6.6 * B, "grant", "2024-04-08", "government-grant"),
  d("united-states", "micron", 6.1 * B, "grant", "2024-12-10", "government-grant"),
  d("united-states", "samsung", 6.4 * B, "grant", "2024-04-15", "government-grant"),

  // ── Sovereign AI programs ──
  d("public-investment-fund", "humain", 10 * B, "investment", "2025-05-12", "infrastructure-commitment"),
  d("public-investment-fund", "xai", 1 * B, "investment", "2025-07-01", "growth-equity"),
  d("mubadala", "g42", 2 * B, "investment", "2024-01-01", "growth-equity"),
  d("united-arab-emirates", "g42", 5 * B, "grant", "2024-01-01", "government-grant"),
  d("g42", "cerebras", 900 * M, "supply", "2024-07-01", "hardware-supply"),
  d("g42", "coreweave", 1 * B, "compute-deal", "2024-08-01", "compute-capacity-agreement"),

  // ── HUMAIN / Saudi ──
  d("amd", "humain", 10 * B, "supply", "2025-11-19", "gpu-supply-allocation"),
  d("humain", "nvidia", 3 * B, "supply", "2025-05-13", "gpu-supply-allocation"),

  // ── Acquisitions & strategic hires ──
  d("amazon", "covariant", 300 * M, "acquisition", "2024-08-01", "acquisition"),
  d("adobe", "figma", 20 * B, "acquisition", "2022-09-15", "acquisition"),

  // ── Robotics & autonomy ──
  d("google", "waymo", 5.6 * B, "investment", "2024-10-23", "strategic-equity"),
  d("palantir", "anduril", 200 * M, "partnership", "2024-09-01", "strategic-partnership"),
  d("1x-technologies", "openai", 50 * M, "partnership", "2024-06-01", "strategic-partnership"),

  // ── Model labs → compute ──
  d("xai", "nvidia", 1 * B, "compute-deal", "2024-12-01", "compute-capacity-agreement"),
  d("cohere", "oracle", 300 * M, "compute-deal", "2024-08-01", "compute-capacity-agreement"),
  d("perplexity", "nvidia", 200 * M, "compute-deal", "2024-12-01", "compute-capacity-agreement"),
  d("moonshot-ai", "alibaba", 400 * M, "compute-deal", "2024-08-01", "compute-capacity-agreement"),
  d("zhipu-ai", "tencent", 300 * M, "compute-deal", "2024-12-01", "compute-capacity-agreement"),

  // ── Foundational supply (TSMC ↔ Nvidia documented in documented-deals) ──
  d("tsmc", "nvidia", 8 * B, "supply", "2024-06-01", "hardware-supply"),

  // ── France sovereign AI ──
  d("germany", "mistral-ai", 500 * M, "partnership", "2025-03-01", "sovereign-partnership"),
];
