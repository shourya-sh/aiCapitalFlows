/** Static reference data for slideshow slides — update sources here. */

/**
 * Projected annual global AI capital mix by 2028.
 * Composite of IDC worldwide AI infrastructure spend, McKinsey GenAI economics,
 * and 2026 hyperscaler capex guidance ($700B+). Shares reflect analyst consensus
 * that infrastructure/compute overtakes frontier-model fundraising as the dominant slice.
 */
export const PROJECTED_CAPITAL_MIX = {
  year: "2028",
  totalAnnualUsd: 950e9,
  source: "IDC AI infrastructure forecast · McKinsey GenAI spend · hyperscaler capex guidance",
  sectors: [
    { label: "Datacenter / Compute", share: 0.32, color: "#3b82f6" },
    { label: "Infrastructure (chips)", share: 0.24, color: "#22d3ee" },
    { label: "Foundation Models", share: 0.17, color: "#8b5cf6" },
    { label: "Big Tech", share: 0.1, color: "#6366f1" },
    { label: "Enterprise AI", share: 0.08, color: "#fb923c" },
    { label: "Energy & Power", share: 0.06, color: "#10b981" },
    { label: "Robotics & Agents", share: 0.03, color: "#fb7185" },
  ],
} as const;

export const SLIDE01_SUPPORT = [
  { value: 258.7e9, label: "Total AI startup VC funding in 2025 alone", source: "OECD" },
  { value: 0.61, label: "Share of ALL global VC captured by AI in 2025", source: "up from 30% in 2022", isPct: true },
  { value: 3e12, label: "Projected total worldwide AI investment by 2029", source: "Industry forecasts" },
] as const;

export const HYPSCALER_CAPEX_2026 = [
  { name: "Amazon", value: 200e9, color: "#ff9900", yoy: "+42%", capexPctRevenue: "45%" },
  { name: "Alphabet", value: 180e9, color: "#4285f4", yoy: "+36%", capexPctRevenue: "38%" },
  { name: "Microsoft", value: 145e9, color: "#00a4ef", yoy: "+34%", capexPctRevenue: "41%" },
  { name: "Meta", value: 125e9, color: "#0668e1", yoy: "+48%", capexPctRevenue: "57%" },
  { name: "Oracle", value: 50e9, color: "#c74634", yoy: "+120%", capexPctRevenue: "52%" },
] as const;

export const CAPEX_HISTORICAL = [
  { year: "2022", value: 150e9 },
  { year: "2024", value: 420e9 },
  { year: "2026", value: 700e9 },
] as const;

export const CAPEX_ACTION_SIGNALS = [
  {
    title: "Revenue-CapEx gap",
    signal: "Capex +75% YoY vs cloud revenue ~+40%",
    action: "Watch AWS, Azure, and Google Cloud margins each quarter — the bull case needs revenue to catch spend.",
    variant: "amber" as const,
  },
  {
    title: "Supply chain choke",
    signal: "NVIDIA H100/B200 lead times still 6–12 months",
    action: "Track NVIDIA datacenter revenue and hyperscaler inventory disclosures — backlog = pricing power.",
    variant: "neutral" as const,
  },
  {
    title: "Power ceiling",
    signal: "Grid interconnection queues now 5+ years in key US markets",
    action: "Follow nuclear/SMR deals (Microsoft TMI, Amazon/Constellation) — power access may cap buildout before cash does.",
    variant: "danger" as const,
  },
] as const;

export const FRONTIER_VALUATION_RACE = [
  { year: "2023", openai: "$80B", anthropic: "$4B" },
  { year: "Late 2024", openai: "$157B", anthropic: "$18B" },
  { year: "Nov 2025", openai: "$300B", anthropic: "$350B" },
  { year: "Feb 2026", openai: "$730B", anthropic: "$380B" },
  {
    year: "May 2026",
    openai: "$852B",
    anthropic: "$965B",
    highlight: true,
    detail: "OpenAI: $122B raise (Mar 2026) · Anthropic: $65B Series H (Reuters, May 28)",
  },
] as const;

