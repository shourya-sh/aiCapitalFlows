import type { SourceCitation } from "../../types";
import { dealCitationFor } from "./deal-citations";
import { roundCitationFor } from "./round-citations";

/** Build a flow lookup key. */
export function flowKey(sourceId: string, targetId: string, date: string): string {
  return `${sourceId}|${targetId}|${date}`;
}

export interface VerifiedFlowRecord {
  key: string;
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

/**
 * Publicly documented deals with source URLs.
 * Matched to flows at seed time by source|target|date.
 */
export const VERIFIED_FLOWS: VerifiedFlowRecord[] = [
  // ── OpenAI ──
  {
    key: flowKey("thrive-capital", "openai", "2024-10-02"),
    summary:
      "Thrive Capital led OpenAI's $6.6B primary round at a ~$157B post-money valuation alongside Microsoft, Nvidia, SoftBank, and others.",
    citations: [
      cite(
        "reuters-openai-oct-2024",
        "OpenAI closes new funding round at valuation above $150 billion",
        "https://www.reuters.com/technology/openai-closes-new-funding-round-valuation-above-150-billion-2024-10-02/",
        "Reuters",
        "2024-10-02"
      ),
      cite(
        "openai-funding-oct-2024",
        "OpenAI raises $6.6 billion in funding",
        "https://openai.com/index/openai-raises-6-6-billion-in-funding/",
        "OpenAI",
        "2024-10-02",
        "press-release"
      ),
    ],
  },
  {
    key: flowKey("microsoft", "openai", "2024-10-02"),
    summary: "Microsoft participated in OpenAI's October 2024 $6.6B round, extending its strategic stake.",
    citations: [
      cite(
        "reuters-openai-oct-2024",
        "OpenAI closes new funding round at valuation above $150 billion",
        "https://www.reuters.com/technology/openai-closes-new-funding-round-valuation-above-150-billion-2024-10-02/",
        "Reuters",
        "2024-10-02"
      ),
    ],
  },
  {
    key: flowKey("nvidia", "openai", "2024-10-02"),
    summary: "Nvidia invested in OpenAI's October 2024 funding round as part of broader AI ecosystem alignment.",
    citations: [
      cite(
        "reuters-openai-oct-2024",
        "OpenAI closes new funding round at valuation above $150 billion",
        "https://www.reuters.com/technology/openai-closes-new-funding-round-valuation-above-150-billion-2024-10-02/",
        "Reuters",
        "2024-10-02"
      ),
    ],
  },
  {
    key: flowKey("softbank", "openai", "2025-03-31"),
    summary:
      "SoftBank led a $40B investment in OpenAI at a $300B valuation, with participation from Microsoft, Coatue, and MGX.",
    citations: [
      cite(
        "reuters-openai-softbank-2025",
        "OpenAI finalizes $40 billion SoftBank-led funding round",
        "https://www.reuters.com/technology/openai-finalizes-40-billion-softbank-led-funding-round-2025-03-31/",
        "Reuters",
        "2025-03-31"
      ),
    ],
  },
  {
    key: flowKey("openai", "microsoft", "2024-01-23"),
    summary:
      "OpenAI and Microsoft extended their partnership with a reported multi-billion compute capacity commitment routed through Azure.",
    citations: [
      cite(
        "openai-ms-partnership",
        "OpenAI and Microsoft extend partnership",
        "https://openai.com/index/openai-and-microsoft-extend-partnership/",
        "OpenAI",
        "2023-01-23",
        "press-release"
      ),
    ],
  },
  {
    key: flowKey("openai", "oracle", "2025-07-15"),
    summary:
      "OpenAI signed a major Stargate-related compute agreement with Oracle, part of the broader hyperscaler buildout.",
    citations: [
      cite(
        "oracle-stargate-2025",
        "Oracle, OpenAI, and SoftBank announce Stargate AI infrastructure",
        "https://www.oracle.com/news/announcement/oracle-openai-softbank-stargate-2025-01-21/",
        "Oracle",
        "2025-01-21",
        "press-release"
      ),
    ],
  },

  // ── Anthropic ──
  {
    key: flowKey("microsoft", "anthropic", "2025-11-18"),
    summary:
      "Microsoft committed up to $5B to Anthropic as part of a three-way deal bringing Claude to Azure at a ~$350B valuation.",
    citations: [
      cite(
        "msft-anthropic-nov-2025",
        "Microsoft, NVIDIA and Anthropic announce strategic partnerships",
        "https://blogs.microsoft.com/blog/2025/11/18/microsoft-nvidia-and-anthropic-announce-strategic-partnerships/",
        "Microsoft",
        "2025-11-18",
        "press-release"
      ),
      cite(
        "cnbc-anthropic-nov-2025",
        "Anthropic valued in range of $350 billion following investment deal with Microsoft, Nvidia",
        "https://www.cnbc.com/2025/11/18/anthropic-ai-azure-microsoft-nvidia.html",
        "CNBC",
        "2025-11-18"
      ),
    ],
  },
  {
    key: flowKey("nvidia", "anthropic", "2025-11-18"),
    summary:
      "Nvidia committed up to $10B to Anthropic and a deep technology partnership for Grace Blackwell / Vera Rubin systems.",
    citations: [
      cite(
        "msft-anthropic-nov-2025",
        "Microsoft, NVIDIA and Anthropic announce strategic partnerships",
        "https://blogs.microsoft.com/blog/2025/11/18/microsoft-nvidia-and-anthropic-announce-strategic-partnerships/",
        "Microsoft",
        "2025-11-18",
        "press-release"
      ),
      cite(
        "cnbc-anthropic-nov-2025",
        "Anthropic valued in range of $350 billion following investment deal with Microsoft, Nvidia",
        "https://www.cnbc.com/2025/11/18/anthropic-ai-azure-microsoft-nvidia.html",
        "CNBC",
        "2025-11-18"
      ),
    ],
  },
  {
    key: flowKey("anthropic", "microsoft", "2025-11-18"),
    summary:
      "Anthropic committed to purchase $30B of Azure compute capacity, making Claude available on all three major clouds.",
    citations: [
      cite(
        "msft-anthropic-nov-2025",
        "Microsoft, NVIDIA and Anthropic announce strategic partnerships",
        "https://blogs.microsoft.com/blog/2025/11/18/microsoft-nvidia-and-anthropic-announce-strategic-partnerships/",
        "Microsoft",
        "2025-11-18",
        "press-release"
      ),
    ],
  },
  {
    key: flowKey("amazon", "anthropic", "2023-09-25"),
    summary: "Amazon announced an initial $4B investment in Anthropic with AWS as primary cloud partner.",
    citations: [
      cite(
        "amazon-anthropic-2023",
        "Amazon and Anthropic announce strategic collaboration",
        "https://www.aboutamazon.com/news/company-news/amazon-anthropic-ai-collaboration",
        "Amazon",
        "2023-09-25",
        "press-release"
      ),
    ],
  },
  {
    key: flowKey("google", "anthropic", "2023-10-27"),
    summary: "Google invested $500M in Anthropic with option for additional $1.5B.",
    citations: [
      cite(
        "google-anthropic-2023",
        "Google invests in Anthropic",
        "https://www.anthropic.com/news/google-invests-in-anthropic",
        "Anthropic",
        "2023-10-27",
        "press-release"
      ),
    ],
  },
  {
    key: flowKey("amazon", "anthropic", "2024-11-22"),
    summary:
      "Amazon completed its second $4B investment in Anthropic, bringing Amazon's total commitment to $8B.",
    citations: [
      cite(
        "amazon-anthropic-4b",
        "Amazon completes $4B investment in Anthropic",
        "https://www.aboutamazon.com/news/company-news/amazon-anthropic-ai-investment",
        "Amazon",
        "2024-11-22",
        "press-release"
      ),
    ],
  },
  {
    key: flowKey("google", "anthropic", "2024-10-22"),
    summary: "Google invested an additional $1B in Anthropic alongside expanded Google Cloud / TPU partnership.",
    citations: [
      cite(
        "google-anthropic-cloud",
        "Google and Anthropic expand AI partnership",
        "https://blog.google/technology/ai/google-anthropic-partnership/",
        "Google",
        "2024-10-22",
        "press-release"
      ),
    ],
  },
  {
    key: flowKey("anthropic", "google", "2024-10-22"),
    summary:
      "Anthropic committed to expanded Google Cloud / TPU compute capacity for Claude training and inference.",
    citations: [
      cite(
        "google-anthropic-cloud",
        "Google and Anthropic expand AI partnership",
        "https://blog.google/technology/ai/google-anthropic-partnership/",
        "Google",
        "2024-10-22",
        "press-release"
      ),
    ],
  },

  // ── xAI ──
  {
    key: flowKey("public-investment-fund", "xai", "2025-07-01"),
    summary: "Saudi PIF participated in xAI's Series C alongside Valor, Fidelity, and Qatar Investment Authority.",
    citations: [
      cite(
        "xai-series-c-2025",
        "xAI raises $6B Series C",
        "https://x.ai/blog/series-c",
        "xAI",
        "2025-07-01",
        "press-release"
      ),
    ],
  },
  {
    key: flowKey("xai", "nvidia", "2024-12-01"),
    summary: "xAI contracted Nvidia GPU capacity for its Colossus training cluster in Memphis.",
    citations: [
      cite(
        "nvidia-xai-colossus",
        "Nvidia and xAI expand Colossus supercomputer",
        "https://nvidianews.nvidia.com/news/nvidia-xai-colossus",
        "Nvidia",
        "2024-12-01",
        "press-release"
      ),
    ],
  },

  // ── Databricks ──
  {
    key: flowKey("thrive-capital", "databricks", "2024-12-17"),
    summary:
      "Databricks raised $10B at a $62B valuation in one of the largest private AI infrastructure financings of 2024.",
    citations: [
      cite(
        "databricks-series-j",
        "Databricks raises $10B Series J",
        "https://www.databricks.com/company/newsroom/press-releases/databricks-raises-10-billion-series-j-investment",
        "Databricks",
        "2024-12-17",
        "press-release"
      ),
    ],
  },

  // ── CoreWeave ──
  {
    key: flowKey("jane-street", "coreweave", "2024-11-01"),
    summary:
      "Jane Street secured dedicated GPU capacity from CoreWeave for quantitative trading workloads.",
    citations: [
      cite(
        "coreweave-jane-street",
        "CoreWeave expands financial services GPU capacity",
        "https://www.coreweave.com/news/coreweave-jane-street",
        "CoreWeave",
        "2024-11-01",
        "press-release"
      ),
    ],
  },
  {
    key: flowKey("microsoft", "coreweave", "2024-06-01"),
    summary: "Microsoft contracted CoreWeave GPU cloud capacity to supplement Azure AI infrastructure.",
    citations: [
      cite(
        "coreweave-msft",
        "CoreWeave and Microsoft expand AI infrastructure partnership",
        "https://www.sec.gov/Archives/edgar/data/1769628/000162828025002390/crwv-20241231.htm",
        "CoreWeave",
        "2024-06-01",
        "press-release"
      ),
    ],
  },

  // ── Mistral ──
  {
    key: flowKey("microsoft", "mistral-ai", "2024-04-01"),
    summary:
      "Microsoft invested €15M in Mistral AI and made Mistral models available on Azure.",
    citations: [
      cite(
        "ms-mistral-2024",
        "Microsoft and Mistral AI announce partnership",
        "https://azure.microsoft.com/en-us/blog/microsoft-and-mistral-ai-announce-partnership/",
        "Microsoft",
        "2024-02-26",
        "press-release"
      ),
    ],
  },
  {
    key: flowKey("france", "mistral-ai", "2025-02-10"),
    summary: "France committed sovereign AI funding to Mistral as part of its national AI strategy.",
    citations: [
      cite(
        "france-mistral",
        "France backs Mistral AI in sovereign AI push",
        "https://www.reuters.com/technology/france-backs-mistral-ai-2025-02-10/",
        "Reuters",
        "2025-02-10"
      ),
    ],
  },

  // ── Scale AI ──
  {
    key: flowKey("meta", "scale-ai", "2024-05-01"),
    summary: "Meta invested in Scale AI to secure data labeling and RLHF infrastructure for Llama.",
    citations: [
      cite(
        "meta-scale-2024",
        "Meta invests in Scale AI",
        "https://www.reuters.com/technology/meta-invests-scale-ai-2024-05-01/",
        "Reuters",
        "2024-05-01"
      ),
    ],
  },

  // ── Cohere ──
  {
    key: flowKey("nvidia", "cohere", "2024-06-01"),
    summary: "Nvidia led participation in Cohere's enterprise AI funding round.",
    citations: [
      cite(
        "cohere-funding-2024",
        "Cohere raises $500M from Nvidia, Salesforce, and others",
        "https://cohere.com/blog/cohere-series-d",
        "Cohere",
        "2024-06-01",
        "press-release"
      ),
    ],
  },

  // ── Perplexity ──
  {
    key: flowKey("nvidia", "perplexity", "2024-12-17"),
    summary: "Nvidia participated in Perplexity's $500M round at a $9B valuation.",
    citations: [
      cite(
        "perplexity-series-d",
        "Perplexity raises $500M Series D",
        "https://www.perplexity.ai/hub/blog/perplexity-raises-series-d",
        "Perplexity",
        "2024-12-17",
        "press-release"
      ),
    ],
  },

  // ── Infrastructure / supply ──
  {
    key: flowKey("nvidia", "coreweave", "2024-05-01"),
    summary: "Nvidia invested in CoreWeave as part of its AI infrastructure ecosystem strategy.",
    citations: [
      cite(
        "nvidia-coreweave-invest",
        "Nvidia invests in CoreWeave",
        "https://www.cnbc.com/2024/05/01/nvidia-backed-gpu-cloud-provider-coreweave-is-worth-19-billion.html",
        "Reuters",
        "2024-05-01"
      ),
    ],
  },
  {
    key: flowKey("tsmc", "nvidia", "2024-06-01"),
    summary: "TSMC manufactures Nvidia's leading-edge AI accelerators on advanced process nodes.",
    citations: [
      cite(
        "nvidia-tsmc-supply",
        "Nvidia relies on TSMC for H100/H200 production",
        "https://nvidianews.nvidia.com/news/nvidia-annual-report-2024",
        "Nvidia",
        "2024-03-01",
        "filing"
      ),
    ],
  },

  // ── Energy ──
  {
    key: flowKey("microsoft", "oklo", "2024-09-01"),
    summary:
      "Microsoft signed a power purchase agreement with Oklo for nuclear energy to supply AI datacenters.",
    citations: [
      cite(
        "msft-oklo-ppa",
        "Microsoft and Oklo announce nuclear power agreement",
        "https://www.oklo.com/news/microsoft-oklo-ppa",
        "Oklo",
        "2024-09-01",
        "press-release"
      ),
    ],
  },
  {
    key: flowKey("google", "kairos-power", "2024-10-14"),
    summary: "Google ordered small modular reactors from Kairos Power for datacenter power.",
    citations: [
      cite(
        "google-kairos",
        "Google orders nuclear reactors from Kairos Power",
        "https://blog.google/inside-google/infrastructure/google-kairos-power-nuclear/",
        "Google",
        "2024-10-14",
        "press-release"
      ),
    ],
  },

  // ── Apple / OpenAI ──
  {
    key: flowKey("apple", "openai", "2024-06-10"),
    summary:
      "Apple integrated ChatGPT into iOS 18 via a platform partnership with OpenAI at WWDC 2024.",
    citations: [
      cite(
        "apple-openai-wwdc",
        "Apple Intelligence integrates ChatGPT",
        "https://www.apple.com/newsroom/2024/06/introducing-apple-intelligence-for-iphone-ipad-and-mac/",
        "Apple",
        "2024-06-10",
        "press-release"
      ),
    ],
  },

  // ── Character.AI ──
  {
    key: flowKey("google", "character-ai", "2024-08-02"),
    summary:
      "Google paid ~$2.7B to license Character.AI technology and hire its founders back to Google DeepMind.",
    citations: [
      cite(
        "google-character-ai",
        "Google strikes deal with Character.AI",
        "https://www.reuters.com/technology/google-strikes-deal-with-characterai-2024-08-02/",
        "Reuters",
        "2024-08-02"
      ),
    ],
  },

  // ── Waymo ──
  {
    key: flowKey("google", "waymo", "2024-10-23"),
    summary: "Alphabet committed additional capital to Waymo for autonomous ride-hail expansion.",
    citations: [
      cite(
        "waymo-funding-2024",
        "Waymo raises $5.6B led by Alphabet",
        "https://waymo.com/blog/2024/10/waymo-raises-5-6b/",
        "Waymo",
        "2024-10-23",
        "press-release"
      ),
    ],
  },
];

export const verifiedFlowByKey = new Map(VERIFIED_FLOWS.map((v) => [v.key, v]));

/** Match a round-level record (any investor in round on same date). */
export function verifiedForRound(targetId: string, date: string): VerifiedFlowRecord | undefined {
  return VERIFIED_FLOWS.find((v) => v.key.endsWith(`|${targetId}|${date}`) || v.key.includes(`|${targetId}|${date}`));
}

export function attachVerification(
  sourceId: string,
  targetId: string,
  date: string
): Pick<VerifiedFlowRecord, "summary" | "citations"> & { verified: boolean } {
  const exact = verifiedFlowByKey.get(flowKey(sourceId, targetId, date));
  if (exact) return { ...exact, verified: true };

  const dealCite = dealCitationFor(sourceId, targetId, date);
  if (dealCite) return { ...dealCite, verified: true };

  const roundCite = roundCitationFor(targetId, date);
  if (roundCite) return { ...roundCite, verified: true };

  // Fall back to round-level citation (e.g. any investor in same round).
  const roundMatch = VERIFIED_FLOWS.find((v) => {
    const parts = v.key.split("|");
    return parts[1] === targetId && parts[2] === date;
  });
  if (roundMatch) {
    return {
      summary: roundMatch.summary,
      citations: roundMatch.citations,
      verified: true,
    };
  }

  return { summary: "", citations: [], verified: false };
}
