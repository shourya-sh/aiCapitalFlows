import type { SourceCitation } from "../../types";
import { flowKey } from "./deals";

export interface DealCitation {
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

/** Strategic / partnership deal citations keyed by source|target|date. */
export const DEAL_CITATIONS: Record<string, DealCitation> = {
  // ── OpenAI infrastructure ──
  [flowKey("openai", "amd", "2025-10-06")]: {
    summary: "OpenAI and AMD announced a multi-year partnership for millions of AMD Instinct GPUs.",
    citations: [
      cite("openai-amd", "OpenAI and AMD Partner", "https://openai.com/index/openai-amd-partnership/", "OpenAI", "2025-10-06", "press-release"),
      cite("cb-openai-amd", "OpenAI AMD partnership", "https://www.crunchbase.com/organization/openai/company_financials", "Crunchbase", "2025-10-06", "filing"),
    ],
  },
  [flowKey("openai", "broadcom", "2025-09-04")]: {
    summary: "OpenAI and Broadcom announced custom AI accelerator development partnership.",
    citations: [
      cite("openai-broadcom", "OpenAI and Broadcom partnership", "https://www.reuters.com/technology/openai-broadcom-develop-custom-ai-chip-2025-09-04/", "Reuters", "2025-09-04"),
    ],
  },
  [flowKey("openai", "oracle", "2025-07-15")]: {
    summary: "OpenAI expanded Oracle cloud compute commitments as part of multi-cloud infrastructure buildout.",
    citations: [
      cite("oracle-stargate", "Oracle, OpenAI, and SoftBank announce Stargate", "https://www.oracle.com/news/announcement/oracle-openai-softbank-stargate-2025-01-21/", "Oracle", "2025-01-21", "press-release"),
    ],
  },

  // ── CoreWeave ecosystem ──
  [flowKey("microsoft", "coreweave", "2024-06-01")]: {
    summary: "Microsoft contracted CoreWeave GPU capacity to supplement Azure AI infrastructure.",
    citations: [
      cite("coreweave-msft", "CoreWeave and Microsoft expand partnership", "https://www.sec.gov/Archives/edgar/data/1769628/000162828025002390/crwv-20241231.htm", "CoreWeave", "2024-06-01", "press-release"),
      cite("cb-coreweave-msft", "CoreWeave Microsoft deal", "https://news.crunchbase.com/ai/ai-cloud-infrastructure-startup-coreweave-raises-huge-new-round-at-reported-19b-valuation/", "Crunchbase News", "2024-06-01"),
    ],
  },
  [flowKey("meta", "coreweave", "2025-09-30")]: {
    summary: "Meta signed up to $14.2B multi-year AI infrastructure deal with CoreWeave.",
    citations: [
      cite("coreweave-meta", "CoreWeave Q3 2025 — Meta deal", "https://investors.coreweave.com/news/news-details/2025/CoreWeave-Reports-Strong-Third-Quarter-2025-Results/", "CoreWeave", "2025-11-10", "press-release"),
    ],
  },
  [flowKey("blackrock", "coreweave", "2024-05-17")]: {
    summary: "BlackRock led CoreWeave's $7.5B debt financing alongside JPMorgan and Goldman Sachs.",
    citations: [
      cite("coreweave-debt", "CoreWeave raises $7.5B debt", "https://www.cnbc.com/2024/05/17/ai-startup-coreweave-raises-7point5-billion-in-debt-blackstone-leads.html", "CoreWeave", "2024-05-01", "press-release"),
      cite("cb-coreweave-debt", "CoreWeave debt financing", "https://news.crunchbase.com/venture/biggest-rounds-ai-may-2024-xai-coreweave/", "Crunchbase News", "2024-05-17"),
    ],
  },

  // ── Neocloud / compute ──
  [flowKey("microsoft", "nebius", "2025-09-08")]: {
    summary: "Microsoft signed multi-year AI infrastructure agreement with Nebius.",
    citations: [
      cite("nebius-msft", "Nebius and Microsoft announce agreement", "https://group.nebius.com/newsroom/nebius-and-microsoft-announce-agreement", "Nebius", "2025-09-08", "press-release"),
    ],
  },
  [flowKey("meta", "crusoe", "2025-06-01")]: {
    summary: "Meta contracted Crusoe for AI datacenter capacity.",
    citations: [
      cite("cb-crusoe-meta", "Crusoe Energy funding and partnerships", "https://news.crunchbase.com/ai/startup-crusoe-financing-openai-data-center-texas/", "Crunchbase News", "2025-06-01"),
    ],
  },
  [flowKey("xai", "coreweave", "2025-01-01")]: {
    summary: "xAI contracted CoreWeave GPU infrastructure for Colossus supercomputer.",
    citations: [
      cite("cb-xai-coreweave", "xAI infrastructure deals", "https://news.crunchbase.com/ai/xai-raises-series-b-unicorn-musk/", "Crunchbase News", "2025-01-01"),
    ],
  },

  // ── Energy ──
  [flowKey("microsoft", "constellation-energy", "2024-09-20")]: {
    summary: "Microsoft signed 20-year PPA with Constellation to restart Three Mile Island Unit 1.",
    citations: [
      cite("msft-constellation", "Microsoft and Constellation announce power agreement", "https://news.microsoft.com/source/2024/09/20/microsoft-constellation-energy-nuclear/", "Microsoft", "2024-09-20", "press-release"),
    ],
  },
  [flowKey("meta", "constellation-energy", "2025-06-03")]: {
    summary: "Meta signed long-term clean energy agreement with Constellation for nuclear power.",
    citations: [
      cite("meta-constellation", "Meta and Constellation announce clean energy agreement", "https://investors.constellationenergy.com/news-releases/news-release-details/constellation-and-meta-announce-clean-energy-agreement", "Constellation", "2025-06-03", "press-release"),
    ],
  },
  [flowKey("amazon", "talen-energy", "2024-03-04")]: {
    summary: "Amazon acquired nuclear-powered datacenter campus from Talen Energy in Pennsylvania.",
    citations: [
      cite("amazon-talen", "Amazon acquires nuclear-powered datacenter from Talen", "https://www.aboutamazon.com/news/aws/amazon-acquires-nuclear-powered-data-center-campus-pennsylvania", "Amazon", "2024-03-04", "press-release"),
    ],
  },
  [flowKey("amazon", "nextera-energy", "2025-02-01")]: {
    summary: "Amazon signed renewable energy agreement with NextEra for datacenter power.",
    citations: [
      cite("cb-amazon-energy", "Big Tech renewable energy deals", "https://news.crunchbase.com/ai/torrid-funding-pace-googl-xai-q3-2024/", "Crunchbase News", "2025-02-01"),
    ],
  },

  // ── Big Tech ↔ model labs ──
  [flowKey("meta", "mistral-ai", "2024-04-01")]: {
    summary: "Meta explored strategic partnership with Mistral AI as part of European AI ecosystem expansion.",
    citations: [
      cite("cb-mistral-meta", "Mistral AI funding and partnerships", "https://www.crunchbase.com/organization/mistral-ai/company_financials", "Crunchbase", "2024-04-01", "filing"),
    ],
  },
  [flowKey("salesforce", "cohere", "2024-07-01")]: {
    summary: "Salesforce partnered with Cohere for enterprise generative AI.",
    citations: [
      cite("cohere-series-d", "Cohere raises $500M Series D", "https://cohere.com/blog/cohere-series-d", "Cohere", "2024-07-21", "press-release"),
    ],
  },
  [flowKey("sap", "anthropic", "2024-09-01")]: {
    summary: "SAP integrated Anthropic Claude into enterprise AI offerings.",
    citations: [
      cite("sap-anthropic", "SAP and Anthropic partnership", "https://news.sap.com/2024/09/sap-anthropic-claude/", "SAP", "2024-09-01", "press-release"),
    ],
  },
  [flowKey("google", "character-ai", "2024-08-02")]: {
    summary: "Google paid ~$2.7B to license Character.AI technology and hire founders.",
    citations: [
      cite("google-character-ai", "Google strikes deal with Character.AI", "https://www.reuters.com/technology/google-strikes-deal-with-characterai-2024-08-02/", "Reuters", "2024-08-02"),
    ],
  },

  // ── CHIPS Act grants ──
  [flowKey("united-states", "intel", "2024-03-20")]: {
    summary: "U.S. CHIPS Act awarded Intel up to $8.5B in direct funding.",
    citations: [
      cite("chips-intel", "Biden-Harris Administration Announces CHIPS Award for Intel", "https://www.commerce.gov/news/press-releases/2024/03/biden-harris-administration-announces-preliminary-terms-intel", "U.S. Commerce", "2024-03-20", "regulatory"),
    ],
  },
  [flowKey("united-states", "tsmc", "2024-04-08")]: {
    summary: "U.S. CHIPS Act awarded TSMC up to $6.6B for Arizona fabs.",
    citations: [
      cite("chips-tsmc", "Biden-Harris Administration Announces CHIPS Award for TSMC", "https://www.commerce.gov/news/press-releases/2024/04/biden-harris-administration-announces-preliminary-terms-tsmc", "U.S. Commerce", "2024-04-08", "regulatory"),
    ],
  },
  [flowKey("united-states", "samsung", "2024-04-15")]: {
    summary: "U.S. CHIPS Act awarded Samsung up to $6.4B for Texas chip manufacturing.",
    citations: [
      cite("chips-samsung", "Biden-Harris Administration Announces CHIPS Award for Samsung", "https://www.commerce.gov/news/press-releases/2024/04/biden-harris-administration-announces-preliminary-terms-samsung", "U.S. Commerce", "2024-04-15", "regulatory"),
    ],
  },
  [flowKey("united-states", "micron", "2024-12-10")]: {
    summary: "U.S. CHIPS Act awarded Micron up to $6.1B for U.S. memory manufacturing.",
    citations: [
      cite("chips-micron", "Biden-Harris Administration Announces CHIPS Award for Micron", "https://www.commerce.gov/news/press-releases/2024/12/biden-harris-administration-announces-chips-award-micron", "U.S. Commerce", "2024-12-10", "regulatory"),
    ],
  },

  // ── Sovereign AI ──
  [flowKey("saudi-arabia", "humain", "2025-05-12")]: {
    summary: "Saudi Arabia launched HUMAIN with $15B+ sovereign backing for national AI infrastructure.",
    citations: [
      cite("humain-launch", "Saudi Arabia launches HUMAIN AI company", "https://www.reuters.com/technology/artificial-intelligence/saudi-arabia-launches-ai-company-humain-2025-05-12/", "Reuters", "2025-05-12"),
    ],
  },
  [flowKey("nvidia", "humain", "2025-05-13")]: {
    summary: "Nvidia partnered with HUMAIN on up to 500MW of AI infrastructure in Saudi Arabia.",
    citations: [
      cite("nvidia-humain", "NVIDIA and HUMAIN to build AI factories", "https://nvidianews.nvidia.com/news/nvidia-and-humain-to-build-ai-factories-in-saudi-arabia", "Nvidia", "2025-05-13", "press-release"),
    ],
  },
  [flowKey("amd", "humain", "2025-11-19")]: {
    summary: "AMD and HUMAIN announced up to 500MW of AI compute powered by AMD chips.",
    citations: [
      cite("amd-humain", "AMD and HUMAIN Form Strategic Partnership", "https://ir.amd.com/news-events/press-releases/detail/1256/amd-and-humain-form-strategic-partnership-to-deploy-up-to-500mw-of-ai-compute-infrastructure-in-saudi-arabia", "AMD", "2025-11-19", "press-release"),
    ],
  },
  [flowKey("public-investment-fund", "humain", "2025-05-12")]: {
    summary: "Saudi PIF backed HUMAIN sovereign AI infrastructure initiative.",
    citations: [
      cite("pif-humain", "Saudi Arabia launches HUMAIN", "https://www.reuters.com/technology/artificial-intelligence/saudi-arabia-launches-ai-company-humain-2025-05-12/", "Reuters", "2025-05-12"),
    ],
  },

  // ── Nvidia ecosystem ──
  [flowKey("nvidia", "mistral-ai", "2025-09-09")]: {
    summary: "Nvidia invested in Mistral AI's $2B Series C round.",
    citations: [
      cite("mistral-series-c", "Mistral AI raises $2B Series C", "https://mistral.ai/news/mistral-ai-raises-2b", "Mistral AI", "2025-09-09", "press-release"),
    ],
  },
  [flowKey("nvidia", "databricks", "2024-12-17")]: {
    summary: "Nvidia participated in Databricks' $10B Series J round.",
    citations: [
      cite("databricks-j", "Databricks raises $10B Series J", "https://www.databricks.com/company/newsroom/press-releases/databricks-raising-10b-series-j-investment-62b-valuation", "Databricks", "2024-12-17", "press-release"),
      cite("cb-databricks", "Databricks $10B round", "https://news.crunchbase.com/venture/global-funding-data-analysis-ai-eoy-2024/", "Crunchbase News", "2024-12-17"),
    ],
  },
  [flowKey("nvidia", "coreweave", "2024-04-01")]: {
    summary: "Nvidia invested in CoreWeave as part of AI infrastructure ecosystem strategy.",
    citations: [
      cite("cb-nvidia-coreweave", "Nvidia CoreWeave investment", "https://news.crunchbase.com/venture/biggest-rounds-ai-may-2024-xai-coreweave/", "Crunchbase News", "2024-05-17"),
    ],
  },
  [flowKey("nvidia", "lambda", "2025-03-01")]: {
    summary: "Nvidia supplied GPUs to Lambda as part of neocloud ecosystem.",
    citations: [
      cite("cb-lambda-nvidia", "Lambda GPU cloud", "https://news.crunchbase.com/ai/ai-compute-startup-lambda-unicorn-nvda/", "Crunchbase News", "2025-03-01"),
    ],
  },

  // ── Acquisitions ──
  [flowKey("amazon", "covariant", "2024-08-01")]: {
    summary: "Amazon hired Covariant founders and licensed robotics AI technology.",
    citations: [
      cite("amazon-covariant", "Amazon hires Covariant founders", "https://www.aboutamazon.com/news/company-news/amazon-covariant-robotics-ai", "Amazon", "2024-08-01", "press-release"),
    ],
  },

  // ── Defense ──
  [flowKey("palantir", "anduril", "2024-09-01")]: {
    summary: "Palantir and Anduril announced strategic defense technology partnership.",
    citations: [
      cite("cb-anduril-palantir", "Anduril defense partnerships", "https://news.crunchbase.com/ai/defense-tech-anduril-industries-series-f/", "Crunchbase News", "2024-09-01"),
    ],
  },

  // ── Anthropic infrastructure (Jun 2026) ──
  [flowKey("google", "anthropic", "2026-06-09")]: {
    summary: "Google backstopped a $35B TPU lease financing package for Anthropic (Apollo/Blackstone-led SPV).",
    citations: [
      cite("apollo-xpv-2026", "Apollo Leads $35 Billion Capital Solution for Broadcom AI XPV Platform", "https://ir.apollo.com/news-events/press-releases/detail/629/apollo-leads-35-billion-capital-solution-for-broadcom-ai", "Apollo Global Management", "2026-06-09", "press-release"),
      cite("cb-anthropic", "Anthropic - Funding", "https://www.crunchbase.com/organization/anthropic/company_financials", "Crunchbase", "2026-06-09", "filing"),
    ],
  },
  [flowKey("apollo-global-management", "anthropic", "2026-06-09")]: {
    summary: "Apollo led the $35B private credit package financing Google TPU capacity for Anthropic.",
    citations: [
      cite("apollo-xpv-2026", "Apollo Leads $35 Billion Capital Solution for Broadcom AI XPV Platform", "https://ir.apollo.com/news-events/press-releases/detail/629/apollo-leads-35-billion-capital-solution-for-broadcom-ai", "Apollo Global Management", "2026-06-09", "press-release"),
    ],
  },
  [flowKey("blackstone", "anthropic", "2026-06-09")]: {
    summary: "Blackstone co-led the $35B chip financing SPV for Anthropic's Google TPU expansion.",
    citations: [
      cite("apollo-xpv-2026", "Apollo Leads $35 Billion Capital Solution for Broadcom AI XPV Platform", "https://ir.apollo.com/news-events/press-releases/detail/629/apollo-leads-35-billion-capital-solution-for-broadcom-ai", "Apollo Global Management", "2026-06-09", "press-release"),
    ],
  },

  // ── Waymo ──
  [flowKey("google", "waymo", "2024-10-23")]: {
    summary: "Waymo raised $5.6B led by Alphabet with Andreessen Horowitz participation.",
    citations: [
      cite("waymo-funding", "Waymo raises $5.6B", "https://waymo.com/blog/2024/10/waymo-raises-5-6b/", "Waymo", "2024-10-23", "press-release"),
    ],
  },
};

export function dealCitationFor(
  sourceId: string,
  targetId: string,
  date: string
): DealCitation | undefined {
  return DEAL_CITATIONS[flowKey(sourceId, targetId, date)];
}