export const FRONTIER_MARKET_VALUATIONS = {
  openai: { label: "$852B", note: "Post-money · Mar 2026 ($122B raise)" },
  anthropic: { label: "$965B", note: "Post-money · May 2026 ($65B Series H)" },
} as const;

export const FRONTIER_GROWTH_STATS = [
  { lab: "OpenAI", metric: "10×", detail: "Revenue: $2B (2023) → $20B run rate (2025)" },
  { lab: "Anthropic", metric: "47×", detail: "Run-rate revenue crossed $47B (May 2026), up from ~$1B in 2024" },
  { lab: "Combined", metric: "$1.8T+", detail: "Private valuations now exceed the market cap of every S&P 500 company except NVIDIA" },
] as const;

export const FRONTIER_RIVALRY_FACTS = [
  "ChatGPT: 800M+ weekly users and consumer mindshare. Claude: coding benchmark leader and fastest-growing enterprise API — same chips, same clouds, opposite bets on who wins.",
  "Microsoft and NVIDIA back both labs. Amazon ($8B) and Google anchor Anthropic; SoftBank ($40B+) and Microsoft anchor OpenAI — hyperscalers are hedging the frontier race.",
] as const;

export const FRONTIER_INSIGHT_SIGNALS = [
  {
    title: "Consumer vs enterprise",
    signal: "OpenAI: 800M+ WAU mindshare. Anthropic: enterprise API leader",
    action: "Which monetization scales — subscriptions or per-token contracts?",
    variant: "neutral" as const,
  },
  {
    title: "Anthropic takes the lead",
    signal: "Anthropic $965B vs OpenAI $852B — #2 now #1 after Series H",
    action: "Valuation more than doubled since Feb Series G ($380B). Leadership flipped.",
    variant: "amber" as const,
  },
  {
    title: "IPO clock (2026–27)",
    signal: "Anthropic filed confidential S-1 (Jun 2026); $1.8T+ combined, still loss-making",
    action: "S-1s will expose burn, margins, and compute costs.",
    variant: "gold" as const,
  },
] as const;

export const FRONTIER_IPO_CALLOUT = {
  title: "The IPO race (2026–2027)",
  body: "Anthropic's $65B Series H (May 2026) may be its last mega-private round before listing — the company confidentially filed a draft S-1 with the SEC on June 1. OpenAI raised $122B in March at $852B. Two loss-making giants racing to justify nearly $2T in combined private valuations on public markets.",
} as const;

/** @deprecated Use FRONTIER_VALUATION_RACE */
export const OPENAI_TIMELINE = FRONTIER_VALUATION_RACE.map((r) => ({
  year: r.year,
  label: `OpenAI ${r.openai}${"detail" in r && r.detail ? ` · ${r.detail}` : ""}`,
  ...("highlight" in r ? { highlight: r.highlight } : {}),
}));

