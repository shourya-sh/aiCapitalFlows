import { entityById } from "../data";
import { sectorLabel } from "../sectors";
import type { DealStructure, FlowType, RoundType, Sector } from "../types";
import { formatUsd } from "../utils";

/**
 * Generates the *rationale* behind a capital route: why it happened and what
 * each side gained. Derived deterministically from the entities, deal type, and
 * size so it stays consistent with the data (no external calls).
 */

export interface RouteRationale {
  category: string;
  summary: string;
  sourceGain: string;
  targetGain: string;
  verified?: boolean;
  citations?: import("../types").SourceCitation[];
}

const SECTOR_THESIS: Record<Sector, string> = {
  "foundation-model": "exposure to frontier-model economics — the fastest-compounding layer of the AI stack",
  infrastructure: "exposure to the picks-and-shovels of the AI buildout",
  compute: "exposure to contracted, capacity-constrained AI compute demand",
  energy: "exposure to the power bottleneck now gating AI growth",
  robotics: "exposure to embodied AI and the automation of physical labor",
  "agent-infra": "exposure to the tooling layer that turns models into autonomous agents",
  "enterprise-ai": "exposure to applied AI capturing enterprise software budgets",
  "big-tech": "a strategic foothold alongside a platform incumbent",
  investor: "co-investment access and deal flow",
  government: "alignment with sovereign AI priorities",
};

const USE_OF_FUNDS: Record<Sector, string> = {
  "foundation-model": "training compute, research talent, and enterprise go-to-market",
  infrastructure: "R&D and manufacturing scale-up",
  compute: "datacenter capacity and GPU procurement",
  energy: "new generation capacity and grid interconnection",
  robotics: "hardware development and pilot deployments",
  "agent-infra": "product depth and developer-ecosystem growth",
  "enterprise-ai": "go-to-market expansion and product velocity",
  "big-tech": "platform investment and buildout",
  investor: "fund deployment",
  government: "program execution",
};

function name(id: string): string {
  return entityById.get(id)?.name ?? id;
}
function sectorOf(id: string): Sector {
  return entityById.get(id)?.sector ?? "investor";
}

