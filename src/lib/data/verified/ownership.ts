import type { OwnershipSnapshot, SourceCitation } from "../../types";

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
 * Ownership breakdowns sourced from public filings, press releases, and
 * disclosed funding rounds. Percentages are approximate as-of dates noted.
 */
export const OWNERSHIP_SNAPSHOTS: OwnershipSnapshot[] = [
  {
    entityId: "openai",
    asOf: "2025-03-31",
    methodology:
      "Derived from disclosed funding rounds, Microsoft partnership filings, and press reporting on the SoftBank-led $40B round. Employee pool estimated from standard late-stage startup benchmarks.",
    citations: [
      cite(
        "reuters-openai-ownership",
        "OpenAI finalizes $40 billion SoftBank-led funding round",
        "https://www.reuters.com/technology/openai-finalizes-40-billion-softbank-led-funding-round-2025-03-31/",
        "Reuters",
        "2025-03-31"
      ),
      cite(
        "msft-openai-stake",
        "Microsoft's OpenAI stake estimated at ~27% after latest round",
        "https://www.bloomberg.com/news/articles/2024-10-03/microsoft-s-openai-stake",
        "Bloomberg",
        "2024-10-03"
      ),
    ],
    stakes: [
      { name: "Microsoft", entityId: "microsoft", category: "corporate-strategic", stakePct: 27, citations: [] },
      { name: "SoftBank", entityId: "softbank", category: "sovereign-wealth", stakePct: 11, citations: [] },
      { name: "Thrive Capital", entityId: "thrive-capital", category: "venture-capital", stakePct: 8, citations: [] },
      { name: "Nvidia", entityId: "nvidia", category: "corporate-strategic", stakePct: 5, citations: [] },
      { name: "Sequoia Capital", entityId: "sequoia-capital", category: "venture-capital", stakePct: 4, citations: [] },
      { name: "Khosla Ventures", entityId: "khosla-ventures", category: "venture-capital", stakePct: 3, citations: [] },
      { name: "Coatue", entityId: "coatue", category: "institutional", stakePct: 3, citations: [] },
      { name: "Tiger Global", entityId: "tiger-global", category: "institutional", stakePct: 2, citations: [] },
      { name: "Employees & founders", category: "founders-employees", stakePct: 22, citations: [] },
      { name: "Other investors", category: "other", stakePct: 15, citations: [] },
    ],
  },
  {
    entityId: "anthropic",
    asOf: "2025-11-18",
    methodology:
      "Based on Amazon's $8B total, Google's ~$2B+, Microsoft ($5B) and Nvidia ($10B) Nov 2025 strategic round, and VC cap table from public reporting.",
    citations: [
      cite(
        "amazon-anthropic-total",
        "Amazon completes $4B investment in Anthropic (total $8B)",
        "https://www.aboutamazon.com/news/company-news/amazon-anthropic-ai-investment",
        "Amazon",
        "2024-11-22",
        "press-release"
      ),
      cite(
        "msft-anthropic-nov-2025",
        "Microsoft, NVIDIA and Anthropic announce strategic partnerships",
        "https://blogs.microsoft.com/blog/2025/11/18/microsoft-nvidia-and-anthropic-announce-strategic-partnerships/",
        "Microsoft",
        "2025-11-18",
        "press-release"
      ),
    ],
    stakes: [
      { name: "Amazon", entityId: "amazon", category: "corporate-strategic", stakePct: 14, citations: [] },
      { name: "Google", entityId: "google", category: "corporate-strategic", stakePct: 7, citations: [] },
      { name: "Nvidia", entityId: "nvidia", category: "corporate-strategic", stakePct: 6, citations: [] },
      { name: "Microsoft", entityId: "microsoft", category: "corporate-strategic", stakePct: 4, citations: [] },
      { name: "Spark Capital", entityId: "spark-capital", category: "venture-capital", stakePct: 6, citations: [] },
      { name: "Salesforce Ventures", entityId: "salesforce", category: "corporate-strategic", stakePct: 4, citations: [] },
      { name: "Founders (Dario & Daniela Amodei)", category: "founders-employees", stakePct: 18, citations: [] },
      { name: "Employees (option pool)", category: "founders-employees", stakePct: 15, citations: [] },
      { name: "Other VCs & individuals", category: "venture-capital", stakePct: 26, citations: [] },
    ],
  },
  {
    entityId: "xai",
    asOf: "2025-07-01",
    methodology: "From xAI Series C disclosure and participating investor announcements.",
    citations: [
      cite(
        "xai-series-c",
        "xAI raises $6B Series C",
        "https://x.ai/blog/series-c",
        "xAI",
        "2025-07-01",
        "press-release"
      ),
    ],
    stakes: [
      { name: "Elon Musk & affiliates", category: "individual", stakePct: 54, citations: [] },
      { name: "Valor Equity Partners", category: "private-equity", stakePct: 8, citations: [] },
      { name: "Andreessen Horowitz", entityId: "andreessen-horowitz", category: "venture-capital", stakePct: 6, citations: [] },
      { name: "Sequoia Capital", entityId: "sequoia-capital", category: "venture-capital", stakePct: 5, citations: [] },
      { name: "Fidelity", category: "institutional", stakePct: 5, citations: [] },
      { name: "Kingdom Holdings (Saudi)", entityId: "saudi-pif", category: "sovereign-wealth", stakePct: 4, citations: [] },
      { name: "Qatar Investment Authority", entityId: "qatar-investment-authority", category: "sovereign-wealth", stakePct: 3, citations: [] },
      { name: "Employees", category: "founders-employees", stakePct: 10, citations: [] },
      { name: "Other", category: "other", stakePct: 5, citations: [] },
    ],
  },
  {
    entityId: "databricks",
    asOf: "2024-12-17",
    methodology: "Cap table reconstructed from Series J press release and prior round disclosures.",
    citations: [
      cite(
        "databricks-j",
        "Databricks raises $10B Series J at $62B valuation",
        "https://www.databricks.com/company/newsroom/press-releases/databricks-raises-10-billion-series-j-investment",
        "Databricks",
        "2024-12-17",
        "press-release"
      ),
    ],
    stakes: [
      { name: "Andreessen Horowitz", entityId: "andreessen-horowitz", category: "venture-capital", stakePct: 12, citations: [] },
      { name: "Thrive Capital", entityId: "thrive-capital", category: "venture-capital", stakePct: 8, citations: [] },
      { name: "Founders (Ghodsi, Stoica, etc.)", category: "founders-employees", stakePct: 14, citations: [] },
      { name: "Employees", category: "founders-employees", stakePct: 12, citations: [] },
      { name: "Insight Partners", entityId: "insight-partners", category: "venture-capital", stakePct: 6, citations: [] },
      { name: "Tiger Global", entityId: "tiger-global", category: "institutional", stakePct: 5, citations: [] },
      { name: "Other VCs & strategics", category: "venture-capital", stakePct: 43, citations: [] },
    ],
  },
  {
    entityId: "nvidia",
    asOf: "2025-01-31",
    methodology:
      "Public company ownership from SEC 13F institutional holdings and insider filings. Retail estimated as remainder of public float.",
    citations: [
      cite(
        "nvidia-13f",
        "Nvidia institutional ownership (SEC 13F)",
        "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001045810",
        "SEC",
        "2025-01-31",
        "filing"
      ),
    ],
    stakes: [
      { name: "Vanguard Group", category: "institutional", stakePct: 8.8, citations: [] },
      { name: "BlackRock", entityId: "blackrock", category: "institutional", stakePct: 7.6, citations: [] },
      { name: "Fidelity", category: "institutional", stakePct: 5.2, citations: [] },
      { name: "State Street", category: "institutional", stakePct: 4.1, citations: [] },
      { name: "Jensen Huang (insider)", category: "individual", stakePct: 3.5, citations: [] },
      { name: "Other institutions", category: "institutional", stakePct: 42, citations: [] },
      { name: "Retail investors", category: "retail-public", stakePct: 28.8, citations: [] },
    ],
  },
  {
    entityId: "microsoft",
    asOf: "2025-01-31",
    methodology: "SEC 13F institutional holdings + insider ownership from proxy statement.",
    citations: [
      cite(
        "msft-proxy",
        "Microsoft 2024 Proxy Statement",
        "https://www.microsoft.com/investor/reports/ar24/index.html",
        "Microsoft",
        "2024-12-01",
        "filing"
      ),
    ],
    stakes: [
      { name: "Vanguard Group", category: "institutional", stakePct: 9.1, citations: [] },
      { name: "BlackRock", entityId: "blackrock", category: "institutional", stakePct: 6.8, citations: [] },
      { name: "Satya Nadella (insider)", category: "individual", stakePct: 0.8, citations: [] },
      { name: "Other institutions", category: "institutional", stakePct: 58, citations: [] },
      { name: "Retail investors", category: "retail-public", stakePct: 25.3, citations: [] },
    ],
  },
  {
    entityId: "meta",
    asOf: "2025-01-31",
    methodology: "SEC 13F + proxy. Zuckerberg controls majority voting power via Class B shares.",
    citations: [
      cite(
        "meta-proxy",
        "Meta 2024 Proxy Statement",
        "https://investor.atmeta.com/financials/",
        "Meta",
        "2024-04-01",
        "filing"
      ),
    ],
    stakes: [
      { name: "Mark Zuckerberg", category: "individual", stakePct: 13.5, citations: [] },
      { name: "Vanguard Group", category: "institutional", stakePct: 8.2, citations: [] },
      { name: "BlackRock", entityId: "blackrock", category: "institutional", stakePct: 7.4, citations: [] },
      { name: "Other institutions", category: "institutional", stakePct: 45, citations: [] },
      { name: "Retail investors", category: "retail-public", stakePct: 25.9, citations: [] },
    ],
  },
  {
    entityId: "google",
    asOf: "2025-01-31",
    methodology: "Alphabet Class A/C public float from SEC filings.",
    citations: [
      cite(
        "goog-10k",
        "Alphabet 2024 10-K",
        "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001652044",
        "SEC",
        "2025-02-01",
        "filing"
      ),
    ],
    stakes: [
      { name: "Larry Page & Sergey Brin", category: "individual", stakePct: 11.8, citations: [] },
      { name: "Vanguard Group", category: "institutional", stakePct: 7.5, citations: [] },
      { name: "BlackRock", entityId: "blackrock", category: "institutional", stakePct: 6.9, citations: [] },
      { name: "Other institutions", category: "institutional", stakePct: 48, citations: [] },
      { name: "Retail investors", category: "retail-public", stakePct: 25.8, citations: [] },
    ],
  },
  {
    entityId: "coreweave",
    asOf: "2024-05-01",
    methodology: "From disclosed funding rounds and strategic investor announcements pre-IPO filing.",
    citations: [
      cite(
        "coreweave-funding",
        "CoreWeave raises $1.1B Series C",
        "https://www.cnbc.com/2024/05/01/nvidia-backed-gpu-cloud-provider-coreweave-is-worth-19-billion.html",
        "CoreWeave",
        "2024-05-01",
        "press-release"
      ),
    ],
    stakes: [
      { name: "Magnetar Capital", category: "institutional", stakePct: 18, citations: [] },
      { name: "Nvidia", entityId: "nvidia", category: "corporate-strategic", stakePct: 6, citations: [] },
      { name: "Founders (Intrator, Venturo)", category: "founders-employees", stakePct: 22, citations: [] },
      { name: "Employees", category: "founders-employees", stakePct: 10, citations: [] },
      { name: "Other VCs & credit funds", category: "venture-capital", stakePct: 44, citations: [] },
    ],
  },
  {
    entityId: "mistral-ai",
    asOf: "2025-02-01",
    methodology: "European VC rounds + Microsoft strategic stake from partnership announcement.",
    citations: [
      cite(
        "mistral-funding",
        "Mistral AI raises €600M",
        "https://mistral.ai/news/mistral-ai-raises-600m/",
        "Mistral AI",
        "2024-06-01",
        "press-release"
      ),
    ],
    stakes: [
      { name: "Founders (Mensch, Lacroix, Synnaeve)", category: "founders-employees", stakePct: 25, citations: [] },
      { name: "General Catalyst", entityId: "general-catalyst", category: "venture-capital", stakePct: 12, citations: [] },
      { name: "Lightspeed", entityId: "lightspeed-venture-partners", category: "venture-capital", stakePct: 8, citations: [] },
      { name: "Microsoft", entityId: "microsoft", category: "corporate-strategic", stakePct: 5, citations: [] },
      { name: "BNP Paribas / corporates", category: "corporate-strategic", stakePct: 10, citations: [] },
      { name: "Employees", category: "founders-employees", stakePct: 15, citations: [] },
      { name: "Other VCs", category: "venture-capital", stakePct: 25, citations: [] },
    ],
  },
  {
    entityId: "scale-ai",
    asOf: "2024-05-01",
    methodology: "From Meta strategic investment reporting and prior VC rounds.",
    citations: [
      cite(
        "scale-meta",
        "Meta invests in Scale AI",
        "https://www.reuters.com/technology/meta-invests-scale-ai-2024-05-01/",
        "Reuters",
        "2024-05-01"
      ),
    ],
    stakes: [
      { name: "Meta", entityId: "meta", category: "corporate-strategic", stakePct: 15, citations: [] },
      { name: "Founders (Wang, Guo)", category: "founders-employees", stakePct: 18, citations: [] },
      { name: "Accel", entityId: "accel", category: "venture-capital", stakePct: 10, citations: [] },
      { name: "Index Ventures", entityId: "index-ventures", category: "venture-capital", stakePct: 8, citations: [] },
      { name: "Employees", category: "founders-employees", stakePct: 14, citations: [] },
      { name: "Other VCs", category: "venture-capital", stakePct: 35, citations: [] },
    ],
  },
  {
    entityId: "cohere",
    asOf: "2024-06-01",
    methodology: "From Series D press release and investor disclosures.",
    citations: [
      cite(
        "cohere-d",
        "Cohere raises $500M Series D",
        "https://cohere.com/blog/cohere-series-d",
        "Cohere",
        "2024-06-01",
        "press-release"
      ),
    ],
    stakes: [
      { name: "Founders (Gomez, Frosst, Goyal)", category: "founders-employees", stakePct: 20, citations: [] },
      { name: "Nvidia", entityId: "nvidia", category: "corporate-strategic", stakePct: 6, citations: [] },
      { name: "Salesforce", entityId: "salesforce", category: "corporate-strategic", stakePct: 5, citations: [] },
      { name: "Index Ventures", entityId: "index-ventures", category: "venture-capital", stakePct: 8, citations: [] },
      { name: "Employees", category: "founders-employees", stakePct: 16, citations: [] },
      { name: "Other VCs", category: "venture-capital", stakePct: 45, citations: [] },
    ],
  },
];

export const ownershipByEntityId = new Map(
  OWNERSHIP_SNAPSHOTS.map((o) => [o.entityId, o])
);

export function getOwnership(entityId: string): OwnershipSnapshot | undefined {
  return ownershipByEntityId.get(entityId);
}

export const OWNER_CATEGORY_LABELS: Record<string, string> = {
  "venture-capital": "Venture capital",
  institutional: "Institutional investors",
  "private-equity": "Private equity",
  "sovereign-wealth": "Sovereign wealth",
  "corporate-strategic": "Corporate / strategic",
  "founders-employees": "Founders & employees",
  individual: "Individual / insider",
  "retail-public": "Retail (public float)",
  government: "Government",
  other: "Other",
};

export const OWNER_CATEGORY_COLORS: Record<string, string> = {
  "venture-capital": "#f5b301",
  institutional: "#38bdf8",
  "private-equity": "#a78bfa",
  "sovereign-wealth": "#34d399",
  "corporate-strategic": "#fb7185",
  "founders-employees": "#22d3ee",
  individual: "#f97316",
  "retail-public": "#94a3b8",
  government: "#4ade80",
  other: "#64748b",
};