export const SHOCK_FACTS = [
  {
    accent: "blue",
    icon: "shield",
    category: "The great hedge",
    headline: "Nobody wants to pick the wrong frontier lab",
    double: true,
    stats: [
      { value: "10", label: "back both OpenAI & Anthropic", tone: "primary" as const },
      { value: "4", label: "back 3+ frontier labs", tone: "amber" as const },
    ],
    bullets: [
      "Microsoft, NVIDIA, Sequoia, Coatue, Tiger Global, SoftBank, Apple, SAP, ServiceNow & Iconiq all hold stakes in both OpenAI and Anthropic — betting on the rivalry, not the winner.",
      "NVIDIA, Coatue, Tiger Global & Sequoia go further — spreading capital across 3+ frontier labs (OpenAI, Anthropic, xAI, Mistral, Cohere).",
      "Anthropic took $8B from Amazon, $1.5B from Google, $5B from Microsoft & $10B from NVIDIA — then committed $30B+ in compute across all three clouds. Every hyperscaler is both investor and vendor.",
      "Microsoft is OpenAI's strategic partner AND a $5B Anthropic backer — while Anthropic commits $30B to Azure. The biggest AI partnership in history, hedged with a bet on the competitor.",
    ],
  },
  {
    accent: "amber",
    icon: "trending-down",
    category: "Market shock",
    stat: "$588.8B",
    statSub: "gone in a single trading day",
    detail: "Jan 27, 2025: NVIDIA's worst day ever. DeepSeek matched ChatGPT on $5.6M of training spend.",
  },
  {
    accent: "purple",
    icon: "landmark",
    category: "Four-way deal",
    stat: "$500B",
    statSub: "Stargate datacenter pledge",
    detail: "Four CEOs, one White House podium, half a trillion dollars — announced before a watt went live.",
  },
  {
    accent: "teal",
    icon: "repeat",
    category: "Circular deal",
    stat: "$100B",
    statSub: "chips bought back",
    detail: "NVIDIA funds OpenAI rounds → OpenAI commits to 10 GW of Nvidia systems. The money loops back.",
  },
  {
    accent: "teal",
    icon: "repeat",
    category: "Circular VC",
    stat: "20+",
    statSub: "startups funded",
    detail: "Portfolio startups recycle VC into GPU purchases. NVIDIA effectively funds its own chip demand.",
  },
  {
    accent: "teal",
    icon: "zap",
    category: "Efficiency shock",
    stat: "18×",
    statSub: "cheaper to train",
    detail: "DeepSeek: $5.6M. OpenAI frontier: $100M+. ChatGPT-tier performance at a fraction of the cost.",
  },
  {
    accent: "green",
    icon: "network",
    category: "Three-way loop",
    stat: "$26B",
    statSub: "in compute deals",
    detail: "NVIDIA invests in CoreWeave. OpenAI & Meta rent the GPUs. CoreWeave buys NVIDIA chips. Full circle.",
  },
  {
    accent: "red",
    icon: "alert-triangle",
    category: "Enterprise reality",
    stat: "95%",
    statSub: "see zero GenAI ROI",
    detail: "MIT (Aug 2025): almost every org investing in GenAI still reports zero measurable return.",
  },
  {
    accent: "purple",
    icon: "rocket",
    category: "Valuation flip",
    stat: "$965B",
    statSub: "Anthropic now #1",
    detail: "$65B Series H (May 2026) flipped the lead. Revenue run-rate crossed $47B — valuation doubled in 3 months.",
  },
  {
    accent: "amber",
    icon: "cloud",
    category: "Multi-cloud",
    stat: "3",
    statSub: "rival clouds at once",
    detail: "Oracle ($20B+), CoreWeave ($11.9B) & Azure all at once. No single cloud can deliver frontier-scale compute.",
  },
  {
    accent: "blue",
    icon: "pie-chart",
    category: "Wall Street",
    stat: "54%",
    statSub: "call AI a bubble",
    detail: "BofA survey (Oct 2025): majority call AI bubbly. 60% say the broader equity market is overvalued too.",
  },
  {
    accent: "green",
    icon: "users",
    category: "Unit economics",
    stat: "800M",
    statSub: "weekly ChatGPT users",
    detail: "Only 5–10% convert to paid. 90%+ freeload — massive reach, thin monetization.",
  },
  {
    accent: "red",
    icon: "flame",
    category: "Compute math",
    stat: "$2T",
    statSub: "revenue needed by 2030",
    detail: "Bain: AI firms need $2T/yr just to cover compute costs. Industry revenue today: ~$100B. A 20× gap.",
  },
] as const;

