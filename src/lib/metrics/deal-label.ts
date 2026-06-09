import { entityById } from "../data";
import type { CapitalFlow, DealStructure, FlowType, FundingRound, RoundType, Sector } from "../types";

export interface DealLabel {
  /** Headline tag — e.g. "Series B", "Compute Capacity Agreement". */
  primary: string;
  /** What kind of exchange — e.g. "Equity round", "Cash for compute capacity". */
  structure: string;
  /** Direction of value — e.g. "Cash → Equity stake". */
  exchange: string;
  /** Badge text for rationale panels. */
  category: string;
  roundType?: RoundType;
  dealStructure?: DealStructure;
}

const STRUCTURE_META: Record<
  DealStructure,
  { primary: string; structure: string; exchange: string; category: string }
> = {
  "equity-round": {
    primary: "Equity round",
    structure: "Priced equity",
    exchange: "Cash → Equity stake",
    category: "Equity round",
  },
  "growth-equity": {
    primary: "Growth equity",
    structure: "Late-stage equity",
    exchange: "Cash → Growth equity",
    category: "Growth equity",
  },
  "strategic-equity": {
    primary: "Strategic equity",
    structure: "Corporate venture stake",
    exchange: "Cash → Strategic equity + alignment",
    category: "Strategic equity",
  },
  "debt-financing": {
    primary: "Debt financing",
    structure: "Credit facility / term loan",
    exchange: "Debt → Infrastructure capacity",
    category: "Debt financing",
  },
  "government-grant": {
    primary: "Government grant",
    structure: "Non-dilutive sovereign capital",
    exchange: "Grant → Program execution",
    category: "Government grant",
  },
  "compute-capacity-agreement": {
    primary: "Compute capacity agreement",
    structure: "Multi-year GPU / datacenter contract",
    exchange: "Cash → Reserved compute capacity",
    category: "Compute agreement",
  },
  "infrastructure-commitment": {
    primary: "Infrastructure commitment",
    structure: "Datacenter buildout obligation",
    exchange: "Capital → Dedicated AI infrastructure",
    category: "Infrastructure commitment",
  },
  "gpu-supply-allocation": {
    primary: "GPU supply allocation",
    structure: "Priority hardware allocation",
    exchange: "Hardware supply → Capacity commitment",
    category: "GPU supply",
  },
  "hardware-supply": {
    primary: "Hardware supply agreement",
    structure: "Accelerator / systems delivery",
    exchange: "Hardware → Deployment commitment",
    category: "Hardware supply",
  },
  "power-purchase-agreement": {
    primary: "Power purchase agreement",
    structure: "Long-term electricity offtake (PPA)",
    exchange: "Cash → Baseload power capacity",
    category: "Power agreement",
  },
  "energy-infrastructure": {
    primary: "Energy infrastructure deal",
    structure: "Generation / reactor development",
    exchange: "Capital → New power generation",
    category: "Energy infrastructure",
  },
  "strategic-partnership": {
    primary: "Strategic partnership",
    structure: "Commercial + capital alignment",
    exchange: "Capital → Strategic access",
    category: "Strategic partnership",
  },
  "platform-partnership": {
    primary: "Platform partnership",
    structure: "Cloud + equity / revenue share",
    exchange: "Cloud credits + cash → Equity + distribution",
    category: "Platform partnership",
  },
  acquisition: {
    primary: "Acquisition",
    structure: "Full company purchase",
    exchange: "Cash → Ownership + talent",
    category: "Acquisition",
  },
  "sovereign-partnership": {
    primary: "Sovereign partnership",
    structure: "National strategic program",
    exchange: "Sovereign capital → Domestic AI capacity",
    category: "Sovereign partnership",
  },
};

function inferStructure(
  type: FlowType,
  sourceSector: Sector,
  targetSector: Sector
): DealStructure {
  switch (type) {
    case "grant":
      return sourceSector === "government" ? "government-grant" : "government-grant";
    case "compute-deal":
      return sourceSector === "big-tech" || targetSector === "foundation-model"
        ? "infrastructure-commitment"
        : "compute-capacity-agreement";
    case "supply":
      return sourceSector === "infrastructure" ? "gpu-supply-allocation" : "hardware-supply";
    case "energy-contract":
      return "power-purchase-agreement";
    case "acquisition":
      return "acquisition";
    case "partnership":
      if (sourceSector === "government") return "sovereign-partnership";
      if (sourceSector === "big-tech" && targetSector === "foundation-model") return "platform-partnership";
      if (sourceSector === "big-tech" && targetSector === "energy") return "energy-infrastructure";
      return "strategic-partnership";
    case "investment":
      if (sourceSector === "big-tech") return "strategic-equity";
      if (sourceSector === "investor") return "growth-equity";
      return "strategic-equity";
    default:
      return "strategic-partnership";
  }
}

function debtLenders(): Set<string> {
  return new Set(["jpmorgan-chase", "goldman-sachs", "morgan-stanley", "blackrock"]);
}

export function dealLabelFor(flow: CapitalFlow, round?: FundingRound): DealLabel {
  const source = entityById.get(flow.sourceId);
  const target = entityById.get(flow.targetId);
  const sourceSector = source?.sector ?? "investor";
  const targetSector = target?.sector ?? "investor";

  // Equity round flows always lead with the round name.
  if (round) {
    const isGrant = flow.type === "grant" || round.roundType === "Grant";
    if (isGrant) {
      const meta = STRUCTURE_META["government-grant"];
      return {
        primary: round.roundType === "Grant" ? "Grant" : round.roundType,
        structure: meta.structure,
        exchange: meta.exchange,
        category: meta.category,
        roundType: round.roundType,
        dealStructure: "government-grant",
      };
    }
    return {
      primary: round.roundType,
      structure: "Priced equity round",
      exchange: "Cash → Equity stake",
      category: round.roundType,
      roundType: round.roundType,
      dealStructure: "equity-round",
    };
  }

  const structure =
    flow.dealStructure ?? inferStructure(flow.type, sourceSector, targetSector);

  // Debt from banks on compute/infra targets.
  if (
    flow.type === "investment" &&
    debtLenders().has(flow.sourceId) &&
    (targetSector === "compute" || targetSector === "infrastructure")
  ) {
    const meta = STRUCTURE_META["debt-financing"];
    return { primary: meta.primary, structure: meta.structure, exchange: meta.exchange, category: meta.category, dealStructure: "debt-financing" };
  }

  const meta = STRUCTURE_META[structure];
  return {
    primary: meta.primary,
    structure: meta.structure,
    exchange: meta.exchange,
    category: meta.category,
    dealStructure: structure,
  };
}
