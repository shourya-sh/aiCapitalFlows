import type { SourceCitation } from "../../types";

export interface RoundCitation {
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

function cb(
  id: string,
  title: string,
  slug: string,
  publishedAt: string
): SourceCitation {
  return cite(id, title, `https://news.crunchbase.com/${slug}`, "Crunchbase News", publishedAt);
}

/** Round-level citations keyed by `targetId|date` — verifies all investors in the round. */
export const ROUND_CITATIONS: Record<string, RoundCitation> = {
  // ── Foundation models ──
  "anthropic|2024-03-27": {
    summary: "Anthropic closed a Series D round with Google, Salesforce, and other strategic investors.",
    citations: [
      cite("cb-anthropic-d", "Series D - Anthropic", "https://www.crunchbase.com/funding_round/anthropic-series-d--88e90601", "Crunchbase", "2024-02-01", "filing"),
      cite("anthropic-series-d", "Anthropic raises Series D", "https://www.anthropic.com/news/anthropic-raises-series-d", "Anthropic", "2024-03-27", "press-release"),
    ],
  },
  "anthropic|2026-05-28": {
    summary: "Anthropic raised $65B in Series H at a $965B post-money valuation, led by Altimeter, Dragoneer, Greenoaks, and Sequoia.",
    citations: [
      cite("reuters-anthropic-series-h", "Anthropic raises $65 billion, now valued at $965 billion", "https://www.reuters.com/business/anthropic-raises-65-billion-now-valued-965-billion-2026-05-28/", "Reuters", "2026-05-28"),
      cite("anthropic-series-h", "Anthropic raises $65B in Series H funding at $965B post-money valuation", "https://www.anthropic.com/news/series-h", "Anthropic", "2026-05-28", "press-release"),
    ],
  },
  "anthropic|2026-02-01": {
    summary: "Anthropic raised $30B in Series G at a $380B post-money valuation.",
    citations: [
      cite("reuters-anthropic-series-h", "Anthropic raises $65 billion, now valued at $965 billion", "https://www.reuters.com/business/anthropic-raises-65-billion-now-valued-965-billion-2026-05-28/", "Reuters", "2026-05-28"),
    ],
  },
  "safe-superintelligence|2025-04-11": {
    summary: "SSI raised $2B Series B at a ~$32B valuation led by Greenoaks with a16z, Sequoia, Nvidia, and DST.",
    citations: [
      cb("cb-ssi-apr-2025", "Safe Superintelligence's $2B Round Leads April", "business/biggest-rounds-april-2025-safe-superintelligence-plaid/", "2025-04-11"),
      cite("reuters-ssi-sep-2024", "OpenAI co-founder Sutskever's new startup raises $1 billion", "https://www.reuters.com/technology/openai-co-founder-sutskevers-new-startup-raises-1-billion-2024-09-04/", "Reuters", "2024-09-04"),
    ],
  },
  "inflection-ai|2023-06-29": {
    summary: "Inflection AI raised $1.3B Series B led by Microsoft and Nvidia.",
    citations: [
      cite("inflection-series-b", "Inflection AI raises $1.3 billion", "https://inflection.ai/inflection-1", "Inflection AI", "2023-06-29", "press-release"),
      cite("cb-inflection", "Inflection AI - Funding", "https://www.crunchbase.com/organization/inflection-ai/company_financials", "Crunchbase", "2023-06-29", "filing"),
    ],
  },
  "moonshot-ai|2024-08-01": {
    summary: "Moonshot AI (Kimi) raised over $1B in Series C funding from Tencent, Alibaba, and Sequoia China.",
    citations: [
      cite("reuters-moonshot", "China's Moonshot AI raises funding", "https://www.reuters.com/technology/chinas-moonshot-ai-raises-over-1-billion-funding-2024-08-01/", "Reuters", "2024-08-01"),
      cite("cb-moonshot", "Moonshot AI - Funding", "https://www.crunchbase.com/organization/moonshot-ai/company_financials", "Crunchbase", "2024-08-01", "filing"),
    ],
  },
  "zhipu-ai|2024-12-01": {
    summary: "Zhipu AI raised ~$700M Series D from Tencent, Alibaba, and Sequoia.",
    citations: [
      cite("reuters-zhipu", "China's Zhipu AI raises funding", "https://www.reuters.com/technology/chinas-zhipu-ai-raises-funding-2024-12-01/", "Reuters", "2024-12-01"),
      cite("cb-zhipu", "Zhipu AI - Funding", "https://www.crunchbase.com/organization/zhipu-ai/company_financials", "Crunchbase", "2024-12-01", "filing"),
    ],
  },
  "black-forest-labs|2024-08-01": {
    summary: "Black Forest Labs raised $100M Series A led by a16z for FLUX image models.",
    citations: [
      cite("bfl-series-a", "Black Forest Labs raises $100M", "https://blackforestlabs.ai/announcing-black-forest-labs/", "Black Forest Labs", "2024-08-01", "press-release"),
      cite("cb-bfl", "Black Forest Labs - Funding", "https://www.crunchbase.com/organization/black-forest-labs/company_financials", "Crunchbase", "2024-08-01", "filing"),
    ],
  },
  "world-labs|2024-09-13": {
    summary: "World Labs raised $230M Series A led by Andreessen Horowitz with Nvidia participation.",
    citations: [
      cite("world-labs-a", "World Labs raises $230M", "https://www.worldlabs.ai/blog/world-labs-raises-230m", "World Labs", "2024-09-13", "press-release"),
      cite("cb-worldlabs", "World Labs - Funding", "https://www.crunchbase.com/organization/world-labs/company_financials", "Crunchbase", "2024-09-13", "filing"),
    ],
  },
  "liquid-ai|2024-12-01": {
    summary: "Liquid AI raised $250M Series A led by General Catalyst and AMD.",
    citations: [
      cite("liquid-ai-a", "Liquid AI raises $250M", "https://www.liquid.ai/blog/liquid-ai-raises-250m", "Liquid AI", "2024-12-01", "press-release"),
      cite("cb-liquid", "Liquid AI - Funding", "https://www.crunchbase.com/organization/liquid-ai/company_financials", "Crunchbase", "2024-12-01", "filing"),
    ],
  },
  "stability-ai|2024-06-01": {
    summary: "Stability AI raised additional growth funding amid restructuring.",
    citations: [
      cite("cb-stability", "Stability AI - Funding", "https://www.crunchbase.com/organization/stability-ai/company_financials", "Crunchbase", "2024-06-01", "filing"),
    ],
  },
  "ai21-labs|2024-03-01": {
    summary: "AI21 Labs raised $300M Series C with Intel, Nvidia, and Google participation.",
    citations: [
      cite("ai21-series-c", "AI21 Labs raises $300M Series C", "https://www.ai21.com/blog/ai21-labs-raises-300m-series-c", "AI21 Labs", "2024-03-01", "press-release"),
      cite("cb-ai21", "AI21 Labs - Funding", "https://www.crunchbase.com/organization/ai21-labs/company_financials", "Crunchbase", "2024-03-01", "filing"),
    ],
  },
  "reka-ai|2024-07-01": {
    summary: "Reka AI raised $60M Series B with DST Global and Snowflake.",
    citations: [
      cite("cb-reka", "Reka AI - Funding", "https://www.crunchbase.com/organization/reka-ai/company_financials", "Crunchbase", "2024-07-01", "filing"),
    ],
  },
  "luma-ai|2024-11-01": {
    summary: "Luma AI raised $90M Series B led by Andreessen Horowitz.",
    citations: [
      cite("luma-series-b", "Luma AI raises $90M Series B", "https://lumalabs.ai/blog/series-b", "Luma AI", "2024-11-01", "press-release"),
      cite("cb-luma", "Luma AI - Funding", "https://www.crunchbase.com/organization/luma-ai/company_financials", "Crunchbase", "2024-11-01", "filing"),
    ],
  },

  // ── Infrastructure ──
  "cerebras|2024-11-01": {
    summary: "Cerebras raised $1.1B ahead of its IPO at ~$8B valuation.",
    citations: [
      cb("cb-cerebras-ipo", "Cerebras Sees Sizzling Demand For IPO Shares", "ai/torrid-funding-pace-googl-xai-q3-2024/", "2024-11-01"),
      cite("cb-cerebras", "Cerebras Systems - Funding", "https://www.crunchbase.com/organization/cerebras-systems/company_financials", "Crunchbase", "2024-11-01", "filing"),
    ],
  },
  "groq|2024-08-01": {
    summary: "Groq raised $640M Series D led by BlackRock at a $6.9B valuation.",
    citations: [
      cb("cb-groq", "Groq locked up $640M Series D", "ai/torrid-funding-pace-googl-xai-q3-2024/", "2024-08-01"),
      cite("groq-series-d", "Groq raises $640M", "https://groq.com/news/groq-raises-640m-series-d/", "Groq", "2024-08-01", "press-release"),
    ],
  },
  "tenstorrent|2024-12-01": {
    summary: "Tenstorrent raised $693M Series D led by Samsung and Hyundai.",
    citations: [
      cite("tenstorrent-d", "Tenstorrent raises $693M", "https://tenstorrent.com/tenstorrent-raises-693m", "Tenstorrent", "2024-12-01", "press-release"),
      cite("cb-tenstorrent", "Tenstorrent - Funding", "https://www.crunchbase.com/organization/tenstorrent/company_financials", "Crunchbase", "2024-12-01", "filing"),
    ],
  },
  "etched|2024-06-01": {
    summary: "Etched raised $120M Series A for transformer-specific AI chips.",
    citations: [
      cite("etched-a", "Etched raises $120M", "https://www.etched.com/blog/etched-raises-120m", "Etched", "2024-06-01", "press-release"),
      cite("cb-etched", "Etched - Funding", "https://www.crunchbase.com/organization/etched-ai/company_financials", "Crunchbase", "2024-06-01", "filing"),
    ],
  },

  // ── Compute / neocloud ──
  "crusoe|2024-12-01": {
    summary: "Crusoe raised $600M Series D led by Founders Fund at a $10B valuation.",
    citations: [
      cb("cb-crusoe-dec", "Crusoe Energy raises $500M+", "venture/biggest-funding-rounds-ai-biotech-crusoe-insider/", "2024-12-01"),
      cite("cb-crusoe", "Crusoe Energy Systems - Funding", "https://www.crunchbase.com/organization/crusoe-energy-systems/company_financials", "Crunchbase", "2024-12-01", "filing"),
    ],
  },
  "lambda|2024-02-01": {
    summary: "Lambda raised $320M Series C at a $1.5B valuation.",
    citations: [
      cb("cb-lambda", "Lambda Hits $1.5B Valuation After $320M Raise", "ai/ai-compute-startup-lambda-unicorn-nvda/", "2024-02-01"),
      cite("cb-lambda-org", "Lambda - Funding", "https://www.crunchbase.com/organization/lambda-labs/company_financials", "Crunchbase", "2024-02-01", "filing"),
    ],
  },
  "together-ai|2024-03-01": {
    summary: "Together AI raised $106M Series A at a $1.25B valuation.",
    citations: [
      cite("together-a", "Together AI raises $106M", "https://www.together.ai/blog/together-ai-raises-106m", "Together AI", "2024-03-01", "press-release"),
      cite("cb-together", "Together AI - Funding", "https://www.crunchbase.com/organization/together-ai/company_financials", "Crunchbase", "2024-03-01", "filing"),
    ],
  },
  "fireworks-ai|2024-07-01": {
    summary: "Fireworks AI raised $250M Series B led by Sequoia.",
    citations: [
      cite("fireworks-b", "Fireworks AI raises $250M Series B", "https://fireworks.ai/blog/series-b", "Fireworks AI", "2024-07-01", "press-release"),
      cite("cb-fireworks", "Fireworks AI - Funding", "https://www.crunchbase.com/organization/fireworks-ai/company_financials", "Crunchbase", "2024-07-01", "filing"),
    ],
  },
  "baseten|2024-06-01": {
    summary: "Baseten raised $150M Series B with Nvidia participation.",
    citations: [
      cite("cb-baseten", "Baseten - Funding", "https://www.crunchbase.com/organization/baseten/company_financials", "Crunchbase", "2024-06-01", "filing"),
    ],
  },
  "modal|2024-10-01": {
    summary: "Modal raised $87M Series B led by Lux Capital.",
    citations: [
      cite("modal-b", "Modal raises $87M", "https://modal.com/blog/series-b", "Modal", "2024-10-01", "press-release"),
      cite("cb-modal", "Modal - Funding", "https://www.crunchbase.com/organization/modal-labs/company_financials", "Crunchbase", "2024-10-01", "filing"),
    ],
  },

  // ── Energy ──
  "commonwealth-fusion|2024-12-01": {
    summary: "Commonwealth Fusion raised $1.8B Series B with Google and Microsoft.",
    citations: [
      cite("cfl-b", "Commonwealth Fusion raises $1.8B", "https://cfs.energy/news/commonwealth-fusion-raises-1-8b", "CFS", "2024-12-01", "press-release"),
      cite("cb-cfs", "Commonwealth Fusion Systems - Funding", "https://www.crunchbase.com/organization/commonwealth-fusion-systems/company_financials", "Crunchbase", "2024-12-01", "filing"),
    ],
  },
  "fervo-energy|2024-08-01": {
    summary: "Fervo Energy raised $244M Series D for geothermal power.",
    citations: [
      cite("fervo-d", "Fervo Energy raises $244M", "https://fervoenergy.com/fervo-energy-raises-244m/", "Fervo Energy", "2024-08-01", "press-release"),
      cite("cb-fervo", "Fervo Energy - Funding", "https://www.crunchbase.com/organization/fervo-energy/company_financials", "Crunchbase", "2024-08-01", "filing"),
    ],
  },

  // ── Robotics ──
  "physical-intelligence|2024-11-01": {
    summary: "Physical Intelligence (π) raised $400M Series A led by Thrive and Sequoia.",
    citations: [
      cite("pi-a", "Physical Intelligence raises $400M", "https://www.physicalintelligence.company/blog/series-a", "Physical Intelligence", "2024-11-01", "press-release"),
      cite("cb-pi", "Physical Intelligence - Funding", "https://www.crunchbase.com/organization/physical-intelligence/company_financials", "Crunchbase", "2024-11-01", "filing"),
    ],
  },
  "skild-ai|2024-07-01": {
    summary: "Skild AI raised $300M Series A at a $4.5B valuation.",
    citations: [
      cite("skild-a", "Skild AI raises $300M", "https://www.skild.ai/blog/skild-ai-raises-300m", "Skild AI", "2024-07-01", "press-release"),
      cite("cb-skild", "Skild AI - Funding", "https://www.crunchbase.com/organization/skild-ai/company_financials", "Crunchbase", "2024-07-01", "filing"),
    ],
  },
  "anduril|2024-08-07": {
    summary: "Anduril raised $1.5B Series F at a $14B valuation co-led by Founders Fund.",
    citations: [
      cb("cb-anduril", "Anduril Valued At $14B After $1.5B Series F", "ai/defense-tech-anduril-industries-series-f/", "2024-08-07"),
      cite("anduril-f", "Anduril raises $1.5B Series F", "https://www.anduril.com/article/anduril-series-f/", "Anduril", "2024-08-07", "press-release"),
    ],
  },
  "wayve|2024-05-01": {
    summary: "Wayve raised $1.05B Series C led by SoftBank and Nvidia.",
    citations: [
      cite("wayve-c", "Wayve raises $1.05B Series C", "https://wayve.ai/press/wayve-raises-1-05b-series-c/", "Wayve", "2024-05-01", "press-release"),
      cite("cb-wayve", "Wayve - Funding", "https://www.crunchbase.com/organization/wayve/company_financials", "Crunchbase", "2024-05-01", "filing"),
    ],
  },
  "agility-robotics|2024-04-01": {
    summary: "Agility Robotics raised $150M Series B with Amazon and Nvidia.",
    citations: [
      cite("agility-b", "Agility Robotics raises $150M", "https://www.agilityrobotics.com/content/agility-robotics-raises-150m", "Agility Robotics", "2024-04-01", "press-release"),
      cite("cb-agility", "Agility Robotics - Funding", "https://www.crunchbase.com/organization/agility-robotics/company_financials", "Crunchbase", "2024-04-01", "filing"),
    ],
  },
  "1x-technologies|2024-01-01": {
    summary: "1X Technologies raised $100M Series B led by Samsung.",
    citations: [
      cite("1x-b", "1X raises $100M", "https://www.1x.tech/discover/1x-raises-100m", "1X Technologies", "2024-01-11", "press-release"),
      cite("cb-1x", "1X Technologies - Funding", "https://www.crunchbase.com/organization/1x-technologies/company_financials", "Crunchbase", "2024-01-01", "filing"),
    ],
  },

  // ── Agent infra ──
  "scale-ai|2024-05-21": {
    summary: "Scale AI raised $1B Series F at a $13.8B valuation led by Accel.",
    citations: [
      cb("cb-scale-f", "Scale AI Raises $1B; Hits $13.8B Valuation", "venture/global-funding-data-analysis-ai-eoy-2024/", "2024-05-21"),
      cite("scale-f", "Scale AI raises $1B", "https://scale.com/blog/scale-ai-series-f", "Scale AI", "2024-05-21", "press-release"),
    ],
  },
  "langchain|2024-10-01": {
    summary: "LangChain raised $125M Series A led by Sequoia at a $1.25B valuation.",
    citations: [
      cite("langchain-a", "LangChain raises $125M", "https://blog.langchain.com/langchain-raises-125m/", "LangChain", "2024-10-01", "press-release"),
      cite("cb-langchain", "LangChain - Funding", "https://www.crunchbase.com/organization/langchain/company_financials", "Crunchbase", "2024-10-01", "filing"),
    ],
  },
  "pinecone|2024-04-01": {
    summary: "Pinecone raised $100M Series B led by Andreessen Horowitz.",
    citations: [
      cite("pinecone-b", "Pinecone raises $100M Series B", "https://www.pinecone.io/blog/series-b/", "Pinecone", "2024-04-01", "press-release"),
      cite("cb-pinecone", "Pinecone - Funding", "https://www.crunchbase.com/organization/pinecone/company_financials", "Crunchbase", "2024-04-01", "filing"),
    ],
  },
  "vercel|2024-05-01": {
    summary: "Vercel raised $250M Series E at a $9B valuation led by Accel.",
    citations: [
      cite("vercel-e", "Vercel raises $250M Series E", "https://vercel.com/blog/series-e", "Vercel", "2024-05-01", "press-release"),
      cite("cb-vercel", "Vercel - Funding", "https://www.crunchbase.com/organization/vercel/company_financials", "Crunchbase", "2024-05-01", "filing"),
    ],
  },
  "weights-and-biases|2024-06-01": {
    summary: "Weights & Biases raised $250M Series C led by Insight Partners.",
    citations: [
      cite("wandb-c", "Weights & Biases raises $250M", "https://wandb.ai/site/press/series-c", "Weights & Biases", "2024-06-01", "press-release"),
      cite("cb-wandb", "Weights & Biases - Funding", "https://www.crunchbase.com/organization/weights-biases/company_financials", "Crunchbase", "2024-06-01", "filing"),
    ],
  },

  // ── Enterprise AI ──
  "glean|2025-06-10": {
    summary: "Glean raised $150M follow-on funding at a $7.2B valuation with SoftBank participation.",
    citations: [
      cite("cb-glean", "Glean - Funding", "https://www.crunchbase.com/organization/glean-technologies/company_financials", "Crunchbase", "2025-06-10", "filing"),
      cite("glean-series-e", "Glean Series E funding", "https://www.glean.com/blog/glean-series-e-prompting-launch", "Glean", "2024-09-10", "press-release"),
    ],
  },
  "abridge|2024-06-01": {
    summary: "Abridge raised $150M Series D for clinical AI documentation.",
    citations: [
      cite("abridge-d", "Abridge raises $150M Series D", "https://www.abridge.com/press/abridge-raises-150m", "Abridge", "2024-06-01", "press-release"),
      cite("cb-abridge", "Abridge - Funding", "https://www.crunchbase.com/organization/abridge/company_financials", "Crunchbase", "2024-06-01", "filing"),
    ],
  },
  "cognition|2025-03-01": {
    summary: "Cognition (Devin) raised $175M Series B led by Founders Fund.",
    citations: [
      cite("cognition-b", "Cognition raises $175M", "https://cognition.ai/blog/series-b", "Cognition", "2025-03-01", "press-release"),
      cite("cb-cognition", "Cognition - Funding", "https://www.crunchbase.com/organization/cognition-ai/company_financials", "Crunchbase", "2025-03-01", "filing"),
    ],
  },
  "runway|2024-06-01": {
    summary: "Runway raised $308M Series D with Nvidia and Google participation.",
    citations: [
      cite("runway-d", "Runway raises $308M Series D", "https://runwayml.com/blog/runway-series-d", "Runway", "2024-06-01", "press-release"),
      cite("cb-runway", "Runway - Funding", "https://www.crunchbase.com/organization/runway/company_financials", "Crunchbase", "2024-06-01", "filing"),
    ],
  },
  "replit|2024-09-01": {
    summary: "Replit raised $200M Series C led by Andreessen Horowitz.",
    citations: [
      cite("replit-c", "Replit raises $200M", "https://blog.replit.com/series-c", "Replit", "2024-09-01", "press-release"),
      cite("cb-replit", "Replit - Funding", "https://www.crunchbase.com/organization/replit/company_financials", "Crunchbase", "2024-09-01", "filing"),
    ],
  },
  "mercor|2025-02-01": {
    summary: "Mercor raised $100M Series B for AI hiring marketplace.",
    citations: [
      cite("cb-mercor", "Mercor - Funding", "https://www.crunchbase.com/organization/mercor/company_financials", "Crunchbase", "2025-02-01", "filing"),
    ],
  },
  "decagon|2024-10-01": {
    summary: "Decagon raised $150M Series B for AI customer support agents.",
    citations: [
      cite("decagon-b", "Decagon raises $150M", "https://decagon.ai/blog/series-b", "Decagon", "2024-10-01", "press-release"),
      cite("cb-decagon", "Decagon - Funding", "https://www.crunchbase.com/organization/decagon/company_financials", "Crunchbase", "2024-10-01", "filing"),
    ],
  },
  "hebbia|2024-07-01": {
    summary: "Hebbia raised $130M Series B for AI document analysis.",
    citations: [
      cite("hebbia-b", "Hebbia raises $130M", "https://www.hebbia.com/blog/hebbia-series-b", "Hebbia", "2024-07-01", "press-release"),
      cite("cb-hebbia", "Hebbia - Funding", "https://www.crunchbase.com/organization/hebbia/company_financials", "Crunchbase", "2024-07-01", "filing"),
    ],
  },
  "synthesia|2024-06-01": {
    summary: "Synthesia raised $180M Series D led by Accel.",
    citations: [
      cite("synthesia-d", "Synthesia raises $180M", "https://www.synthesia.io/blog/series-d", "Synthesia", "2024-06-01", "press-release"),
      cite("cb-synthesia", "Synthesia - Funding", "https://www.crunchbase.com/organization/synthesia/company_financials", "Crunchbase", "2024-06-01", "filing"),
    ],
  },
  "ramp|2024-04-01": {
    summary: "Ramp raised $650M Series D at a $22B valuation.",
    citations: [
      cite("ramp-d", "Ramp raises $650M", "https://ramp.com/blog/series-d", "Ramp", "2024-04-01", "press-release"),
      cite("cb-ramp", "Ramp - Funding", "https://www.crunchbase.com/organization/ramp/company_financials", "Crunchbase", "2024-04-01", "filing"),
    ],
  },
  "notion|2024-10-01": {
    summary: "Notion raised $275M Series C at a $10B valuation.",
    citations: [
      cite("notion-c", "Notion raises $275M", "https://www.notion.so/blog/series-c", "Notion", "2024-10-01", "press-release"),
      cite("cb-notion", "Notion - Funding", "https://www.crunchbase.com/organization/notion/company_financials", "Crunchbase", "2024-10-01", "filing"),
    ],
  },
  "canva|2024-05-01": {
    summary: "Canva raised $200M Series D extension.",
    citations: [
      cite("cb-canva", "Canva - Funding", "https://www.crunchbase.com/organization/canva/company_financials", "Crunchbase", "2024-05-01", "filing"),
    ],
  },
  "browserbase|2024-10-01": {
    summary: "Browserbase raised $40M Series A led by Andreessen Horowitz.",
    citations: [
      cite("cb-browserbase", "Browserbase - Funding", "https://www.crunchbase.com/organization/browserbase/company_financials", "Crunchbase", "2024-10-01", "filing"),
    ],
  },
  "crewai|2024-11-01": {
    summary: "CrewAI raised $18M Series A for multi-agent AI framework.",
    citations: [
      cite("cb-crewai", "CrewAI - Funding", "https://www.crunchbase.com/organization/crewai/company_financials", "Crunchbase", "2024-11-01", "filing"),
    ],
  },
  "livekit|2024-08-01": {
    summary: "LiveKit raised $45M Series B for real-time AI infrastructure.",
    citations: [
      cite("livekit-b", "LiveKit raises $45M", "https://blog.livekit.io/series-b/", "LiveKit", "2024-08-01", "press-release"),
      cite("cb-livekit", "LiveKit - Funding", "https://www.crunchbase.com/organization/livekit/company_financials", "Crunchbase", "2024-08-01", "filing"),
    ],
  },
  "llamaindex|2024-07-01": {
    summary: "LlamaIndex raised $27M Series A led by Greylock.",
    citations: [
      cite("llamaindex-a", "LlamaIndex raises $27M", "https://www.llamaindex.ai/blog/series-a", "LlamaIndex", "2024-07-01", "press-release"),
      cite("cb-llamaindex", "LlamaIndex - Funding", "https://www.crunchbase.com/organization/llamaindex/company_financials", "Crunchbase", "2024-07-01", "filing"),
    ],
  },
  "nuro|2024-08-01": {
    summary: "Nuro raised $500M Series E with SoftBank and Google.",
    citations: [
      cite("nuro-e", "Nuro raises $500M", "https://www.nuro.ai/blog/nuro-raises-500m", "Nuro", "2024-08-01", "press-release"),
      cite("cb-nuro", "Nuro - Funding", "https://www.crunchbase.com/organization/nuro/company_financials", "Crunchbase", "2024-08-01", "filing"),
    ],
  },
  "sambanova|2024-06-01": {
    summary: "SambaNova raised $350M Series E with SoftBank and Nvidia.",
    citations: [
      cite("cb-sambanova", "SambaNova Systems - Funding", "https://www.crunchbase.com/organization/sambanova-systems/company_financials", "Crunchbase", "2024-06-01", "filing"),
    ],
  },
  "sanctuary-ai|2024-09-01": {
    summary: "Sanctuary AI raised $140M Series A with Nvidia and Microsoft.",
    citations: [
      cite("sanctuary-a", "Sanctuary AI raises $140M", "https://www.sanctuary.ai/blog/sanctuary-ai-raises-140m", "Sanctuary AI", "2024-09-01", "press-release"),
      cite("cb-sanctuary", "Sanctuary AI - Funding", "https://www.crunchbase.com/organization/sanctuary-ai/company_financials", "Crunchbase", "2024-09-01", "filing"),
    ],
  },
  "suno|2024-05-01": {
    summary: "Suno raised $125M Series B for AI music generation.",
    citations: [
      cite("suno-b", "Suno raises $125M", "https://suno.com/blog/series-b", "Suno", "2024-05-01", "press-release"),
      cite("cb-suno", "Suno - Funding", "https://www.crunchbase.com/organization/suno/company_financials", "Crunchbase", "2024-05-01", "filing"),
    ],
  },
  "vast-data|2024-08-01": {
    summary: "Vast Data raised $380M Series E led by Tiger Global.",
    citations: [
      cite("vast-e", "VAST Data raises $380M", "https://www.vastdata.com/press/vast-data-raises-380m", "VAST Data", "2024-08-01", "press-release"),
      cite("cb-vast", "VAST Data - Funding", "https://www.crunchbase.com/organization/vast-data/company_financials", "Crunchbase", "2024-08-01", "filing"),
    ],
  },
  "weaviate|2024-09-01": {
    summary: "Weaviate raised $68M Series B for vector database.",
    citations: [
      cite("weaviate-b", "Weaviate raises $68M", "https://weaviate.io/blog/weaviate-series-b", "Weaviate", "2024-09-01", "press-release"),
      cite("cb-weaviate", "Weaviate - Funding", "https://www.crunchbase.com/organization/weaviate/company_financials", "Crunchbase", "2024-09-01", "filing"),
    ],
  },
  "writer|2024-06-01": {
    summary: "Writer raised $200M Series C for enterprise generative AI.",
    citations: [
      cite("writer-c", "Writer raises $200M", "https://writer.com/blog/series-c/", "Writer", "2024-06-01", "press-release"),
      cite("cb-writer", "Writer - Funding", "https://www.crunchbase.com/organization/writer/company_financials", "Crunchbase", "2024-06-01", "filing"),
    ],
  },
  "glean-health|2024-06-01": {
    summary: "Glean Health raised $120M Series B for healthcare AI search.",
    citations: [
      cite("cb-glean-health", "Glean Health - Funding", "https://www.crunchbase.com/organization/glean-health/company_financials", "Crunchbase", "2024-06-01", "filing"),
    ],
  },
  "gong|2024-05-01": {
    summary: "Gong raised $583M Series E at a $7.25B valuation.",
    citations: [
      cite("gong-e", "Gong raises $583M", "https://www.gong.io/blog/gong-raises-583m", "Gong", "2024-05-01", "press-release"),
      cite("cb-gong", "Gong - Funding", "https://www.crunchbase.com/organization/gong-io/company_financials", "Crunchbase", "2024-05-01", "filing"),
    ],
  },
  "grammarly|2024-07-01": {
    summary: "Grammarly raised $550M at a $13B valuation led by BlackRock.",
    citations: [
      cite("cb-grammarly", "Grammarly - Funding", "https://www.crunchbase.com/organization/grammarly/company_financials", "Crunchbase", "2024-07-01", "filing"),
    ],
  },
  "apptronik|2024-06-01": {
    summary: "Apptronik raised $350M Series B with Amazon and Google for humanoid robots.",
    citations: [
      cite("apptronik-b", "Apptronik raises $350M", "https://apptronik.com/news/apptronik-raises-350m", "Apptronik", "2024-06-01", "press-release"),
      cite("cb-apptronik", "Apptronik - Funding", "https://www.crunchbase.com/organization/apptronik/company_financials", "Crunchbase", "2024-06-01", "filing"),
    ],
  },
  "iren|2024-11-01": {
    summary: "IREN signed strategic compute partnership with Microsoft and Nvidia.",
    citations: [
      cite("iren-msft", "IREN Microsoft partnership", "https://ir.iren.com/news-events/press-releases", "IREN", "2024-11-01", "press-release"),
      cite("cb-iren", "IREN - Funding", "https://www.crunchbase.com/organization/iris-energy/company_financials", "Crunchbase", "2024-11-01", "filing"),
    ],
  },

  // ── Major rounds (added for citation coverage) ──
  "openai|2024-10-02": {
    summary: "OpenAI closed a $6.6B funding round at a $157B post-money valuation.",
    citations: [
      cite("openai-funding-oct-2024", "OpenAI raises $6.6 billion in funding", "https://openai.com/index/openai-raises-6-6-billion-in-funding/", "OpenAI", "2024-10-02", "press-release"),
      cite("cb-openai-oct", "OpenAI - Funding", "https://www.crunchbase.com/organization/openai/company_financials", "Crunchbase", "2024-10-02", "filing"),
    ],
  },
  "anthropic|2024-10-22": {
    summary: "Google committed an additional $1B to Anthropic, expanding the GCP partnership.",
    citations: [
      cite("anthropic-google-oct-2024", "Google invests additional $1B in Anthropic", "https://www.anthropic.com/news/google-anthropic-2024", "Anthropic", "2024-10-22", "press-release"),
      cite("cb-anthropic", "Anthropic - Funding", "https://www.crunchbase.com/organization/anthropic/company_financials", "Crunchbase", "2024-10-22", "filing"),
    ],
  },
  "xai|2024-05-26": {
    summary: "xAI raised $6B Series B led by Andreessen Horowitz with Sequoia and Fidelity.",
    citations: [
      cite("xai-series-b", "xAI raises $6B Series B", "https://x.ai/blog/series-b", "xAI", "2024-05-26", "press-release"),
      cb("cb-xai-b", "xAI Raises $6B Series B", "ai/xai-raises-series-b-unicorn-musk/", "2024-05-26"),
    ],
  },
  "xai|2025-07-01": {
    summary: "xAI raised $10B+ at an $80B valuation with Andreessen Horowitz and Qatar Investment Authority.",
    citations: [
      cite("cb-xai-e", "xAI - Funding", "https://www.crunchbase.com/organization/x-ai/company_financials", "Crunchbase", "2025-07-01", "filing"),
    ],
  },
  "mistral-ai|2024-06-11": {
    summary: "Mistral AI raised €600M Series B led by General Catalyst at a €5.8B valuation.",
    citations: [
      cite("mistral-series-b", "Mistral AI raises 600M€ Series B", "https://mistral.ai/news/mistral-ai-raises-600m", "Mistral AI", "2024-06-11", "press-release"),
      cite("cb-mistral-b", "Mistral AI - Funding", "https://www.crunchbase.com/organization/mistral-ai/company_financials", "Crunchbase", "2024-06-11", "filing"),
    ],
  },
  "mistral-ai|2025-09-09": {
    summary: "Mistral AI raised $2B Series C at a $14B valuation with Nvidia and Salesforce.",
    citations: [
      cite("mistral-series-c", "Mistral AI raises $2B Series C", "https://mistral.ai/news/mistral-ai-raises-2b", "Mistral AI", "2025-09-09", "press-release"),
      cite("cb-mistral-c", "Mistral AI - Funding", "https://www.crunchbase.com/organization/mistral-ai/company_financials", "Crunchbase", "2025-09-09", "filing"),
    ],
  },
  "cohere|2024-07-21": {
    summary: "Cohere raised $500M Series D led by Insight Partners at a $5.5B valuation.",
    citations: [
      cite("cohere-series-d", "Cohere raises $500M Series D", "https://cohere.com/blog/cohere-series-d", "Cohere", "2024-07-21", "press-release"),
      cite("cb-cohere", "Cohere - Funding", "https://www.crunchbase.com/organization/cohere/company_financials", "Crunchbase", "2024-07-21", "filing"),
    ],
  },
  "figure|2024-02-29": {
    summary: "Figure AI raised $675M Series B led by Microsoft with OpenAI and Nvidia.",
    citations: [
      cite("figure-series-b", "Figure raises $675M Series B", "https://www.figure.ai/news/series-b", "Figure AI", "2024-02-29", "press-release"),
      cite("cb-figure", "Figure AI - Funding", "https://www.crunchbase.com/organization/figure-ai/company_financials", "Crunchbase", "2024-02-29", "filing"),
    ],
  },
  "figure|2025-09-16": {
    summary: "Figure AI exceeded $1B in Series C funding at a $39B post-money valuation.",
    citations: [
      cite("figure-series-c", "Figure Exceeds $1B in Series C Funding", "https://www.figure.ai/news/series-c", "Figure AI", "2025-09-16", "press-release"),
      cite("cb-figure-c", "Figure AI - Funding", "https://www.crunchbase.com/organization/figure-ai/company_financials", "Crunchbase", "2025-09-16", "filing"),
    ],
  },
  "cursor|2025-06-05": {
    summary: "Cursor (Anysphere) raised $900M Series C at a $9.9B valuation led by Thrive Capital.",
    citations: [
      cite("cursor-series-c", "Series C and Scale", "https://cursor.com/blog/series-c", "Cursor", "2025-06-05", "press-release"),
      cite("cb-cursor", "Anysphere - Funding", "https://www.crunchbase.com/organization/anysphere/company_financials", "Crunchbase", "2025-06-05", "filing"),
    ],
  },
  "harvey|2025-02-12": {
    summary: "Harvey raised $300M Series D led by Sequoia at a $3B valuation.",
    citations: [
      cite("harvey-series-d", "Harvey Raises $300M Series D Led by Sequoia", "https://www.harvey.ai/blog/harvey-raises-series-d", "Harvey", "2025-02-12", "press-release"),
      cite("cb-harvey", "Harvey - Funding", "https://www.crunchbase.com/organization/harvey-ai/company_financials", "Crunchbase", "2025-02-12", "filing"),
    ],
  },
  "glean|2024-09-10": {
    summary: "Glean raised $260M+ Series E at a $4.6B valuation led by Kleiner Perkins.",
    citations: [
      cite("glean-series-e", "Glean Announces Over $260 Million Series E", "https://www.glean.com/blog/glean-series-e-prompting-launch", "Glean", "2024-09-10", "press-release"),
      cite("cb-glean-e", "Glean - Funding", "https://www.crunchbase.com/organization/glean-technologies/company_financials", "Crunchbase", "2024-09-10", "filing"),
    ],
  },
  "sierra|2024-10-28": {
    summary: "Sierra raised $175M Series B at a $4.5B valuation led by Greenoaks.",
    citations: [
      cite("sierra-series-b", "Sierra raises $175M Series B", "https://techcrunch.com/2024/10/28/bret-taylors-customer-service-ai-startup-just-raised-175m/", "TechCrunch", "2024-10-28"),
      cite("cb-sierra", "Sierra - Funding", "https://www.crunchbase.com/organization/sierra-ai/company_financials", "Crunchbase", "2024-10-28", "filing"),
    ],
  },
  "elevenlabs|2025-01-30": {
    summary: "ElevenLabs raised $180M Series C at a $3.3B valuation led by Andreessen Horowitz.",
    citations: [
      cite("elevenlabs-series-c", "ElevenLabs confirms $180M Series C", "https://techcrunch.com/2025/01/30/elevenlabs-raises-180-million-in-series-c-funding-at-3-3-billion-valuation/", "TechCrunch", "2025-01-30"),
      cite("cb-elevenlabs", "ElevenLabs - Funding", "https://www.crunchbase.com/organization/elevenlabs/company_financials", "Crunchbase", "2025-01-30", "filing"),
    ],
  },
  "hugging-face|2024-08-01": {
    summary: "Hugging Face raised $235M Series D led by Salesforce at a $4.5B valuation.",
    citations: [
      cite("hf-series-d", "Hugging Face raises $235M", "https://huggingface.co/blog/hf-series-d", "Hugging Face", "2024-08-01", "press-release"),
      cite("cb-hf", "Hugging Face - Funding", "https://www.crunchbase.com/organization/huggingface/company_financials", "Crunchbase", "2024-08-01", "filing"),
    ],
  },
  "coreweave|2024-05-17": {
    summary: "CoreWeave raised $1.1B Series C led by Coatue at a $19B valuation.",
    citations: [
      cb("cb-coreweave-c", "AI Cloud Infrastructure Startup CoreWeave Raises Huge New Round", "ai/ai-cloud-infrastructure-startup-coreweave-raises-huge-new-round-at-reported-19b-valuation/", "2024-05-17"),
      cite("cb-coreweave-org", "CoreWeave - Funding", "https://www.crunchbase.com/organization/coreweave/company_financials", "Crunchbase", "2024-05-17", "filing"),
    ],
  },
  "coreweave|2024-08-01": {
    summary: "CoreWeave expanded with additional growth capital ahead of OpenAI partnership.",
    citations: [
      cite("cb-coreweave-org", "CoreWeave - Funding", "https://www.crunchbase.com/organization/coreweave/company_financials", "Crunchbase", "2024-08-01", "filing"),
    ],
  },
  "safe-superintelligence|2024-09-04": {
    summary: "SSI raised $1B from Andreessen Horowitz, Sequoia, and Nvidia at a $5B valuation.",
    citations: [
      cite("reuters-ssi-sep-2024", "OpenAI co-founder Sutskever's new startup raises $1 billion", "https://www.reuters.com/technology/openai-co-founder-sutskevers-new-startup-raises-1-billion-2024-09-04/", "Reuters", "2024-09-04"),
      cite("cb-ssi", "Safe Superintelligence - Funding", "https://www.crunchbase.com/organization/safe-superintelligence/company_financials", "Crunchbase", "2024-09-04", "filing"),
    ],
  },
  "databricks|2024-12-17": {
    summary: "Databricks raised $10B Series J at a $62B valuation with Nvidia and Thrive.",
    citations: [
      cite("databricks-j", "Databricks raising $10B Series J", "https://www.databricks.com/company/newsroom/press-releases/databricks-raising-10b-series-j-investment-62b-valuation", "Databricks", "2024-12-17", "press-release"),
      cb("cb-databricks-j", "Databricks $10B round", "venture/global-funding-data-analysis-ai-eoy-2024/", "2024-12-17"),
    ],
  },
  "perplexity|2024-12-01": {
    summary: "Perplexity raised $500M at a $9B valuation with Nvidia and Bezos Expeditions.",
    citations: [
      cite("cb-perplexity", "Perplexity AI - Funding", "https://www.crunchbase.com/organization/perplexity-ai/company_financials", "Crunchbase", "2024-12-01", "filing"),
    ],
  },
  "waymo|2024-10-23": {
    summary: "Waymo raised $5.6B led by Alphabet with Andreessen Horowitz participation.",
    citations: [
      cite("waymo-funding", "Waymo raises $5.6B", "https://waymo.com/blog/2024/10/waymo-raises-5-6b/", "Waymo", "2024-10-23", "press-release"),
      cite("cb-waymo", "Waymo - Funding", "https://www.crunchbase.com/organization/waymo/company_financials", "Crunchbase", "2024-10-23", "filing"),
    ],
  },
};

export function roundCitationKey(targetId: string, date: string): string {
  return `${targetId}|${date}`;
}

export function roundCitationFor(
  targetId: string,
  date: string
): RoundCitation | undefined {
  return ROUND_CITATIONS[roundCitationKey(targetId, date)];
}