export const DOTCOM_MIRROR = {
  then: {
    era: "1999 Dot-Com",
    company: "Cisco",
    marketCapBn: 560,
    gdpPct: 4,
    pe: 200,
    profitBn: 3.5,
    infraLabel: "Dark fiber overbuild",
    infraT: 1,
    startup: { name: "Pets.com", hook: "$0 revenue", valuation: "$300M IPO" },
  },
  now: {
    era: "2026 AI Boom",
    company: "NVIDIA",
    marketCapBn: 4300,
    gdpPct: 14,
    pe: 47,
    profitBn: 73,
    infraLabel: "AI datacenters (2025–28)",
    infraT: 1.5,
    startup: { name: "OpenAI", hook: "No profit until 2030", valuation: "$730B valuation" },
  },
  charts: [
    { id: "nasdaqPe", label: "Nasdaq forward P/E", then: 60, now: 26, max: 70, suffix: "×", thenNote: "Mar 2000", nowNote: "2026" },
    { id: "vcShare", label: "VC share of total investing", then: 15, now: 61, max: 70, suffix: "%", thenNote: "into internet", nowNote: "into AI" },
    { id: "top10", label: "Top 10 stocks' S&P share", then: 27, now: 36, max: 45, suffix: "%" },
    { id: "profit", label: "Lead company profit / yr", then: 3.5, now: 73, max: 80, prefix: "$", suffix: "B" },
  ],
  callouts: [
    { label: "P/E gap", value: "4.2×", sub: "NVIDIA cheaper vs Cisco at peak", tone: "positive" as const },
    { label: "Profit gap", value: "21×", sub: "NVIDIA earns more than Cisco ever did", tone: "primary" as const },
    { label: "GDP weight", value: "3.5×", sub: "NVIDIA is a bigger slice of the economy", tone: "amber" as const },
  ],
} as const;

export const ENERGY_STATS = {
  gauge2024: 415,
  gauge2030: 950,
  cards: [
    { label: "+17% data center electricity demand in 2025", sub: "vs 3% total global electricity growth" },
    { label: "$580B on AI datacenter infrastructure in 2025", sub: "More than global oil & gas production investment" },
    { label: "45 GW nuclear SMR pipeline contracted by tech (2026)", sub: "Microsoft restarted Three Mile Island (837 MW)" },
    { label: "+8% to +25% projected US household bill increase by 2030", sub: "Varies by region — AI datacenter load", warn: true },
  ],
} as const;

export type SovereignPartner = {
  readonly entityId: string;
  readonly name: string;
  readonly hqLat: number;
  readonly hqLng: number;
};

