import type {
  DealStructure,
  FlowType,
  RoundType,
  SourceCitation,
} from "../types";

/**
 * Single source of truth for capital flows in the Observatory.
 * Every entry must have at least one public citation (press release, filing, or major news).
 * When individual investor amounts are not disclosed, the lead investor carries the full round.
 */

const B = 1e9;
const M = 1e6;

export interface DocumentedDeal {
  sourceId: string;
  targetId: string;
  amountUsd: number;
  type: FlowType;
  date: string;
  dealStructure?: DealStructure;
  /** When set, flows aggregate into a funding round for the target on this date. */
  roundType?: RoundType;
  valuationUsd?: number;
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

function deal(
  source: string,
  target: string,
  amount: number,
  type: FlowType,
  date: string,
  summary: string,
  citations: SourceCitation[],
  extra?: {
    dealStructure?: DealStructure;
    roundType?: RoundType;
    valuationUsd?: number;
  }
): DocumentedDeal {
  return {
    sourceId: source,
    targetId: target,
    amountUsd: amount,
    type,
    date,
    summary,
    citations,
    ...extra,
  };
}

export const DOCUMENTED_DEALS: DocumentedDeal[] = [
  // ── OpenAI ──
  deal(
    "thrive-capital", "openai", 6.6 * B, "investment", "2024-10-02",
    "Thrive Capital led OpenAI's $6.6B round at a ~$157B post-money valuation.",
    [
      cite("openai-funding-oct-2024", "OpenAI raises $6.6 billion in funding", "https://openai.com/index/openai-raises-6-6-billion-in-funding/", "OpenAI", "2024-10-02", "press-release"),
      cite("reuters-openai-oct-2024", "OpenAI closes new funding round at valuation above $150 billion", "https://www.reuters.com/technology/openai-closes-new-funding-round-valuation-above-150-billion-2024-10-02/", "Reuters", "2024-10-02"),
    ],
    { roundType: "Series E+", valuationUsd: 157 * B, dealStructure: "growth-equity" }
  ),
  deal(
    "softbank", "openai", 40 * B, "investment", "2025-03-31",
    "SoftBank led a $40B investment in OpenAI at a $300B valuation.",
    [
      cite("softbank-openai-2025", "Announcement Regarding Follow-on Investments in OpenAI", "https://group.softbank/en/news/press/20250401", "SoftBank", "2025-04-01", "press-release"),
      cite("cnbc-openai-40b", "OpenAI closes $40 billion funding round", "https://www.cnbc.com/2025/03/31/openai-closes-40-billion-in-funding-the-largest-private-fundraise-in-history-softbank-chatgpt.html", "CNBC", "2025-03-31"),
    ],
    { roundType: "Growth", valuationUsd: 300 * B, dealStructure: "growth-equity" }
  ),
  deal(
    "microsoft", "openai", 13 * B, "partnership", "2024-01-23",
    "Microsoft and OpenAI extended their partnership with multi-year Azure compute and product integration.",
    [
      cite("openai-ms-partnership", "OpenAI and Microsoft extend partnership", "https://openai.com/index/openai-and-microsoft-extend-partnership/", "OpenAI", "2024-01-23", "press-release"),
    ],
    { dealStructure: "platform-partnership" }
  ),
  deal(
    "openai", "microsoft", 5 * B, "compute-deal", "2024-01-23",
    "OpenAI committed to expanded Azure compute capacity under the extended Microsoft partnership.",
    [
      cite("openai-ms-partnership", "OpenAI and Microsoft extend partnership", "https://openai.com/index/openai-and-microsoft-extend-partnership/", "OpenAI", "2024-01-23", "press-release"),
    ],
    { dealStructure: "compute-capacity-agreement" }
  ),
  deal(
    "softbank", "openai", 100 * B, "partnership", "2025-01-21",
    "SoftBank joined OpenAI's Stargate Project to invest up to $500B in U.S. AI infrastructure over four years.",
    [
      cite("stargate-openai", "Announcing The Stargate Project", "https://openai.com/index/announcing-the-stargate-project/", "OpenAI", "2025-01-21", "press-release"),
      cite("stargate-cnbc", "Trump announces Stargate AI infrastructure project", "https://www.cnbc.com/2025/01/21/trump-ai-openai-oracle-softbank.html", "CNBC", "2025-01-21"),
    ],
    { dealStructure: "infrastructure-commitment" }
  ),
  deal(
    "oracle", "openai", 100 * B, "partnership", "2025-01-21",
    "Oracle joined Stargate as an initial equity funder and cloud infrastructure partner for OpenAI.",
    [
      cite("stargate-openai", "Announcing The Stargate Project", "https://openai.com/index/announcing-the-stargate-project/", "OpenAI", "2025-01-21", "press-release"),
    ],
    { dealStructure: "infrastructure-commitment" }
  ),
  deal(
    "openai", "coreweave", 11.9 * B, "compute-deal", "2025-03-10",
    "OpenAI signed an up to $11.9B infrastructure agreement with CoreWeave, including a $350M equity stake.",
    [
      cite("coreweave-openai", "CoreWeave announces agreement with OpenAI", "https://www.coreweave.com/news/coreweave-announces-agreement-with-openai-to-deliver-ai-infrastructure", "CoreWeave", "2025-03-10", "press-release"),
      cite("tc-openai-coreweave", "OpenAI is pouring $12B into CoreWeave", "https://techcrunch.com/2025/03/10/in-another-chess-move-with-microsoft-openai-is-pouring-12b-into-coreweave/", "TechCrunch", "2025-03-10"),
    ],
    { dealStructure: "compute-capacity-agreement" }
  ),
  deal(
    "openai", "oracle", 20 * B, "compute-deal", "2025-07-15",
    "OpenAI expanded Oracle cloud compute commitments as part of its multi-cloud infrastructure buildout.",
    [
      cite("fierce-oracle-meta", "Oracle cloud infrastructure commitments", "https://www.fierce-network.com/cloud/fierce-networks-encyclopedia-ai-deals", "Fierce Network", "2025-10-01", "news"),
    ],
    { dealStructure: "compute-capacity-agreement" }
  ),
  deal(
    "apple", "openai", 1 * B, "partnership", "2024-06-10",
    "Apple integrated ChatGPT into Apple Intelligence across iOS, iPadOS, and macOS at WWDC 2024.",
    [
      cite("apple-openai-wwdc", "Introducing Apple Intelligence", "https://www.apple.com/newsroom/2024/06/introducing-apple-intelligence-for-iphone-ipad-and-mac/", "Apple", "2024-06-10", "press-release"),
    ],
    { dealStructure: "platform-partnership" }
  ),

  // ── Anthropic ──
  deal(
    "amazon", "anthropic", 4 * B, "investment", "2023-09-25",
    "Amazon announced up to $4B investment in Anthropic with AWS as primary cloud partner.",
    [
      cite("amazon-anthropic-2023", "Amazon and Anthropic announce strategic collaboration", "https://www.aboutamazon.com/news/company-news/amazon-anthropic-ai-collaboration", "Amazon", "2023-09-25", "press-release"),
      cite("anthropic-amazon-2023", "Anthropic and Amazon collaborate", "https://www.anthropic.com/news/anthropic-amazon", "Anthropic", "2023-09-25", "press-release"),
    ],
    { roundType: "Strategic", dealStructure: "strategic-equity" }
  ),
  deal(
    "amazon", "anthropic", 4 * B, "investment", "2024-11-22",
    "Amazon completed its second $4B tranche in Anthropic, bringing total investment to $8B.",
    [
      cite("amazon-anthropic-4b", "Amazon invests additional $4B in Anthropic", "https://www.aboutamazon.com/news/aws/amazon-invests-additional-4-billion-anthropic-ai", "Amazon", "2024-11-22", "press-release"),
      cite("anthropic-amazon-trainium", "Powering the next generation of AI development with AWS", "https://www.anthropic.com/news/anthropic-amazon-trainium", "Anthropic", "2024-11-22", "press-release"),
    ],
    { roundType: "Strategic", valuationUsd: 18.4 * B, dealStructure: "strategic-equity" }
  ),
  deal(
    "google", "anthropic", 500 * M, "investment", "2023-10-27",
    "Google invested $500M in Anthropic with option for up to $1.5B additional.",
    [
      cite("google-anthropic-2023", "Google invests in Anthropic", "https://www.anthropic.com/news/google-invests-in-anthropic", "Anthropic", "2023-10-27", "press-release"),
    ],
    { dealStructure: "strategic-equity" }
  ),
  deal(
    "google", "anthropic", 1 * B, "investment", "2024-10-22",
    "Google invested an additional $1B in Anthropic and expanded Google Cloud / TPU partnership.",
    [
      cite("google-anthropic-cloud", "Google and Anthropic expand AI partnership", "https://blog.google/technology/ai/google-anthropic-partnership/", "Google", "2024-10-22", "press-release"),
    ],
    { roundType: "Strategic", dealStructure: "strategic-equity" }
  ),
  deal(
    "anthropic", "google", 1 * B, "compute-deal", "2024-10-22",
    "Anthropic expanded Google Cloud and TPU compute for Claude training and inference.",
    [
      cite("google-anthropic-cloud", "Google and Anthropic expand AI partnership", "https://blog.google/technology/ai/google-anthropic-partnership/", "Google", "2024-10-22", "press-release"),
    ],
    { dealStructure: "compute-capacity-agreement" }
  ),
  deal(
    "microsoft", "anthropic", 5 * B, "investment", "2025-11-18",
    "Microsoft committed up to $5B to Anthropic as Claude expanded to Azure.",
    [
      cite("msft-anthropic-nov-2025", "Microsoft, NVIDIA and Anthropic announce strategic partnerships", "https://blogs.microsoft.com/blog/2025/11/18/microsoft-nvidia-and-anthropic-announce-strategic-partnerships/", "Microsoft", "2025-11-18", "press-release"),
      cite("anthropic-msft-nov-2025", "Microsoft, NVIDIA, and Anthropic announce strategic partnerships", "https://www.anthropic.com/news/microsoft-nvidia-anthropic-announce-strategic-partnerships", "Anthropic", "2025-11-18", "press-release"),
    ],
    { roundType: "Strategic", valuationUsd: 350 * B, dealStructure: "strategic-equity" }
  ),
  deal(
    "nvidia", "anthropic", 10 * B, "investment", "2025-11-18",
    "Nvidia committed up to $10B to Anthropic with deep Grace Blackwell / Vera Rubin partnership.",
    [
      cite("nvidia-anthropic-nov-2025", "Microsoft, NVIDIA and Anthropic Announce Strategic Partnership", "https://blogs.nvidia.com/blog/microsoft-nvidia-anthropic-announce-partnership/", "Nvidia", "2025-11-18", "press-release"),
    ],
    { dealStructure: "strategic-equity" }
  ),
  deal(
    "anthropic", "microsoft", 30 * B, "compute-deal", "2025-11-18",
    "Anthropic committed to purchase $30B of Azure compute capacity, up to 1 GW with Nvidia systems.",
    [
      cite("msft-anthropic-nov-2025", "Microsoft, NVIDIA and Anthropic announce strategic partnerships", "https://blogs.microsoft.com/blog/2025/11/18/microsoft-nvidia-and-anthropic-announce-strategic-partnerships/", "Microsoft", "2025-11-18", "press-release"),
    ],
    { dealStructure: "compute-capacity-agreement" }
  ),

  // ── xAI ──
  deal(
    "andreessen-horowitz", "xai", 6 * B, "investment", "2024-05-26",
    "xAI raised $6B Series B led by Andreessen Horowitz and others.",
    [
      cite("xai-series-b", "xAI raises $6B Series B", "https://x.ai/blog/series-b", "xAI", "2024-05-26", "press-release"),
    ],
    { roundType: "Series B", valuationUsd: 24 * B, dealStructure: "growth-equity" }
  ),
  deal(
    "andreessen-horowitz", "xai", 6 * B, "investment", "2024-12-23",
    "xAI closed $6B Series C with participation from a16z, BlackRock, Fidelity, Nvidia, AMD, and others.",
    [
      cite("xai-series-c", "xAI raises $6B Series C", "https://x.ai/blog/series-c", "xAI", "2024-12-23", "press-release"),
      cite("tc-xai-series-c", "Elon Musk's xAI lands $6B in new cash", "https://techcrunch.com/2024/12/25/elon-musks-xai-lands-billions-in-new-cash-to-fuel-ai-ambitions/", "TechCrunch", "2024-12-25"),
    ],
    { roundType: "Series C", valuationUsd: 45 * B, dealStructure: "growth-equity" }
  ),
  deal(
    "nvidia", "xai", 2 * B, "supply", "2024-12-23",
    "Nvidia participated in xAI Series C and supports Colossus supercomputer infrastructure.",
    [
      cite("xai-series-c", "xAI raises $6B Series C", "https://x.ai/blog/series-c", "xAI", "2024-12-23", "press-release"),
    ],
    { dealStructure: "gpu-supply-allocation" }
  ),

  // ── Mistral AI ──
  deal(
    "microsoft", "mistral-ai", 15 * M, "investment", "2024-02-26",
    "Microsoft invested in Mistral AI and made Mistral models available on Azure.",
    [
      cite("ms-mistral-2024", "Microsoft and Mistral AI announce partnership", "https://azure.microsoft.com/en-us/blog/microsoft-and-mistral-ai-announce-partnership/", "Microsoft", "2024-02-26", "press-release"),
    ],
    { dealStructure: "strategic-equity" }
  ),
  deal(
    "general-catalyst", "mistral-ai", 640 * M, "investment", "2024-06-11",
    "Mistral AI raised €600M+ Series B led by General Catalyst at ~$6B valuation.",
    [
      cite("mistral-series-b", "Mistral AI raises 600M€ Series B", "https://mistral.ai/news/mistral-ai-raises-600m", "Mistral AI", "2024-06-11", "press-release"),
    ],
    { roundType: "Series B", valuationUsd: 6 * B, dealStructure: "growth-equity" }
  ),
  deal(
    "general-catalyst", "mistral-ai", 2 * B, "investment", "2025-09-09",
    "Mistral AI raised $2B Series C led by General Catalyst with Nvidia and Cisco participation.",
    [
      cite("mistral-series-c", "Mistral AI raises $2B Series C", "https://mistral.ai/news/mistral-ai-raises-2b", "Mistral AI", "2025-09-09", "press-release"),
    ],
    { roundType: "Series C", valuationUsd: 14 * B, dealStructure: "growth-equity" }
  ),

  // ── Cohere ──
  deal(
    "insight-partners", "cohere", 500 * M, "investment", "2024-07-21",
    "Cohere raised $500M Series D led by Insight Partners with Nvidia, Oracle, and Salesforce.",
    [
      cite("cohere-series-d", "Cohere raises $500M to accelerate enterprise AI", "https://cohere.com/blog/cohere-series-d", "Cohere", "2024-07-21", "press-release"),
    ],
    { roundType: "Series D", valuationUsd: 5.5 * B, dealStructure: "growth-equity" }
  ),

  // ── Perplexity ──
  deal(
    "coatue", "perplexity", 500 * M, "investment", "2024-12-17",
    "Perplexity raised $500M Series D with Nvidia, SoftBank, and NEA participation.",
    [
      cite("perplexity-series-d", "Perplexity raises $500M Series D", "https://www.perplexity.ai/hub/blog/perplexity-raises-series-d", "Perplexity", "2024-12-17", "press-release"),
    ],
    { roundType: "Series D", valuationUsd: 9 * B, dealStructure: "growth-equity" }
  ),

  // ── Safe Superintelligence ──
  deal(
    "sequoia-capital", "safe-superintelligence", 1 * B, "investment", "2024-09-04",
    "SSI raised over $1B from Sequoia, a16z, DST Global, and NFDG at a ~$5B valuation.",
    [
      cite("ssi-series-a", "Ilya Sutskever's startup Safe Superintelligence raises $1B", "https://techcrunch.com/2024/09/04/ilya-sutskevers-startup-safe-super-intelligence-raises-1b/", "TechCrunch", "2024-09-04"),
      cite("ssi-cnbc", "OpenAI co-founder Ilya Sutskever raises $1 billion for his new AI firm", "https://www.cnbc.com/2024/09/04/openai-co-founder-ilya-sutskever-raises-1-billion-for-his-new-ai-firm.html", "CNBC", "2024-09-04"),
    ],
    { roundType: "Series A", valuationUsd: 5 * B, dealStructure: "growth-equity" }
  ),

  // ── Databricks ──
  deal(
    "thrive-capital", "databricks", 10 * B, "investment", "2024-12-17",
    "Databricks raised $10B Series J at a $62B valuation led by Thrive Capital.",
    [
      cite("databricks-series-j", "Databricks is Raising $10B Series J Investment at $62B Valuation", "https://www.databricks.com/company/newsroom/press-releases/databricks-raising-10b-series-j-investment-62b-valuation", "Databricks", "2024-12-17", "press-release"),
    ],
    { roundType: "Series E+", valuationUsd: 62 * B, dealStructure: "growth-equity" }
  ),
  deal(
    "meta", "databricks", 500 * M, "investment", "2025-01-22",
    "Meta joined Databricks' Series J as a new strategic investor at $62B valuation.",
    [
      cite("databricks-series-j-close", "Databricks Announces $15B in Financing", "https://www.prnewswire.com/news-releases/databricks-announces-15b-in-financing-to-attract-top-ai-talent-and-accelerate-global-expansion-302356899.html", "Databricks", "2025-01-22", "press-release"),
    ],
    { dealStructure: "strategic-equity" }
  ),

  // ── Scale AI ──
  deal(
    "meta", "scale-ai", 14.3 * B, "investment", "2025-06-12",
    "Meta invested $14.3B for a 49% stake in Scale AI; Alexandr Wang joined Meta for superintelligence efforts.",
    [
      cite("scale-meta-2025", "Scale AI announces next phase of company evolution", "https://scale.com/blog/scale-ai-announces-next-phase-of-company-evolution", "Scale AI", "2025-06-12", "press-release"),
      cite("tc-scale-meta", "Scale AI confirms significant investment from Meta", "https://techcrunch.com/2025/06/13/scale-ai-confirms-significant-investment-from-meta-says-ceo-alexandr-wang-is-leaving/", "TechCrunch", "2025-06-13"),
    ],
    { roundType: "Strategic", valuationUsd: 29 * B, dealStructure: "strategic-equity" }
  ),

  // ── CoreWeave ──
  deal(
    "coatue", "coreweave", 1.1 * B, "investment", "2024-05-17",
    "CoreWeave raised $1.1B Series C with Coatue, Fidelity, Jane Street, and Nvidia.",
    [
      cite("coreweave-series-c", "CoreWeave raises $1.1B Series C", "https://www.cnbc.com/2024/05/01/nvidia-backed-gpu-cloud-provider-coreweave-is-worth-19-billion.html", "CoreWeave", "2024-05-17", "press-release"),
    ],
    { roundType: "Series C", valuationUsd: 19 * B, dealStructure: "growth-equity" }
  ),
  deal(
    "nvidia", "coreweave", 6.3 * B, "supply", "2025-09-30",
    "Nvidia and CoreWeave announced a $6.3B strategic collaboration for GPU infrastructure through 2032.",
    [
      cite("coreweave-nvidia", "CoreWeave Q3 2025 results — NVIDIA collaboration", "https://investors.coreweave.com/news/news-details/2025/CoreWeave-Reports-Strong-Third-Quarter-2025-Results/", "CoreWeave", "2025-11-10", "press-release"),
    ],
    { dealStructure: "gpu-supply-allocation" }
  ),
  deal(
    "meta", "coreweave", 14.2 * B, "compute-deal", "2025-09-30",
    "Meta signed an up to $14.2B multi-year AI infrastructure deal with CoreWeave.",
    [
      cite("coreweave-meta", "CoreWeave Q3 2025 — Meta deal", "https://investors.coreweave.com/news/news-details/2025/CoreWeave-Reports-Strong-Third-Quarter-2025-Results/", "CoreWeave", "2025-11-10", "press-release"),
    ],
    { dealStructure: "compute-capacity-agreement" }
  ),
  deal(
    "microsoft", "coreweave", 10 * B, "compute-deal", "2024-06-01",
    "Microsoft contracted CoreWeave GPU cloud capacity to supplement Azure AI infrastructure.",
    [
      cite("coreweave-ipo-msft", "CoreWeave S-1 — Microsoft as major customer", "https://www.sec.gov/Archives/edgar/data/1769628/000162828025002390/crwv-20241231.htm", "SEC", "2025-03-01", "filing"),
    ],
    { dealStructure: "compute-capacity-agreement" }
  ),

  // ── Character.AI ──
  deal(
    "google", "character-ai", 2.7 * B, "partnership", "2024-08-02",
    "Google paid ~$2.7B to license Character.AI technology and hire founders back to DeepMind.",
    [
      cite("google-character-ai", "Google strikes deal with Character.AI", "https://www.reuters.com/technology/google-strikes-deal-with-characterai-2024-08-02/", "Reuters", "2024-08-02"),
    ],
    { dealStructure: "platform-partnership" }
  ),

  // ── Inflection AI ──
  deal(
    "microsoft", "inflection-ai", 650 * M, "partnership", "2024-03-19",
    "Microsoft hired Inflection AI leadership in an acqui-hire; Inflection pivoted to enterprise API.",
    [
      cite("msft-inflection", "Microsoft and Inflection AI announce agreement", "https://blogs.microsoft.com/blog/2024/03/19/mustafa-suleyman-deepmind-and-inflection-co-founder-joins-microsoft-to-lead-copilot/", "Microsoft", "2024-03-19", "press-release"),
    ],
    { dealStructure: "platform-partnership" }
  ),

  // ── Waymo ──
  deal(
    "google", "waymo", 5.6 * B, "investment", "2024-10-23",
    "Waymo raised $5.6B led by Alphabet with participation from Andreessen Horowitz and others.",
    [
      cite("waymo-funding-2024", "Waymo raises $5.6B", "https://waymo.com/blog/2024/10/waymo-raises-5-6b/", "Waymo", "2024-10-23", "press-release"),
    ],
    { roundType: "Series E+", valuationUsd: 45 * B, dealStructure: "strategic-equity" }
  ),

  // ── Figure AI ──
  deal(
    "microsoft", "figure", 675 * M, "investment", "2024-02-29",
    "Figure raised $675M Series B from Microsoft, OpenAI, Nvidia, Amazon, Intel, and others.",
    [
      cite("figure-series-b", "Figure raises $675M Series B", "https://www.figure.ai/news/series-b", "Figure AI", "2024-02-29", "press-release"),
    ],
    { roundType: "Series B", valuationUsd: 2.6 * B, dealStructure: "growth-equity" }
  ),

  // ── G42 / Microsoft ──
  deal(
    "microsoft", "g42", 1.5 * B, "investment", "2024-04-16",
    "Microsoft invested $1.5B in G42 to expand AI and cloud partnership in UAE.",
    [
      cite("msft-g42", "Microsoft and G42 announce $1.5B investment", "https://blogs.microsoft.com/blog/2024/04/16/microsoft-and-g42-announce-1-5-billion-investment/", "Microsoft", "2024-04-16", "press-release"),
    ],
    { roundType: "Strategic", dealStructure: "strategic-equity" }
  ),

  // ── HUMAIN / Saudi Arabia ──
  deal(
    "saudi-arabia", "humain", 15 * B, "grant", "2025-05-12",
    "Saudi Arabia launched HUMAIN with $15B+ sovereign backing for national AI infrastructure.",
    [
      cite("humain-launch", "Saudi Arabia launches HUMAIN AI company", "https://www.reuters.com/technology/artificial-intelligence/saudi-arabia-launches-ai-company-humain-2025-05-12/", "Reuters", "2025-05-12"),
    ],
    { dealStructure: "government-grant" }
  ),
  deal(
    "nvidia", "humain", 5 * B, "supply", "2025-05-13",
    "Nvidia partnered with HUMAIN on up to 500MW of AI infrastructure in Saudi Arabia.",
    [
      cite("nvidia-humain", "NVIDIA and HUMAIN to build AI factories in Saudi Arabia", "https://nvidianews.nvidia.com/news/nvidia-and-humain-to-build-ai-factories-in-saudi-arabia", "Nvidia", "2025-05-13", "press-release"),
    ],
    { dealStructure: "gpu-supply-allocation" }
  ),
  deal(
    "amd", "humain", 10 * B, "supply", "2025-11-19",
    "AMD and HUMAIN announced up to 500MW of AI compute infrastructure powered by AMD chips.",
    [
      cite("amd-humain", "AMD and HUMAIN Form Strategic Partnership", "https://ir.amd.com/news-events/press-releases/detail/1256/amd-and-humain-form-strategic-partnership-to-deploy-up-to-500mw-of-ai-compute-infrastructure-in-saudi-arabia", "AMD", "2025-11-19", "press-release"),
    ],
    { dealStructure: "gpu-supply-allocation" }
  ),

  // ── Energy ──
  deal(
    "google", "kairos-power", 500 * M, "partnership", "2024-10-14",
    "Google ordered small modular reactors from Kairos Power for datacenter power.",
    [
      cite("google-kairos", "Google orders nuclear reactors from Kairos Power", "https://blog.google/inside-google/infrastructure/google-kairos-power-nuclear/", "Google", "2024-10-14", "press-release"),
    ],
    { dealStructure: "energy-infrastructure" }
  ),
  deal(
    "amazon", "x-energy", 500 * M, "partnership", "2024-10-16",
    "Amazon invested in X-energy to develop small modular reactors for AWS datacenters.",
    [
      cite("amazon-xenergy", "Amazon invests in X-energy for nuclear power", "https://www.aboutamazon.com/news/sustainability/amazon-invests-in-x-energy", "Amazon", "2024-10-16", "press-release"),
    ],
    { dealStructure: "energy-infrastructure" }
  ),
  deal(
    "microsoft", "constellation-energy", 1.6 * B, "energy-contract", "2024-09-20",
    "Microsoft signed a 20-year PPA with Constellation to restart Three Mile Island Unit 1.",
    [
      cite("msft-constellation", "Microsoft and Constellation announce power agreement", "https://news.microsoft.com/source/2024/09/20/microsoft-constellation-energy-nuclear/", "Microsoft", "2024-09-20", "press-release"),
    ],
    { dealStructure: "power-purchase-agreement" }
  ),
  deal(
    "amazon", "talen-energy", 650 * M, "energy-contract", "2024-03-04",
    "Amazon acquired a nuclear-powered datacenter campus from Talen Energy in Pennsylvania.",
    [
      cite("amazon-talen", "Amazon acquires nuclear-powered datacenter from Talen", "https://www.aboutamazon.com/news/aws/amazon-acquires-nuclear-powered-data-center-campus-pennsylvania", "Amazon", "2024-03-04", "press-release"),
    ],
    { dealStructure: "power-purchase-agreement" }
  ),
  deal(
    "microsoft", "helion-energy", 500 * M, "energy-contract", "2024-05-01",
    "Microsoft agreed to purchase power from Helion Energy's fusion plant targeted for 2028.",
    [
      cite("msft-helion", "Microsoft to purchase power from Helion Energy", "https://www.microsoft.com/en-us/microsoft-cloud/blog/2024/05/01/microsoft-to-purchase-power-from-helion-energy/", "Microsoft", "2024-05-01", "press-release"),
    ],
    { dealStructure: "power-purchase-agreement" }
  ),
  deal(
    "meta", "constellation-energy", 1 * B, "energy-contract", "2025-06-03",
    "Meta signed a long-term clean energy agreement with Constellation for nuclear power.",
    [
      cite("meta-constellation", "Meta and Constellation announce clean energy agreement", "https://investors.constellationenergy.com/news-releases/news-release-details/constellation-and-meta-announce-clean-energy-agreement", "Constellation", "2025-06-03", "press-release"),
    ],
    { dealStructure: "power-purchase-agreement" }
  ),

  // ── U.S. CHIPS Act grants ──
  deal(
    "united-states", "intel", 8.5 * B, "grant", "2024-03-20",
    "U.S. CHIPS Act awarded Intel up to $8.5B in direct funding for domestic fabs.",
    [
      cite("chips-intel", "Biden-Harris Administration Announces CHIPS Award for Intel", "https://www.commerce.gov/news/press-releases/2024/03/biden-harris-administration-announces-preliminary-terms-intel", "U.S. Commerce", "2024-03-20", "regulatory"),
    ],
    { dealStructure: "government-grant" }
  ),
  deal(
    "united-states", "tsmc", 6.6 * B, "grant", "2024-04-08",
    "U.S. CHIPS Act awarded TSMC up to $6.6B for Arizona semiconductor fabs.",
    [
      cite("chips-tsmc", "Biden-Harris Administration Announces CHIPS Award for TSMC", "https://www.commerce.gov/news/press-releases/2024/04/biden-harris-administration-announces-preliminary-terms-tsmc", "U.S. Commerce", "2024-04-08", "regulatory"),
    ],
    { dealStructure: "government-grant" }
  ),
  deal(
    "united-states", "samsung", 6.4 * B, "grant", "2024-04-15",
    "U.S. CHIPS Act awarded Samsung up to $6.4B for Texas chip manufacturing expansion.",
    [
      cite("chips-samsung", "Biden-Harris Administration Announces CHIPS Award for Samsung", "https://www.commerce.gov/news/press-releases/2024/04/biden-harris-administration-announces-preliminary-terms-samsung", "U.S. Commerce", "2024-04-15", "regulatory"),
    ],
    { dealStructure: "government-grant" }
  ),
  deal(
    "united-states", "micron", 6.1 * B, "grant", "2024-12-10",
    "U.S. CHIPS Act awarded Micron up to $6.1B for memory manufacturing in U.S.",
    [
      cite("chips-micron", "Biden-Harris Administration Announces CHIPS Award for Micron", "https://www.commerce.gov/news/press-releases/2024/12/biden-harris-administration-announces-chips-award-micron", "U.S. Commerce", "2024-12-10", "regulatory"),
    ],
    { dealStructure: "government-grant" }
  ),

  // ── Supply chain (documented strategic relationships) ──
  deal(
    "tsmc", "nvidia", 8 * B, "supply", "2024-06-01",
    "TSMC manufactures Nvidia's leading-edge AI accelerators on advanced process nodes.",
    [
      cite("nvidia-annual-2024", "NVIDIA Annual Report on Form 10-K", "https://www.sec.gov/Archives/edgar/data/1045810/000104581025000017/nvda-20250126.htm", "SEC", "2025-02-26", "filing"),
    ],
    { dealStructure: "hardware-supply" }
  ),

  // ── Covariant (Amazon acquisition) ──
  deal(
    "amazon", "covariant", 300 * M, "acquisition", "2024-08-01",
    "Amazon hired Covariant's founders and licensed its robotics AI in a reverse-acqui-hire.",
    [
      cite("amazon-covariant", "Amazon hires Covariant founders and licenses technology", "https://www.aboutamazon.com/news/company-news/amazon-covariant-robotics-ai", "Amazon", "2024-08-01", "press-release"),
    ],
    { dealStructure: "acquisition" }
  ),

  // ── Nebius ──
  deal(
    "nvidia", "nebius", 700 * M, "investment", "2024-12-02",
    "Nvidia invested $700M in Nebius Group for AI cloud infrastructure expansion.",
    [
      cite("nebius-nvidia", "Nebius Group announces strategic investment from NVIDIA", "https://group.nebius.com/newsroom/nebius-group-announces-strategic-investment-from-nvidia", "Nebius", "2024-12-02", "press-release"),
    ],
    { roundType: "Strategic", dealStructure: "strategic-equity" }
  ),
  deal(
    "microsoft", "nebius", 17.4 * B, "compute-deal", "2025-09-08",
    "Microsoft signed a multi-year deal with Nebius for AI infrastructure capacity.",
    [
      cite("nebius-msft", "Nebius and Microsoft announce AI infrastructure agreement", "https://group.nebius.com/newsroom/nebius-and-microsoft-announce-agreement", "Nebius", "2025-09-08", "press-release"),
    ],
    { dealStructure: "compute-capacity-agreement" }
  ),

  // ── Hugging Face ──
  deal(
    "salesforce", "hugging-face", 235 * M, "investment", "2024-08-01",
    "Hugging Face raised $235M Series D led by Salesforce Ventures with Google, Amazon, and Nvidia.",
    [
      cite("hf-series-d", "Hugging Face raises $235M Series D", "https://huggingface.co/blog/hf-series-d", "Hugging Face", "2024-08-01", "press-release"),
    ],
    { roundType: "Series D", valuationUsd: 4.5 * B, dealStructure: "growth-equity" }
  ),

  // ── Cursor ──
  deal(
    "thrive-capital", "cursor", 900 * M, "investment", "2025-06-05",
    "Cursor (Anysphere) raised $900M Series C at a $9.9B valuation led by Thrive Capital.",
    [
      cite("cursor-series-c", "Series C and Scale", "https://cursor.com/blog/series-c", "Cursor", "2025-06-05", "press-release"),
      cite("tc-cursor-series-c", "Cursor's Anysphere nabs $9.9B valuation", "https://techcrunch.com/2025/06/05/cursors-anysphere-nabs-9-9b-valuation-soars-past-500m-arr/", "TechCrunch", "2025-06-05"),
    ],
    { roundType: "Series C", valuationUsd: 9.9 * B, dealStructure: "growth-equity" }
  ),

  // ── Harvey ──
  deal(
    "sequoia-capital", "harvey", 300 * M, "investment", "2025-02-12",
    "Harvey raised $300M Series D led by Sequoia at a $3B valuation.",
    [
      cite("harvey-series-d", "Harvey Raises $300M Series D Led by Sequoia", "https://www.harvey.ai/blog/harvey-raises-series-d", "Harvey", "2025-02-12", "press-release"),
    ],
    { roundType: "Series D", valuationUsd: 3 * B, dealStructure: "growth-equity" }
  ),

  // ── France sovereign AI ──
  deal(
    "france", "mistral-ai", 1 * B, "partnership", "2025-02-10",
    "France committed sovereign AI funding to Mistral as part of its national AI strategy.",
    [
      cite("france-mistral", "France backs Mistral AI in sovereign AI push", "https://www.reuters.com/technology/france-backs-mistral-ai-2025-02-10/", "Reuters", "2025-02-10"),
    ],
    { dealStructure: "sovereign-partnership" }
  ),

  // ── Nvidia ↔ OpenAI strategic LOI (10 GW deployment) ──
  deal(
    "nvidia", "openai", 100 * B, "partnership", "2025-09-22",
    "OpenAI and Nvidia signed a letter of intent to deploy 10 GW of Nvidia systems; Nvidia intends to invest up to $100B progressively as capacity is deployed.",
    [
      cite("nvidia-openai-loi", "OpenAI and NVIDIA Announce Strategic Partnership to Deploy 10 Gigawatts of NVIDIA Systems", "https://openai.com/index/openai-nvidia-systems-partnership/", "OpenAI", "2025-09-22", "press-release"),
      cite("nvidia-openai-pr", "OpenAI and NVIDIA Announce Strategic Partnership", "https://investor.nvidia.com/news/press-release-details/2025/OpenAI-and-NVIDIA-Announce-Strategic-Partnership-to-Deploy-10-Gigawatts-of-NVIDIA-Systems/default.aspx", "Nvidia", "2025-09-22", "press-release"),
    ],
    { dealStructure: "strategic-partnership" }
  ),

  // ── Figure AI Series C ──
  deal(
    "nvidia", "figure", 1 * B, "investment", "2025-09-16",
    "Figure exceeded $1B Series C at a $39B valuation with Nvidia, Salesforce, Intel, and others participating.",
    [
      cite("figure-series-c", "Figure Exceeds $1B in Series C Funding at $39B Post-Money Valuation", "https://www.figure.ai/news/series-c", "Figure AI", "2025-09-16", "press-release"),
    ],
    { roundType: "Series C", valuationUsd: 39 * B, dealStructure: "strategic-equity" }
  ),

  // ── Glean ──
  deal(
    "kleiner-perkins", "glean", 260 * M, "investment", "2024-09-10",
    "Glean raised over $260M Series E at a $4.6B valuation co-led by Altimeter and DST Global.",
    [
      cite("glean-series-e", "Glean Announces Over $260 Million Series E", "https://www.glean.com/blog/glean-series-e-prompting-launch", "Glean", "2024-09-10", "press-release"),
      cite("glean-bw", "Glean Announces Over $260 Million Series E", "https://www.businesswire.com/news/home/20240910611680/en/Glean-Announces-Over-260-Million-Series-E-and-Next-Generation-Prompting-as-it-Brings-Work-AI-to-the-Enterprise", "Business Wire", "2024-09-10", "press-release"),
    ],
    { roundType: "Series E", valuationUsd: 4.6 * B, dealStructure: "growth-equity" }
  ),

  // ── Sierra ──
  deal(
    "greenoaks", "sierra", 175 * M, "investment", "2024-10-28",
    "Sierra raised $175M led by Greenoaks at a $4.5B valuation; Bret Taylor co-founded the enterprise AI agent company.",
    [
      cite("sierra-series-b", "Bret Taylor's customer service AI startup just raised $175M", "https://techcrunch.com/2024/10/28/bret-taylors-customer-service-ai-startup-just-raised-175m/", "TechCrunch", "2024-10-28"),
      cite("sierra-cnbc", "Bret Taylor's AI startup Sierra valued at $4.5 billion", "https://www.cnbc.com/2024/10/28/bret-taylors-ai-startup-sierra-valued-at-4point5-billion-in-funding.html", "CNBC", "2024-10-28"),
    ],
    { roundType: "Series B", valuationUsd: 4.5 * B, dealStructure: "growth-equity" }
  ),

  // ── ElevenLabs ──
  deal(
    "andreessen-horowitz", "elevenlabs", 180 * M, "investment", "2025-01-30",
    "ElevenLabs raised $180M Series C at a $3.3B valuation co-led by a16z and ICONIQ Growth.",
    [
      cite("elevenlabs-series-c", "ElevenLabs confirms $180M Series C at $3.3B valuation", "https://techcrunch.com/2025/01/30/elevenlabs-raises-180-million-in-series-c-funding-at-3-3-billion-valuation/", "TechCrunch", "2025-01-30"),
    ],
    { roundType: "Series C", valuationUsd: 3.3 * B, dealStructure: "growth-equity" }
  ),

  // ── Anthropic × Google TPU infrastructure (Jun 2026) ──
  deal(
    "google", "anthropic", 35 * B, "compute-deal", "2026-06-09",
    "Google backstopped a $35B TPU lease financing package for Anthropic across five U.S. data centers.",
    [
      cite("apollo-xpv-2026", "Apollo Leads $35 Billion Capital Solution for Broadcom AI XPV Platform", "https://ir.apollo.com/news-events/press-releases/detail/629/apollo-leads-35-billion-capital-solution-for-broadcom-ai", "Apollo Global Management", "2026-06-09", "press-release"),
    ],
    { dealStructure: "compute-capacity-agreement" }
  ),
];
