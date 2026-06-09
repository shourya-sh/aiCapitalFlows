import { SECTORS } from "../sectors";
import { dealLabelFor } from "../metrics/deal-label";
import type {
  DealStructure,
  Entity,
  FlowType,
  FundingRound,
  OwnershipSnapshot,
  RoundType,
  Sector,
  SourceCitation,
} from "../types";
import {
  entityById,
  getOwnershipSnapshot,
  inflowsTo,
  investorsOf,
  outflowsFrom,
  portfolioOf,
  roundById,
  roundsForTarget,
} from "./index";

export interface FundingHistoryPoint {
  date: string;
  roundType: string;
  amount: number;
  cumulative: number;
  valuation?: number;
}

export interface CapitalMovement {
  id: string;
  direction: "in" | "out";
  counterpartyId: string;
  counterpartyName: string;
  counterpartySector: Sector;
  counterpartyColor: string;
  amount: number;
  type: FlowType;
  date: string;
  /** Headline deal tag — e.g. "Series B", "Compute capacity agreement". */
  dealLabel: string;
  /** What is being exchanged — e.g. "Cash → Equity stake". */
  dealExchange: string;
  /** Secondary structure line — e.g. "Priced equity round". */
  dealStructure: string;
  roundType?: RoundType;
  structureKind?: DealStructure;
  citations?: SourceCitation[];
  verified?: boolean;
  summary?: string;
}

export interface EntityDetail {
  entity: Entity;
  sectorLabel: string;
  sectorColor: string;
  investors: { id: string; name: string; sector: string; amount: number }[];
  portfolio: { id: string; name: string; sector: string; amount: number }[];
  rounds: FundingRound[];
  fundingHistory: FundingHistoryPoint[];
  movements: CapitalMovement[];
  ownership?: OwnershipSnapshot;
  totalInflow: number;
  totalOutflow: number;
}

export function getEntityDetail(id: string): EntityDetail | null {
  const entity = entityById.get(id);
  if (!entity) return null;

  const inflows = inflowsTo(id);
  const outflows = outflowsFrom(id);

  // Investors with aggregated amount.
  const investorAmount = new Map<string, number>();
  for (const f of inflows) {
    if (f.type === "investment" || f.type === "grant" || f.type === "partnership") {
      investorAmount.set(f.sourceId, (investorAmount.get(f.sourceId) ?? 0) + f.amountUsd);
    }
  }
  const investors = investorsOf(id)
    .map((inv) => ({
      id: inv.id,
      name: inv.name,
      sector: SECTORS[inv.sector].label,
      amount: investorAmount.get(inv.id) ?? 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Portfolio (for investors / funders).
  const portfolioAmount = new Map<string, number>();
  for (const f of outflows) {
    portfolioAmount.set(f.targetId, (portfolioAmount.get(f.targetId) ?? 0) + f.amountUsd);
  }
  const portfolio = portfolioOf(id)
    .map((p) => ({
      id: p.id,
      name: p.name,
      sector: SECTORS[p.sector].label,
      amount: portfolioAmount.get(p.id) ?? 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Funding history timeline.
  const rounds = roundsForTarget(id);
  let cumulative = 0;
  const fundingHistory: FundingHistoryPoint[] = rounds.map((r) => {
    cumulative += r.amountUsd;
    return {
      date: r.date,
      roundType: r.roundType,
      amount: r.amountUsd,
      cumulative,
      valuation: r.valuationUsd,
    };
  });

  const movementFromFlow = (
    f: (typeof inflows)[number],
    direction: "in" | "out",
    counterpartyId: string
  ): CapitalMovement => {
    const cp = entityById.get(counterpartyId);
    const round = f.roundId ? roundById.get(f.roundId) : undefined;
    const label = dealLabelFor(f, round);
    return {
      id: f.id,
      direction,
      counterpartyId,
      counterpartyName: cp?.name ?? counterpartyId,
      counterpartySector: (cp?.sector ?? "investor") as Sector,
      counterpartyColor: cp ? SECTORS[cp.sector].color : "#8b97a8",
      amount: f.amountUsd,
      type: f.type,
      date: f.date,
      dealLabel: label.primary,
      dealExchange: label.exchange,
      dealStructure: label.structure,
      roundType: label.roundType,
      structureKind: label.dealStructure,
      citations: f.citations,
      verified: f.verified,
      summary: f.summary,
    };
  };

  // Unified capital-movement ledger (inflows + outflows), newest first.
  const movements: CapitalMovement[] = [
    ...inflows.map((f) => movementFromFlow(f, "in", f.sourceId)),
    ...outflows.map((f) => movementFromFlow(f, "out", f.targetId)),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return {
    entity,
    sectorLabel: SECTORS[entity.sector].label,
    sectorColor: SECTORS[entity.sector].color,
    investors,
    portfolio,
    rounds,
    fundingHistory,
    movements,
    ownership: getOwnershipSnapshot(id),
    totalInflow: inflows.reduce((s, f) => s + f.amountUsd, 0),
    totalOutflow: outflows.reduce((s, f) => s + f.amountUsd, 0),
  };
}
