/** Static reference data for slideshow slides — update sources here. */

export const SLIDE01_SUPPORT = [
  { value: 258.7e9, label: "Total AI startup VC funding in 2025 alone", source: "OECD" },
  { value: 0.61, label: "Share of ALL global VC captured by AI in 2025", source: "up from 30% in 2022", isPct: true },
  { value: 3e12, label: "Projected total worldwide AI investment by 2029", source: "Industry forecasts" },
] as const;

export const HYPSCALER_CAPEX_2026 = [
  { name: "Amazon", value: 200e9 },
  { name: "Alphabet", value: 180e9 },
  { name: "Microsoft", value: 145e9 },
  { name: "Meta", value: 125e9 },
  { name: "Oracle", value: 50e9 },
] as const;

export const OPENAI_TIMELINE = [
  { year: "2023", label: "$80B valuation" },
  { year: "Late 2024", label: "$157B valuation (6.6B raise)" },
  { year: "Mar 2025", label: "$300B (SoftBank $40B round)" },
  { year: "Feb 2026", label: "$730B pre-money", highlight: true, detail: "$110B raise — largest private round in history. Amazon $50B · NVIDIA $30B · SoftBank $30B" },
] as const;

export const SHOCK_FACTS = [
  { accent: "amber", wide: true, text: "NVIDIA lost $588.8B in market cap in a single day (Jan 27, 2025) after DeepSeek released a ChatGPT-equivalent model reportedly trained for $5.6M — the largest single-day market cap loss in history." },
  { accent: "teal", text: "DeepSeek training cost: $5.6M. OpenAI frontier models: $100M+. Same performance tier. ~18× cheaper." },
  { accent: "red", text: "95% of organizations investing in GenAI are getting zero measurable return. (MIT research, Aug 2025)" },
  { accent: "blue", text: "54% of global fund managers say AI stocks are in bubble territory. 60% say equities overall are overvalued. (BofA survey, Oct 2025)" },
  { accent: "green", text: "800M weekly active ChatGPT users. Only ~5–10% pay anything. Over 90% of users freeload." },
  { accent: "purple", wide: true, text: "Anthropic raised $30B at a $380B valuation (Feb 2026). CEO Dario Amodei has written about existential AI risk. Valued above Boeing and Goldman Sachs combined." },
  { accent: "amber", text: "By 2030, Bain estimates AI companies need $2T annual revenue just to cover compute costs. Industry revenues today: ~$100B." },
] as const;

export const DOTCOM_ROWS = [
  { metric: "Most valuable company", then: "Cisco: $560B peak (4% of US GDP)", now: "NVIDIA: $4.3T+ (14% of US GDP)" },
  { metric: "That company's P/E", then: "Cisco: 200× earnings", now: "NVIDIA: ~47× earnings" },
  { metric: "Nasdaq forward P/E", then: "~60× (March 2000)", now: "~26× (2026)" },
  { metric: "VC as % of total investing", then: "~15% into internet", now: "61% into AI (2025)" },
  { metric: "Top 10 stocks' market share", then: "27% of S&P 500", now: "36% of S&P 500" },
  { metric: "Infrastructure bet", then: "Dark fiber: $1T overbuilt", now: "AI datacenters: $1.5T projected 2025–28" },
  { metric: "Lead company profitability", then: "Cisco: $3.5B/yr", now: "NVIDIA: $73B/yr" },
  { metric: "Typical funded startup", then: "Pets.com: $0 revenue, IPO at $300M", now: "Many AI startups: minimal revenue, $1B+ private valuations" },
] as const;

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

export const SOVEREIGN_PINS = [
  { x: 22, y: 38, flag: "🇺🇸", title: "USA — Stargate", detail: "$500B commitment (OpenAI + SoftBank + Oracle + Microsoft + NVIDIA)" },
  { x: 58, y: 48, flag: "🇦🇪", title: "UAE — Stargate UAE", detail: "5 GW compute campus · $200B US-UAE partnership" },
  { x: 54, y: 44, flag: "🇸🇦", title: "Saudi Arabia — HUMAIN", detail: "$40B Vision AI · PIF $1T pledge during 2025 visit" },
  { x: 78, y: 36, flag: "🇨🇳", title: "China — state fund", detail: "$47B · ByteDance, Alibaba, Baidu, Tencent" },
  { x: 48, y: 32, flag: "🇪🇺", title: "EU — sovereignty agenda", detail: "€200B AI plan · European AI Act" },
] as const;

export const ROBOTICS_LADDER = [
  { name: "Figure AI", value: 39e9 },
  { name: "Boston Dynamics", value: 21e9 },
  { name: "Apptronik", value: 1e9 },
  { name: "Agility Robotics", value: 1e9 },
  { name: "1X NEO", value: 1e9 },
] as const;

export const BULL_CASE = [
  "NVIDIA is genuinely profitable (47× P/E vs Cisco's 200×)",
  "Enterprise GenAI spending grew 3.2× in 2025 ($37B)",
  "87% of large enterprises have now implemented AI",
  "OpenAI revenue grew 10× in 2 years — faster than any company at this scale",
  "Goldman projects +7% global GDP lift from AI productivity",
  "Funded by cash-rich Big Tech, not fragile dot-com startups",
  "Infrastructure will outlast the hype — as fiber outlasted Webvan",
] as const;

export const BEAR_CASE = [
  "95% of enterprises getting zero return on GenAI investment",
  "OpenAI burning $14B+ in 2026 on ~$13B revenue",
  "54% of fund managers say AI stocks are in bubble territory",
  "DeepSeek proved $6M can match $100M models — moat may be shallow",
  "Hyperscalers spending 45–57% of revenue on capex",
  "AI firms need $2T annual revenue by 2030 to cover compute — industry at ~$100B",
  "Circular financing: NVIDIA funds startups who buy NVIDIA chips",
] as const;

export const WATCH_SIGNALS = [
  {
    title: "The Revenue-CapEx Ratio",
    what: "Are hyperscaler AI revenues growing as fast as capex?",
    bullish: "Revenue growth rate > capex growth rate",
    bearish: "Capex outpaces revenue (2025: capex +75% vs revenue ~+40%)",
    watch: "Quarterly AWS, Google Cloud, Azure earnings",
  },
  {
    title: "Enterprise ROI Materialization",
    what: "Are enterprises actually getting returns on AI investment?",
    bullish: "Surveys show >50% with positive ROI",
    bearish: "95% zero-return rate persists through 2026",
    watch: "McKinsey Global AI Survey, Gartner adoption reports",
  },
  {
    title: "The OpenAI Profitability Track",
    what: "Does OpenAI hit its internal milestones?",
    bullish: "Revenue hits $39B+ by 2027",
    bearish: "Burns exceed projections; another mega-round needed",
    watch: "OpenAI IPO filing (expected 2026–2027)",
  },
  {
    title: "The Efficiency Cliff",
    what: "Does DeepSeek-style efficiency commoditize AI models?",
    bullish: "Efficiency expands the market (more users, lower cost)",
    bearish: "Efficiency destroys NVIDIA/OpenAI pricing power",
    watch: "Cost per token on benchmarks; open-source model quality",
  },
  {
    title: "The Geopolitical Choke Point",
    what: "Do US export restrictions reshape who controls AI compute?",
    bullish: "US maintains chip advantage; Stargate executes",
    bearish: "China achieves chip independence; Gulf plays both sides",
    watch: "US Commerce export controls; TSMC capacity allocation",
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
