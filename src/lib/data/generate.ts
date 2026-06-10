import type {
  CapitalFlow,
  Entity,
  FundingRound,
  ObservatoryDataset,
} from "../types";
import { CURATED_ENTITIES } from "./curated";
import { CURATED_DEALS, CURATED_ROUNDS } from "./relationships";
import { DOCUMENTED_DEALS, type DocumentedDeal } from "./documented-deals";
import { attachVerification, flowKey } from "./verified/deals";
import { OWNERSHIP_SNAPSHOTS, ownershipByEntityId } from "./verified/ownership";

/**
 * Builds the dataset from curated entities + relationships, enriched with
 * documented-deal citations where public sources exist.
 *
 * Curated rounds/deals are the full graph; documented deals add citations and
 * fill gaps — they never replace multi-investor rounds.
 */

function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function roundKey(targetId: string, date: string): string {
  return `${targetId}|${date}`;
}

/** Lookup documented deal by source|target|date for citation enrichment. */
function buildDocumentedIndex(): Map<string, DocumentedDeal> {
  const map = new Map<string, DocumentedDeal>();
  for (const doc of DOCUMENTED_DEALS) {
    map.set(flowKey(doc.sourceId, doc.targetId, doc.date), doc);
  }
  return map;
}

function enrichFromDocumented(
  flow: CapitalFlow,
  documented: Map<string, DocumentedDeal>
): void {
  const doc = documented.get(flowKey(flow.sourceId, flow.targetId, flow.date));
  if (!doc) return;
  flow.citations = doc.citations;
  flow.verified = true;
  flow.summary = doc.summary;
  flow.date = doc.date;
}

export function generateDataset(): ObservatoryDataset {
  const entities: Entity[] = CURATED_ENTITIES.map((c) => ({
    ...c,
    id: c.id ?? slug(c.name),
  }));
  const byId = new Map(entities.map((e) => [e.id, e]));
  const documented = buildDocumentedIndex();

  const rounds: FundingRound[] = [];
  const flows: CapitalFlow[] = [];
  let roundSeq = 0;
  let flowSeq = 0;

  const equityFlowKeys = new Set<string>();

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

    // Round-level citation from any documented investor in this round.
    const roundDoc = DOCUMENTED_DEALS.find(
      (d) =>
        d.targetId === cr.targetId &&
        d.date === cr.date &&
        d.roundType &&
        validInvestors.some((i) => i.investorId === d.sourceId)
    );
    if (roundDoc) {
      round.citations = roundDoc.citations;
      round.verified = true;
      round.summary = roundDoc.summary;
      round.date = roundDoc.date;
      if (roundDoc.valuationUsd) round.valuationUsd = roundDoc.valuationUsd;
    } else {
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

    rounds.push(round);

    for (const inv of validInvestors) {
      const source = byId.get(inv.investorId)!;
      const verification = attachVerification(inv.investorId, cr.targetId, cr.date);
      const flow: CapitalFlow = {
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
      };
      enrichFromDocumented(flow, documented);
      flows.push(flow);
      equityFlowKeys.add(flowKey(inv.investorId, cr.targetId, cr.date));
    }
  }

  // ── Strategic / value-chain deals ──
  const seen = new Set<string>();
  for (const deal of CURATED_DEALS) {
    if (!byId.has(deal.sourceId) || !byId.has(deal.targetId)) continue;
    if (deal.amountUsd <= 0) continue;

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
    const flow: CapitalFlow = {
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
    };
    enrichFromDocumented(flow, documented);
    flows.push(flow);

    if (isEquityLike) equityFlowKeys.add(investmentKey);
  }

  // ── Documented-only deals not already in the graph ──
  const existingFlowKeys = new Set(
    flows.map((f) => flowKey(f.sourceId, f.targetId, f.date))
  );
  for (const doc of DOCUMENTED_DEALS) {
    if (!byId.has(doc.sourceId) || !byId.has(doc.targetId) || doc.amountUsd <= 0) continue;
    const fKey = flowKey(doc.sourceId, doc.targetId, doc.date);
    if (existingFlowKeys.has(fKey)) continue;

    const source = byId.get(doc.sourceId)!;
    flows.push({
      id: `flow-${++flowSeq}`,
      sourceId: doc.sourceId,
      targetId: doc.targetId,
      amountUsd: doc.amountUsd,
      type: source.sector === "government" ? "grant" : doc.type,
      date: doc.date,
      dealStructure: doc.dealStructure,
      citations: doc.citations,
      verified: true,
      summary: doc.summary,
    });
    existingFlowKeys.add(fKey);
  }

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