export function rationaleFor(
  sourceId: string,
  targetId: string,
  type: FlowType,
  amountUsd: number,
  opts?: {
    dealLabel?: string;
    dealExchange?: string;
    roundType?: RoundType;
    structureKind?: DealStructure;
    verifiedSummary?: string;
    citations?: import("../types").SourceCitation[];
    verified?: boolean;
  }
): RouteRationale {
  const s = name(sourceId);
  const t = name(targetId);
  const sSec = sectorOf(sourceId);
  const tSec = sectorOf(targetId);
  const amt = formatUsd(amountUsd);
  const thesis = SECTOR_THESIS[tSec];
  const useOfFunds = USE_OF_FUNDS[tSec];

  if (opts?.verified && opts.verifiedSummary) {
    return {
      category: opts.dealLabel ?? opts.roundType ?? "Verified deal",
      summary: opts.verifiedSummary,
      sourceGain: `${s} secured a documented stake or contractual position in ${t}, per cited sources below.`,
      targetGain: `${t} received ${amt} under terms disclosed in the linked filings and press releases.`,
      verified: true,
      citations: opts.citations,
    };
  }

  if (opts?.roundType) {
    return {
      category: opts.roundType,
      summary: `${s} led or participated in a ${opts.roundType} for ${t} — a priced equity round exchanging cash for ownership.`,
      sourceGain: `Equity stake in ${t} at the ${opts.roundType} valuation, with pro-rata rights into future rounds.`,
      targetGain: `${amt} in ${opts.roundType} proceeds to fund ${useOfFunds}.`,
    };
  }

  if (opts?.dealLabel && opts?.structureKind) {
    const category = opts.dealLabel;
    const exchange = opts.dealExchange ?? "capital for strategic value";
    switch (opts.structureKind) {
      case "compute-capacity-agreement":
      case "infrastructure-commitment":
        return {
          category,
          summary: `${s} signs a compute capacity agreement with ${t} — ${exchange.toLowerCase()}.`,
          sourceGain: `Reserved GPU/datacenter capacity so ${s} can train and serve without competing for spot market supply.`,
          targetGain: `${amt} of contracted revenue that underwrites ${t}'s buildout and secures financing.`,
        };
      case "gpu-supply-allocation":
      case "hardware-supply":
        return {
          category,
          summary: `${s} allocates hardware to ${t} under a supply agreement — ${exchange.toLowerCase()}.`,
          sourceGain: `Recurring silicon revenue and deeper platform lock-in across ${t}'s fleet.`,
          targetGain: `Priority access to scarce accelerators to expand capacity ahead of rivals.`,
        };
      case "power-purchase-agreement":
        return {
          category,
          summary: `${s} secures a power purchase agreement with ${t} — ${exchange.toLowerCase()}.`,
          sourceGain: `Long-term baseload electricity for datacenters amid grid constraints.`,
          targetGain: `${amt} offtake stabilizing ${t}'s project financing and capacity expansion.`,
        };
      case "energy-infrastructure":
        return {
          category,
          summary: `${s} funds ${t}'s energy infrastructure build — ${exchange.toLowerCase()}.`,
          sourceGain: `Dedicated clean power capacity aligned to ${s}'s datacenter roadmap.`,
          targetGain: `${amt} to develop generation assets with a committed hyperscale offtaker.`,
        };
      case "platform-partnership":
        return {
          category,
          summary: `${s} forms a platform partnership with ${t} — ${exchange.toLowerCase()}.`,
          sourceGain: `Preferred model access, cloud workload routing, and equity upside in ${t}.`,
          targetGain: `${amt} plus distribution through ${s}'s cloud and enterprise channels.`,
        };
      case "debt-financing":
        return {
          category,
          summary: `${s} provides debt financing to ${t} — ${exchange.toLowerCase()}.`,
          sourceGain: `Interest income and relationship with a strategic AI infrastructure borrower.`,
          targetGain: `${amt} of non-dilutive capital to finance datacenter expansion and GPU procurement.`,
        };
      case "growth-equity":
      case "strategic-equity":
        return {
          category,
          summary: `${s} takes a ${category.toLowerCase()} position in ${t} — ${exchange.toLowerCase()}.`,
          sourceGain: `Equity upside and strategic alignment with ${t}'s roadmap.`,
          targetGain: `${amt} to accelerate ${useOfFunds}.`,
        };
      default:
        break;
    }
  }

  switch (type) {
    case "investment":
      if (sSec === "big-tech") {
        return {
          category: "Strategic investment",
          summary: `${s} takes a strategic stake in ${t} to secure ${thesis} and tie ${t} into its platform.`,
          sourceGain: `Equity upside plus preferred access to ${t}'s technology and a likely cloud/compute commitment routed back to ${s}.`,
          targetGain: `${amt} in capital plus distribution, infrastructure, and enterprise reach from ${s}.`,
        };
      }
      return {
        category: "Equity investment",
        summary: `${s} backs ${t} to capture ${thesis}.`,
        sourceGain: `An equity stake in ${t}, positioning ${s} for markups ahead of the next round or a public listing.`,
        targetGain: `${amt} of growth capital to fund ${useOfFunds}.`,
      };
    case "grant":
      return {
        category: "Government grant",
        summary: `${s} funds ${t} to build domestic AI capability in ${sectorLabel(tSec).toLowerCase()}.`,
        sourceGain: `Sovereign AI capacity, high-skilled jobs, and strategic autonomy in critical technology.`,
        targetGain: `${amt} of non-dilutive capital to accelerate ${useOfFunds}.`,
      };
    case "partnership":
      if (sSec === "government") {
        return {
          category: "Sovereign partnership",
          summary: `${s} forms a strategic partnership with ${t} to anchor national AI infrastructure.`,
          sourceGain: `Domestic compute, supply security, and influence over a strategic AI asset.`,
          targetGain: `${amt} in commitments plus a long-term sovereign customer and regulatory goodwill.`,
        };
      }
      return {
        category: "Strategic partnership",
        summary: `${s} partners with ${t}, combining capital with commercial alignment.`,
        sourceGain: `Preferred access to ${t}'s roadmap and ${thesis}, with demand routed back to ${s}.`,
        targetGain: `${amt} plus distribution, infrastructure, and credibility from ${s}.`,
      };
    case "compute-deal":
      return {
        category: "Compute agreement",
        summary: `${s} contracts dedicated compute capacity from ${t}.`,
        sourceGain: `Guaranteed access to scarce GPU capacity, de-risking ${s}'s training and inference roadmap.`,
        targetGain: `${amt} of multi-year contracted revenue that underwrites ${t}'s datacenter buildout and financing.`,
      };
    case "supply":
      return {
        category: "Supply / allocation",
        summary: `${s} supplies accelerators and systems to ${t}.`,
        sourceGain: `Recurring hardware demand and deeper platform lock-in (e.g. CUDA) across ${t}'s fleet.`,
        targetGain: `Priority allocation of scarce ${s} silicon to expand capacity ahead of competitors.`,
      };
    case "energy-contract":
      return {
        category: "Power agreement",
        summary: `${s} secures long-term power from ${t} to feed its datacenters.`,
        sourceGain: `Baseload electricity guaranteeing uptime amid grid constraints — the gating input for AI scale.`,
        targetGain: `${amt} long-term offtake that stabilizes ${t}'s project financing and capacity expansion.`,
      };
    case "acquisition":
      return {
        category: "Acquisition",
        summary: `${s} acquires ${t} to absorb its technology and talent.`,
        sourceGain: `Direct ownership of ${t}'s ${thesis} and immediate integration into ${s}.`,
        targetGain: `${amt} liquidity for shareholders and scale via ${s}'s resources.`,
      };
    default:
      return {
        category: "Capital flow",
        summary: `${s} directs capital to ${t}.`,
        sourceGain: `${thesis}.`,
        targetGain: `${amt} to fund ${useOfFunds}.`,
      };
  }
}