export const SOVEREIGN_PROGRAMS = [
  {
    id: "us",
    country: "United States",
    countryCode: "us",
    lat: 38.9,
    lng: -77.0,
    program: "Stargate",
    commitment: "$500B",
    scale: 500,
    mechanism: "Public–private",
    partners: [
      { entityId: "openai", name: "OpenAI", hqLat: 37.77, hqLng: -122.42 },
      { entityId: "nvidia", name: "NVIDIA", hqLat: 37.37, hqLng: -121.97 },
      { entityId: "microsoft", name: "Microsoft", hqLat: 47.64, hqLng: -122.14 },
      { entityId: "oracle", name: "Oracle", hqLat: 30.27, hqLng: -97.74 },
      { entityId: "softbank", name: "SoftBank", hqLat: 35.66, hqLng: 139.74 },
    ],
  },
  {
    id: "ae",
    country: "UAE",
    countryCode: "ae",
    lat: 24.5,
    lng: 54.4,
    program: "Stargate UAE",
    commitment: "5 GW",
    scale: 120,
    mechanism: "Sovereign wealth",
    partners: [
      { entityId: "g42", name: "G42", hqLat: 24.45, hqLng: 54.4 },
      { entityId: "mgx", name: "MGX", hqLat: 24.48, hqLng: 54.36 },
      { entityId: "microsoft", name: "Microsoft", hqLat: 47.64, hqLng: -122.14 },
      { entityId: "openai", name: "OpenAI", hqLat: 37.77, hqLng: -122.42 },
    ],
  },
  {
    id: "sa",
    country: "Saudi Arabia",
    countryCode: "sa",
    lat: 24.7,
    lng: 46.7,
    program: "HUMAIN",
    commitment: "$40B+",
    scale: 40,
    mechanism: "Sovereign wealth",
    partners: [
      { entityId: "humain", name: "HUMAIN", hqLat: 24.71, hqLng: 46.72 },
      { entityId: "public-investment-fund", name: "PIF", hqLat: 24.69, hqLng: 46.68 },
      { entityId: "nvidia", name: "NVIDIA", hqLat: 37.37, hqLng: -121.97 },
      { entityId: "amazon", name: "Amazon", hqLat: 47.62, hqLng: -122.34 },
    ],
  },
  {
    id: "cn",
    country: "China",
    countryCode: "cn",
    lat: 35.0,
    lng: 105.0,
    program: "National AI fund",
    commitment: "$47B",
    scale: 47,
    mechanism: "State fund",
    partners: [
      { entityId: "bytedance", name: "ByteDance", hqLat: 39.9, hqLng: 116.41 },
      { entityId: "alibaba", name: "Alibaba", hqLat: 30.27, hqLng: 120.15 },
      { entityId: "baidu", name: "Baidu", hqLat: 40.06, hqLng: 116.31 },
      { entityId: "tencent", name: "Tencent", hqLat: 22.54, hqLng: 114.06 },
    ],
  },
  {
    id: "eu",
    country: "European Union",
    countryCode: "eu",
    lat: 50.8,
    lng: 4.4,
    program: "InvestAI",
    commitment: "€200B",
    scale: 200,
    mechanism: "Industrial policy",
    partners: [
      { entityId: "mistral-ai", name: "Mistral AI", hqLat: 48.86, hqLng: 2.35 },
      { entityId: "nvidia", name: "NVIDIA", hqLat: 37.37, hqLng: -121.97 },
      { entityId: "microsoft", name: "Microsoft", hqLat: 47.64, hqLng: -122.14 },
    ],
  },
  {
    id: "in",
    country: "India",
    countryCode: "in",
    lat: 28.6,
    lng: 77.2,
    program: "IndiaAI Mission",
    commitment: "$1.2B+",
    scale: 1.2,
    mechanism: "State fund",
    partners: [
      { entityId: "nvidia", name: "NVIDIA", hqLat: 37.37, hqLng: -121.97 },
      { entityId: "g42", name: "G42", hqLat: 24.45, hqLng: 54.4 },
      { entityId: "microsoft", name: "Microsoft", hqLat: 47.64, hqLng: -122.14 },
    ],
  },
  {
    id: "jp",
    country: "Japan",
    countryCode: "jp",
    lat: 36.2,
    lng: 138.3,
    program: "Rapidus",
    commitment: "¥2T+",
    mechanism: "Industrial policy",
    partners: [
      { entityId: "rapidus", name: "Rapidus", hqLat: 43.06, hqLng: 141.35 },
      { entityId: "tsmc", name: "TSMC", hqLat: 24.81, hqLng: 120.97 },
      { entityId: "nvidia", name: "NVIDIA", hqLat: 37.37, hqLng: -121.97 },
    ],
  },
  {
    id: "sg",
    country: "Singapore",
    countryCode: "sg",
    lat: 1.35,
    lng: 103.8,
    program: "AI Strategy 2.0",
    commitment: "$1B+",
    scale: 1,
    mechanism: "Sovereign wealth",
    partners: [
      { entityId: "gic", name: "GIC", hqLat: 1.28, hqLng: 103.85 },
      { entityId: "nvidia", name: "NVIDIA", hqLat: 37.37, hqLng: -121.97 },
      { entityId: "microsoft", name: "Microsoft", hqLat: 47.64, hqLng: -122.14 },
    ],
  },
] as const;

export const ACCENT_BORDER: Record<string, string> = {
  teal: "#00d4ff",
  amber: "#f5a623",
  red: "#ff4d4f",
  blue: "#3b82f6",
  green: "#00c48c",
  purple: "#8b5cf6",
};
