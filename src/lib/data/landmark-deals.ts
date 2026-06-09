import type { MapComplexity } from "../metrics/graph-complexity";

/**
 * Foundational AI economy relationships that must remain visible at each
 * complexity tier regardless of the value-based edge cap.
 */
export interface LandmarkDeal {
  sourceId: string;
  targetId: string;
  /** Shown in tooltips / edge emphasis */
  label: string;
  /** Lowest complexity tier where this edge is always pinned */
  minTier: MapComplexity;
}

const O: MapComplexity = "overview";
const S: MapComplexity = "standard";
const D: MapComplexity = "detailed";

export const LANDMARK_DEALS: LandmarkDeal[] = [
  // ── Foundation model funding (overview) ──
  { sourceId: "microsoft", targetId: "openai", label: "OpenAI strategic partnership", minTier: O },
  { sourceId: "nvidia", targetId: "openai", label: "Nvidia ↔ OpenAI", minTier: O },
  { sourceId: "softbank", targetId: "openai", label: "SoftBank $40B OpenAI round", minTier: O },
  { sourceId: "thrive-capital", targetId: "openai", label: "OpenAI $6.6B round", minTier: O },
  { sourceId: "amazon", targetId: "anthropic", label: "Amazon $8B Anthropic total", minTier: O },
  { sourceId: "google", targetId: "anthropic", label: "Google Anthropic backer", minTier: O },
  { sourceId: "microsoft", targetId: "anthropic", label: "Microsoft $5B Anthropic", minTier: O },
  { sourceId: "nvidia", targetId: "anthropic", label: "Nvidia $10B Anthropic", minTier: O },
  { sourceId: "anthropic", targetId: "microsoft", label: "Anthropic $30B Azure compute", minTier: O },
  { sourceId: "anthropic", targetId: "amazon", label: "Anthropic AWS training", minTier: O },
  { sourceId: "anthropic", targetId: "google", label: "Anthropic GCP / TPU", minTier: O },
  { sourceId: "andreessen-horowitz", targetId: "xai", label: "xAI Series B/C", minTier: O },
  { sourceId: "nvidia", targetId: "xai", label: "Nvidia ↔ xAI Colossus", minTier: O },
  { sourceId: "microsoft", targetId: "mistral-ai", label: "Microsoft ↔ Mistral", minTier: O },
  { sourceId: "nvidia", targetId: "mistral-ai", label: "Nvidia ↔ Mistral", minTier: O },
  { sourceId: "nvidia", targetId: "cohere", label: "Nvidia ↔ Cohere", minTier: O },
  { sourceId: "google", targetId: "character-ai", label: "Google ↔ Character.AI", minTier: O },
  { sourceId: "meta", targetId: "scale-ai", label: "Meta ↔ Scale AI", minTier: O },

  // ── Compute / neocloud (overview) ──
  { sourceId: "nvidia", targetId: "coreweave", label: "Nvidia ↔ CoreWeave GPUs", minTier: O },
  { sourceId: "microsoft", targetId: "coreweave", label: "Microsoft ↔ CoreWeave", minTier: O },
  { sourceId: "meta", targetId: "coreweave", label: "Meta $14B CoreWeave", minTier: O },
  { sourceId: "openai", targetId: "coreweave", label: "OpenAI ↔ CoreWeave", minTier: O },
  { sourceId: "jane-street", targetId: "coreweave", label: "Jane Street ↔ CoreWeave", minTier: O },
  { sourceId: "openai", targetId: "oracle", label: "OpenAI $20B Oracle compute", minTier: O },
  { sourceId: "microsoft", targetId: "nebius", label: "Microsoft ↔ Nebius", minTier: O },
  { sourceId: "nvidia", targetId: "lambda", label: "Nvidia ↔ Lambda", minTier: O },

  // ── Infrastructure supply chain (overview) ──
  { sourceId: "tsmc", targetId: "nvidia", label: "TSMC ↔ Nvidia foundry", minTier: O },
  { sourceId: "nvidia", targetId: "microsoft", label: "Nvidia GPUs → Azure", minTier: S },
  { sourceId: "nvidia", targetId: "meta", label: "Nvidia GPUs → Meta", minTier: S },
  { sourceId: "nvidia", targetId: "amazon", label: "Nvidia GPUs → AWS", minTier: S },
  { sourceId: "nvidia", targetId: "google", label: "Nvidia GPUs → Google", minTier: S },
  { sourceId: "amd", targetId: "microsoft", label: "AMD ↔ Microsoft", minTier: S },
  { sourceId: "amd", targetId: "meta", label: "AMD ↔ Meta", minTier: S },
  { sourceId: "openai", targetId: "amd", label: "OpenAI ↔ AMD", minTier: S },
  { sourceId: "openai", targetId: "broadcom", label: "OpenAI ↔ Broadcom", minTier: S },

  // ── Major VC / growth (standard) ──
  { sourceId: "nvidia", targetId: "databricks", label: "Nvidia ↔ Databricks", minTier: S },
  { sourceId: "thrive-capital", targetId: "databricks", label: "Databricks $10B round", minTier: S },
  { sourceId: "nvidia", targetId: "perplexity", label: "Nvidia ↔ Perplexity", minTier: S },
  { sourceId: "nvidia", targetId: "scale-ai", label: "Nvidia ↔ Scale AI", minTier: S },
  { sourceId: "sequoia-capital", targetId: "safe-superintelligence", label: "SSI / Sequoia", minTier: S },
  { sourceId: "microsoft", targetId: "inflection-ai", label: "Microsoft ↔ Inflection", minTier: S },
  { sourceId: "nvidia", targetId: "inflection-ai", label: "Nvidia ↔ Inflection", minTier: S },
  { sourceId: "insight-partners", targetId: "cohere", label: "Cohere Series D", minTier: S },
  { sourceId: "coatue", targetId: "perplexity", label: "Perplexity Series D", minTier: S },
  { sourceId: "general-catalyst", targetId: "mistral-ai", label: "Mistral funding", minTier: S },
  { sourceId: "andreessen-horowitz", targetId: "mistral-ai", label: "a16z ↔ Mistral", minTier: S },

  // ── Energy (standard) ──
  { sourceId: "microsoft", targetId: "oklo", label: "Microsoft ↔ Oklo nuclear", minTier: S },
  { sourceId: "google", targetId: "kairos-power", label: "Google ↔ Kairos Power", minTier: S },
  { sourceId: "amazon", targetId: "talen-energy", label: "Amazon ↔ Talen Energy", minTier: S },
  { sourceId: "microsoft", targetId: "helion-energy", label: "Microsoft ↔ Helion", minTier: S },
  { sourceId: "meta", targetId: "brookfield-renewable", label: "Meta renewable PPA", minTier: S },

  // ── Sovereign / government (standard) ──
  { sourceId: "public-investment-fund", targetId: "xai", label: "PIF ↔ xAI", minTier: S },
  { sourceId: "mgx", targetId: "openai", label: "MGX ↔ OpenAI", minTier: S },
  { sourceId: "mgx", targetId: "xai", label: "MGX ↔ xAI", minTier: S },
  { sourceId: "united-states", targetId: "openai", label: "US govt ↔ OpenAI", minTier: S },
  { sourceId: "france", targetId: "mistral-ai", label: "France ↔ Mistral", minTier: S },
  { sourceId: "united-arab-emirates", targetId: "g42", label: "UAE ↔ G42", minTier: S },
  { sourceId: "g42", targetId: "cerebras", label: "G42 ↔ Cerebras", minTier: S },

  // ── Robotics / autonomy (standard) ──
  { sourceId: "nvidia", targetId: "figure", label: "Nvidia ↔ Figure", minTier: S },
  { sourceId: "amazon", targetId: "figure", label: "Amazon ↔ Figure", minTier: S },
  { sourceId: "google", targetId: "waymo", label: "Alphabet ↔ Waymo", minTier: S },
  { sourceId: "nvidia", targetId: "wayve", label: "Nvidia ↔ Wayve", minTier: S },
  { sourceId: "softbank", targetId: "nuro", label: "SoftBank ↔ Nuro", minTier: S },
  { sourceId: "nvidia", targetId: "sanctuary-ai", label: "Nvidia ↔ Sanctuary", minTier: S },

  // ── Enterprise AI / agents (detailed) ──
  { sourceId: "salesforce", targetId: "anthropic", label: "Salesforce ↔ Anthropic", minTier: D },
  { sourceId: "nvidia", targetId: "harvey", label: "Nvidia ↔ Harvey", minTier: D },
  { sourceId: "andreessen-horowitz", targetId: "harvey", label: "a16z ↔ Harvey", minTier: D },
  { sourceId: "andreessen-horowitz", targetId: "cursor", label: "a16z ↔ Cursor", minTier: D },
  { sourceId: "andreessen-horowitz", targetId: "elevenlabs", label: "a16z ↔ ElevenLabs", minTier: D },
  { sourceId: "nvidia", targetId: "runway", label: "Nvidia ↔ Runway", minTier: D },
  { sourceId: "google", targetId: "midjourney", label: "Google ↔ Midjourney", minTier: D },
  { sourceId: "nvidia", targetId: "midjourney", label: "Nvidia ↔ Midjourney", minTier: D },
  { sourceId: "nvidia", targetId: "hugging-face", label: "Nvidia ↔ Hugging Face", minTier: D },
  { sourceId: "salesforce", targetId: "writer", label: "Salesforce ↔ Writer", minTier: D },
  { sourceId: "microsoft", targetId: "openai", label: "OpenAI Azure compute", minTier: D },
  { sourceId: "openai", targetId: "microsoft", label: "OpenAI → Azure capacity", minTier: D },
  { sourceId: "apple", targetId: "openai", label: "Apple ↔ OpenAI", minTier: D },
  { sourceId: "sap", targetId: "anthropic", label: "SAP ↔ Anthropic", minTier: D },
  { sourceId: "servicenow", targetId: "anthropic", label: "ServiceNow ↔ Anthropic", minTier: D },
  { sourceId: "ibm", targetId: "mistral-ai", label: "IBM ↔ Mistral", minTier: D },
  { sourceId: "oracle", targetId: "cohere", label: "Oracle ↔ Cohere", minTier: D },
  { sourceId: "nvidia", targetId: "together-ai", label: "Nvidia ↔ Together AI", minTier: D },
  { sourceId: "nvidia", targetId: "fireworks-ai", label: "Nvidia ↔ Fireworks", minTier: D },
  { sourceId: "nvidia", targetId: "cerebras", label: "Nvidia ↔ Cerebras", minTier: D },
  { sourceId: "nvidia", targetId: "groq", label: "Nvidia ↔ Groq", minTier: D },
  { sourceId: "nvidia", targetId: "sambanova", label: "Nvidia ↔ SambaNova", minTier: D },
  { sourceId: "softbank", targetId: "sambanova", label: "SoftBank ↔ SambaNova", minTier: D },
  { sourceId: "blackrock", targetId: "coreweave", label: "BlackRock ↔ CoreWeave debt", minTier: D },
  { sourceId: "jpmorgan-chase", targetId: "coreweave", label: "JPMorgan ↔ CoreWeave", minTier: D },
  { sourceId: "citadel", targetId: "coreweave", label: "Citadel ↔ CoreWeave", minTier: D },
  { sourceId: "jane-street", targetId: "nvidia", label: "Jane Street ↔ Nvidia GPUs", minTier: D },
  { sourceId: "citadel", targetId: "nvidia", label: "Citadel ↔ Nvidia GPUs", minTier: D },
  { sourceId: "deepseek", targetId: "nvidia", label: "DeepSeek ↔ Nvidia", minTier: D },
  { sourceId: "bytedance", targetId: "nvidia", label: "ByteDance ↔ Nvidia", minTier: D },
  { sourceId: "tencent", targetId: "zhipu-ai", label: "Tencent ↔ Zhipu", minTier: D },
  { sourceId: "alibaba", targetId: "moonshot-ai", label: "Alibaba ↔ Moonshot", minTier: D },
  { sourceId: "microsoft", targetId: "iren", label: "Microsoft ↔ IREN", minTier: D },
  { sourceId: "amazon", targetId: "oklo", label: "Amazon ↔ Oklo", minTier: D },
  { sourceId: "qualcomm", targetId: "meta", label: "Qualcomm ↔ Meta", minTier: D },
  { sourceId: "adobe", targetId: "figma", label: "Adobe ↔ Figma acquisition", minTier: D },
  { sourceId: "amazon", targetId: "covariant", label: "Amazon ↔ Covariant", minTier: D },
  { sourceId: "palantir", targetId: "anduril", label: "Palantir ↔ Anduril", minTier: D },
  { sourceId: "united-states", targetId: "anduril", label: "US govt ↔ Anduril", minTier: D },
];

const TIER_RANK: Record<MapComplexity, number> = {
  overview: 0,
  standard: 1,
  detailed: 2,
  complete: 3,
};

export function landmarkKey(sourceId: string, targetId: string): string {
  return `${sourceId}|${targetId}`;
}

/** Landmarks pinned at the given complexity tier (and above, below complete). */
export function landmarksForTier(complexity: MapComplexity): Set<string> {
  if (complexity === "complete") return new Set();
  const rank = TIER_RANK[complexity];
  const keys = new Set<string>();
  for (const lm of LANDMARK_DEALS) {
    if (TIER_RANK[lm.minTier] <= rank) {
      keys.add(landmarkKey(lm.sourceId, lm.targetId));
    }
  }
  return keys;
}

export function landmarkLabel(sourceId: string, targetId: string): string | undefined {
  return LANDMARK_DEALS.find(
    (l) => l.sourceId === sourceId && l.targetId === targetId
  )?.label;
}
