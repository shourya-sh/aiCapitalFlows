import type {
  CapitalFlow,
  Entity,
  FundingRound,
  ObservatoryDataset,
} from "../types";
import { CURATED_ENTITIES } from "./curated";
import { CURATED_DEALS, CURATED_ROUNDS } from "./relationships";
import { attachVerification } from "./verified/deals";
import { OWNERSHIP_SNAPSHOTS, ownershipByEntityId } from "./verified/ownership";

/**
 * Builds the dataset from curated entities + relationships, enriched with
 * verified citations and ownership where public sources exist.
 */

function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function generateDataset(): ObservatoryDataset {
  const entities: Entity[] = CURATED_ENTITIES.map((c) => ({
    ...c,
    id: c.id ?? slug(c.name),
  }));
  const byId = new Map(entities.map((e) => [e.id, e]));

  const rounds: FundingRound[] = [];
  const flows: CapitalFlow[] = [];
  let roundSeq = 0;
  let flowSeq = 0;

  // ── Funding rounds → investment flows ──
  for (const cr of CURATED_ROUNDS) {
    if (!byId.has(cr.targetId) || cr.amountUsd <= 0) continue;

    const validInvestors = cr.investors.filter(
      (i) => i.amountUsd > 0 && byId.has(i.investorId)
    );
    if (validInvestors.length === 0) continue;

    const lead =
      cr.leadInvestorId && byId.has(cr.leadInvestorId)
        ? cr.leadInvestorId
        : validInvestors[0].investorId;

    const round: FundingRound = {
      id: `round-${++roundSeq}`,
      targetId: cr.targetId,
      date: cr.date,
      roundType: cr.roundType,
      amountUsd: cr.amountUsd,
      valuationUsd: cr.valuationUsd,
      leadInvestorId: lead,
      investorIds: validInvestors.map((i) => i.investorId),
    };
    rounds.push(round);

    for (const inv of validInvestors) {
      const source = byId.get(inv.investorId)!;
      const verification = attachVerification(inv.investorId, cr.targetId, cr.date);
      flows.push({
        id: `flow-${++flowSeq}`,
        sourceId: inv.investorId,
        targetId: cr.targetId,
        amountUsd: inv.amountUsd,
        type: source.sector === "government" ? "grant" : "investment",
        date: cr.date,
        roundId: round.id,
        citations: verification.citations.length ? verification.citations : undefined,
        verified: verification.verified,
        summary: verification.summary || undefined,
      });
    }

    const roundVerification = attachVerification(
      validInvestors[0].investorId,
      cr.targetId,
      cr.date
    );
    if (roundVerification.verified) {
      round.citations = roundVerification.citations;
      round.verified = true;
      round.summary = roundVerification.summary;
    }
  }

  // ── Strategic / value-chain deals ──
  // Investment flows from rounds are canonical — never double-count the same
  // source → target on the same date as a separate deal.
  const equityFlowKeys = new Set(
    flows
      .filter((f) => f.roundId && (f.type === "investment" || f.type === "grant"))
      .map((f) => `${f.sourceId}|${f.targetId}|${f.date}`)
  );

  const seen = new Set<string>();
  for (const deal of CURATED_DEALS) {
    if (!byId.has(deal.sourceId) || !byId.has(deal.targetId)) continue;
    if (deal.amountUsd <= 0) continue;

    // Skip exact duplicates (same parties, type, date).
    const key = `${deal.sourceId}|${deal.targetId}|${deal.type}|${deal.date}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const investmentKey = `${deal.sourceId}|${deal.targetId}|${deal.date}`;
    const isEquityLike =
      deal.type === "investment" ||
      deal.type === "grant" ||
      deal.dealStructure === "strategic-equity" ||
      deal.dealStructure === "growth-equity";
    if (isEquityLike && equityFlowKeys.has(investmentKey)) continue;

    const verification = attachVerification(deal.sourceId, deal.targetId, deal.date);
    flows.push({
      id: `flow-${++flowSeq}`,
      sourceId: deal.sourceId,
      targetId: deal.targetId,
      amountUsd: deal.amountUsd,
      type: deal.type,
      date: deal.date,
      dealStructure: deal.dealStructure,
      citations: verification.citations.length ? verification.citations : undefined,
      verified: verification.verified,
      summary: verification.summary || undefined,
    });

    if (isEquityLike) equityFlowKeys.add(investmentKey);
  }

  // Mark entity data quality from verification coverage.
  const verifiedTargets = new Set(
    flows.filter((f) => f.verified).map((f) => f.targetId)
  );
  for (const e of entities) {
    if (ownershipByEntityId.has(e.id)) {
      e.dataQuality = "verified";
    } else if (verifiedTargets.has(e.id)) {
      e.dataQuality = "partial";
    } else {
      e.dataQuality = "unverified";
    }
  }

  return {
    entities,
    rounds,
    flows,
    ownership: OWNERSHIP_SNAPSHOTS,
    generatedAt: new Date("2026-06-01T00:00:00Z").toISOString(),
  };
}
