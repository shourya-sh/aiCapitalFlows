/**
 * Core domain model for the AI Capital Flow Observatory.
 *
 * Everything in the app — graph, analytics, sankey, metrics — is derived from
 * these normalized records. The ingestion/ETL layer (see `src/lib/etl`) is
 * responsible for mapping external sources (Crunchbase, SEC, OECD, etc.) into
 * these shapes so the rest of the application never depends on a vendor format.
 */

export type Sector =
  | "investor"
  | "big-tech"
  | "foundation-model"
  | "infrastructure"
  | "compute"
  | "energy"
  | "robotics"
  | "agent-infra"
  | "enterprise-ai"
  | "government";

export type Region =
  | "North America"
  | "Europe"
  | "Middle East"
  | "Asia"
  | "South America"
  | "Africa"
  | "Oceania";

export type RoundType =
  | "Pre-Seed"
  | "Seed"
  | "Series A"
  | "Series B"
  | "Series C"
  | "Series D"
  | "Series E"
  | "Series E+"
  | "Growth"
  | "Strategic"
  | "Grant"
  | "Debt"
  | "PIPE"
  | "Public";

export type FlowType =
  | "investment"
  | "acquisition"
  | "partnership"
  | "grant"
  | "compute-deal"
  | "supply"
  | "energy-contract";

/** How capital or value is exchanged — shown explicitly in the UI. */
export type DealStructure =
  | "equity-round"
  | "growth-equity"
  | "strategic-equity"
  | "debt-financing"
  | "government-grant"
  | "compute-capacity-agreement"
  | "infrastructure-commitment"
  | "gpu-supply-allocation"
  | "hardware-supply"
  | "power-purchase-agreement"
  | "energy-infrastructure"
  | "strategic-partnership"
  | "platform-partnership"
  | "acquisition"
  | "sovereign-partnership";

export type SourceType =
  | "press-release"
  | "news"
  | "filing"
  | "crunchbase"
  | "sec"
  | "regulatory";

/** A citable public record backing a deal or ownership claim. */
export interface SourceCitation {
  id: string;
  title: string;
  url: string;
  publisher: string;
  publishedAt?: string;
  type: SourceType;
}

export type OwnerCategory =
  | "venture-capital"
  | "institutional"
  | "private-equity"
  | "sovereign-wealth"
  | "corporate-strategic"
  | "founders-employees"
  | "individual"
  | "retail-public"
  | "government"
  | "other";

/** A single ownership stake in a company. Percentages are approximate, as-of date noted. */
export interface OwnershipStake {
  name: string;
  /** Links to an entity in the graph when known. */
  entityId?: string;
  category: OwnerCategory;
  stakePct: number;
  citations: SourceCitation[];
}

/** Point-in-time ownership breakdown for an entity. */
export interface OwnershipSnapshot {
  entityId: string;
  asOf: string;
  stakes: OwnershipStake[];
  citations: SourceCitation[];
  methodology: string;
}

export type DataQuality = "verified" | "partial" | "unverified";

/** A single entity in the AI economy (company, investor, or government). */
export interface Entity {
  id: string;
  name: string;
  /** Sector is used as the primary classification + color in the graph. */
  sector: Sector;
  description: string;
  headquarters: string;
  country: string;
  region: Region;
  founded?: number;
  /** Cumulative capital raised (USD). */
  totalFundingUsd: number;
  /** Latest private valuation (USD), if applicable. */
  latestValuationUsd?: number;
  /** Public market cap (USD) for listed infra/energy entities. */
  marketCapUsd?: number;
  /** Trailing revenue estimate (USD). */
  revenueUsd?: number;
  /** End users (consumer products). */
  users?: number;
  /** Paying enterprise customers. */
  enterpriseCustomers?: number;
  tags: string[];
  website?: string;
  /** How well-sourced the entity's financial data is. */
  dataQuality?: DataQuality;
}

/** A funding round closed by a company. */
export interface FundingRound {
  id: string;
  targetId: string;
  date: string; // ISO date
  roundType: RoundType;
  amountUsd: number;
  valuationUsd?: number;
  leadInvestorId?: string;
  investorIds: string[];
  citations?: SourceCitation[];
  verified?: boolean;
  summary?: string;
}

/**
 * A directed flow of capital between two entities. Edges in the network graph
 * and the inputs to the Sankey are both derived from these records.
 */
export interface CapitalFlow {
  id: string;
  sourceId: string;
  targetId: string;
  amountUsd: number;
  type: FlowType;
  date: string; // ISO date
  roundId?: string;
  /** Explicit deal structure when it isn't a standard equity round. */
  dealStructure?: DealStructure;
  /** Public sources backing this flow. */
  citations?: SourceCitation[];
  verified?: boolean;
  /** Factual one-liner when sourced from filings or press. */
  summary?: string;
}

export interface ObservatoryDataset {
  entities: Entity[];
  rounds: FundingRound[];
  flows: CapitalFlow[];
  ownership: OwnershipSnapshot[];
  generatedAt: string;
}

export interface SectorMeta {
  id: Sector;
  label: string;
  color: string;
  /** Conceptual position in the capital value chain (used by the Sankey). */
  layer: number;
  blurb: string;
}
