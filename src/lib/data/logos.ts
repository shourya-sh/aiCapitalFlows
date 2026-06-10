/**
 * Logo resolution for entities.
 *
 * Real companies map to a domain; logos are loaded from Clearbit (high quality)
 * with a Google-favicon fallback, and finally an initials avatar (handled in the
 * node component). Governments use country flags.
 */

export const ENTITY_DOMAINS: Record<string, string> = {
  // Investors
  "andreessen-horowitz": "a16z.com",
  "sequoia-capital": "sequoiacap.com",
  accel: "accel.com",
  "general-catalyst": "generalcatalyst.com",
  "khosla-ventures": "khoslaventures.com",
  softbank: "softbank.jp",
  "tiger-global": "tigerglobal.com",
  coatue: "coatue.com",
  "thrive-capital": "thrivecap.com",
  "lightspeed-venture-partners": "lsvp.com",
  "founders-fund": "foundersfund.com",
  "index-ventures": "indexventures.com",
  greenoaks: "greenoaks.com",
  mgx: "mgx.ae",

  // Foundation models
  openai: "openai.com",
  anthropic: "anthropic.com",
  xai: "x.ai",
  "mistral-ai": "mistral.ai",
  cohere: "cohere.com",
  deepseek: "deepseek.com",
  perplexity: "perplexity.ai",
  "safe-superintelligence": "ssi.inc",
  "reka-ai": "reka.ai",
  "ai21-labs": "ai21.com",

  // Infrastructure
  nvidia: "nvidia.com",
  amd: "amd.com",
  cerebras: "cerebras.ai",
  groq: "groq.com",
  sambanova: "sambanova.ai",
  tsmc: "tsmc.com",
  broadcom: "broadcom.com",

  // Compute
  coreweave: "coreweave.com",
  crusoe: "crusoe.ai",
  "applied-digital": "applieddigital.com",
  lambda: "lambdalabs.com",
  "together-ai": "together.ai",
  nebius: "nebius.com",
  "vast-data": "vastdata.com",

  // Energy
  "constellation-energy": "constellationenergy.com",
  vistra: "vistracorp.com",
  "nextera-energy": "nexteraenergy.com",
  "brookfield-renewable": "brookfield.com",
  oklo: "oklo.com",
  "fervo-energy": "fervoenergy.com",

  // Robotics
  figure: "figure.ai",
  "physical-intelligence": "physicalintelligence.company",
  "skild-ai": "skild.ai",
  covariant: "covariant.ai",
  apptronik: "apptronik.com",
  "1x-technologies": "1x.tech",

  // Agent infra
  langchain: "langchain.com",
  llamaindex: "llamaindex.ai",
  crewai: "crewai.com",
  pinecone: "pinecone.io",
  livekit: "livekit.io",
  browserbase: "browserbase.com",

  // Enterprise AI
  harvey: "harvey.ai",
  glean: "glean.com",
  abridge: "abridge.com",
  sierra: "sierra.ai",
  writer: "writer.com",
  cursor: "cursor.com",
  "glean-health": "gleanhealth.com",
  decagon: "decagon.ai",

  // Big tech / hyperscalers
  microsoft: "microsoft.com",
  google: "google.com",
  amazon: "amazon.com",
  meta: "meta.com",
  apple: "apple.com",
  oracle: "oracle.com",
  tesla: "tesla.com",

  // Investors (banks, quants, growth)
  "jpmorgan-chase": "jpmorganchase.com",
  "goldman-sachs": "goldmansachs.com",
  "morgan-stanley": "morganstanley.com",
  blackrock: "blackrock.com",
  "jane-street": "janestreet.com",
  citadel: "citadel.com",
  "two-sigma": "twosigma.com",
  "insight-partners": "insightpartners.com",
  iconiq: "iconiqcapital.com",
  "bessemer-venture-partners": "bvp.com",
  "kleiner-perkins": "kleinerperkins.com",
  "new-enterprise-associates": "nea.com",
  "dst-global": "dst-global.com",
  temasek: "temasek.com.sg",

  // Foundation models
  "inflection-ai": "inflection.ai",
  "moonshot-ai": "moonshot.ai",
  "zhipu-ai": "zhipuai.cn",
  "black-forest-labs": "blackforestlabs.ai",
  "world-labs": "worldlabs.ai",
  "liquid-ai": "liquid.ai",

  // Infrastructure
  intel: "intel.com",
  micron: "micron.com",
  arm: "arm.com",
  marvell: "marvell.com",
  asml: "asml.com",
  supermicro: "supermicro.com",
  tenstorrent: "tenstorrent.com",
  etched: "etched.com",

  // Compute / datacenter
  equinix: "equinix.com",
  "digital-realty": "digitalrealty.com",
  "fireworks-ai": "fireworks.ai",
  baseten: "baseten.co",
  modal: "modal.com",
  iren: "iren.com",

  // Energy
  "ge-vernova": "gevernova.com",
  "talen-energy": "talenenergy.com",
  "bloom-energy": "bloomenergy.com",
  "kairos-power": "kairospower.com",
  "commonwealth-fusion": "cfs.energy",
  "x-energy": "x-energy.com",

  // Robotics
  "boston-dynamics": "bostondynamics.com",
  "agility-robotics": "agilityrobotics.com",
  waymo: "waymo.com",
  wayve: "wayve.ai",
  "sanctuary-ai": "sanctuary.ai",

  // Agent infra / data
  "hugging-face": "huggingface.co",
  "scale-ai": "scale.com",
  "weights-and-biases": "wandb.ai",
  weaviate: "weaviate.io",
  vercel: "vercel.com",

  // Enterprise AI
  cognition: "cognition.ai",
  elevenlabs: "elevenlabs.io",
  runway: "runwayml.com",
  synthesia: "synthesia.io",
  suno: "suno.com",
  hebbia: "hebbia.com",
  replit: "replit.com",
  mercor: "mercor.com",

  // Big Tech incumbents & global platforms
  ibm: "ibm.com",
  salesforce: "salesforce.com",
  servicenow: "servicenow.com",
  adobe: "adobe.com",
  sap: "sap.com",
  bytedance: "bytedance.com",
  tencent: "tencent.com",
  alibaba: "alibaba.com",
  baidu: "baidu.com",

  // Infrastructure (memory, networking, systems)
  samsung: "samsung.com",
  "sk-hynix": "skhynix.com",
  qualcomm: "qualcomm.com",
  cisco: "cisco.com",
  "dell-technologies": "dell.com",
  "hewlett-packard-enterprise": "hpe.com",

  // Data & ML platforms
  databricks: "databricks.com",
  snowflake: "snowflake.com",

  // Foundation models
  "stability-ai": "stability.ai",
  "character-ai": "character.ai",
  midjourney: "midjourney.com",
  "luma-ai": "lumalabs.ai",

  // Defense & autonomy
  palantir: "palantir.com",
  anduril: "anduril.com",
  "shield-ai": "shield.ai",
  nuro: "nuro.ai",

  // Enterprise AI / apps
  notion: "notion.so",
  canva: "canva.com",
  figma: "figma.com",
  grammarly: "grammarly.com",
  gong: "gong.io",
  ramp: "ramp.com",

  // Energy
  terrapower: "terrapower.com",
  "helion-energy": "helionenergy.com",
  "nuscale-power": "nuscalepower.com",

  // Compute (sovereign-backed)
  g42: "g42.ai",
  humain: "humain.ai",
  rapidus: "rapidus.inc",

  // Investors: asset managers, quants, sovereign funds
  fidelity: "fidelity.com",
  "t-rowe-price": "troweprice.com",
  "baillie-gifford": "bailliegifford.com",
  "d-e-shaw": "deshaw.com",
  millennium: "mlp.com",
  point72: "point72.com",
  susquehanna: "sig.com",
  "hudson-river-trading": "hudsonrivertrading.com",
  "lux-capital": "luxcapital.com",
  "menlo-ventures": "menlovc.com",
  "public-investment-fund": "pif.gov.sa",
  mubadala: "mubadala.com",
  gic: "gic.com.sg",
  "qatar-investment-authority": "qia.qa",

  // More leading venture firms
  greylock: "greylock.com",
  benchmark: "benchmark.com",
  ivp: "ivp.com",
  "spark-capital": "sparkcapital.com",
  gv: "gv.com",
  "bain-capital-ventures": "baincapitalventures.com",
  "redpoint-ventures": "redpoint.com",
  conviction: "conviction.com",
};

/** Country flag codes for government entities (flagcdn.com). */
export const GOV_FLAGS: Record<string, string> = {
  "united-states": "us",
  "european-union": "eu",
  "united-kingdom": "gb",
  canada: "ca",
  "saudi-arabia": "sa",
  "united-arab-emirates": "ae",
  singapore: "sg",
  japan: "jp",
  "south-korea": "kr",
  india: "in",
  france: "fr",
  germany: "de",
  china: "cn",
  qatar: "qa",
};

export function clearbitLogo(domain: string): string {
  return `https://logo.clearbit.com/${domain}`;
}

export function faviconLogo(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export function flagUrl(code: string): string {
  return `https://flagcdn.com/w160/${code}.png`;
}

export interface LogoInfo {
  primary?: string;
  fallback?: string;
  domain?: string;
}

/** Returns the best logo source(s) for an entity id, if known. */
export function logoFor(id: string): LogoInfo {
  const flag = GOV_FLAGS[id];
  if (flag) return { primary: flagUrl(flag) };
  const domain = ENTITY_DOMAINS[id];
  if (domain) return { primary: clearbitLogo(domain), fallback: faviconLogo(domain), domain };
  return {};
}
