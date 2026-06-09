import { verificationStats } from "../data";
import { formatUsd } from "../utils";
import { SECTORS } from "../sectors";
import {
  energySpending,
  foundationModelConcentration,
  fundingBySector,
  governmentInitiatives,
  governmentSpending,
  growthVelocity,
  headlineStats,
  infrastructureSpending,
  investorConcentration,
  investorInfluence,
  sectorMomentum,
} from "./analytics";
import { dataset } from "../data";

export interface SlideBullet {
  text: string;
  emphasis?: string;
}

export interface SlideFinding {
  severity: "info" | "watch" | "critical";
  title: string;
  detail: string;
}

export interface BarChartDatum {
  label: string;
  value: number;
  color: string;
}

export interface TreemapDatum {
  name: string;
  size: number;
  color: string;
  [key: string]: string | number;
}

export interface ComparisonDatum {
  label: string;
  value: number;
  color: string;
  note?: string;
}

export interface GovBarDatum {
  name: string;
  committed: number;
}

export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

export type SlideChart =
  | { type: "bars"; data: BarChartDatum[]; height?: number }
  | { type: "momentum"; data: BarChartDatum[]; height?: number }
  | { type: "growth"; data: { month: string; amount: number; cumulative: number }[]; height?: number }
  | { type: "treemap"; data: TreemapDatum[]; height?: number }
  | { type: "hhi"; index: number; level: string; shares: { name: string; share: number }[] }
  | { type: "comparison"; data: ComparisonDatum[]; height?: number }
  | { type: "gov-bars"; data: GovBarDatum[]; height?: number }
  | { type: "donut"; data: DonutDatum[]; centerLabel?: string; centerValue?: string };

export interface SlideContent {
  id: string;
  title: string;
  subtitle?: string;
  bullets: SlideBullet[];
  findings?: SlideFinding[];
  stat?: { label: string; value: string; accent?: string };
  stats?: { label: string; value: string; accent?: string }[];
  chart?: SlideChart;
  layout?: "default" | "split" | "visual-primary";
  tags?: string[];
  footnote?: string;
}

/**
 * Builds a governance-oriented presentation deck from live dataset metrics.
 * Framed for responsible AI practitioners in consulting and policy roles.
 */
export function buildSlideshowSlides(): SlideContent[] {
  const stats = headlineStats();
  const sectors = fundingBySector().slice(0, 8);
  const momentum = sectorMomentum().filter((m) => m.recent > 0).slice(0, 6);
  const hhi = foundationModelConcentration();
  const investorHhi = investorConcentration();
  const infra = infrastructureSpending();
  const energy = energySpending();
  const govSpend = governmentSpending();
  const govPrograms = governmentInitiatives().slice(0, 8);
  const verification = verificationStats();
  const growth = growthVelocity();
  const topInvestors = investorInfluence(10)
    .filter((i) => i.id !== "united-states" && i.id !== "gic")
    .slice(0, 5);

  const topRounds = [...dataset.rounds]
    .sort((a, b) => b.amountUsd - a.amountUsd)
    .slice(0, 5)
    .map((r) => {
      const name = dataset.entities.find((e) => e.id === r.targetId)?.name ?? r.targetId;
      return { name, amount: r.amountUsd, type: r.roundType, date: r.date };
    });

  const fastest = momentum[0];
  const govEntityCount = dataset.entities.filter((e) => e.sector === "government").length;
  const safetyTagged = dataset.entities.filter((e) => e.tags?.includes("safety")).length;

  const fmTreemap: TreemapDatum[] = hhi.shares.slice(0, 6).map((s) => ({
    name: s.name,
    size: s.value,
    color: SECTORS["foundation-model"].color,
  }));

  return [
    {
      id: "executive",
      title: "AI Capital Observatory",
      subtitle: "Governance briefing for responsible AI practitioners · June 2026",
      stat: {
        label: "Total tracked capital flows",
        value: formatUsd(stats.totalCapital),
        accent: "#38bdf8",
      },
      tags: ["Responsible AI", "Policy", "Market structure"],
      bullets: [
        {
          text: "This deck maps where AI capital is flowing — and what that means for governance, risk assessment, and client advisory work.",
        },
        {
          text: `${stats.entityCount} entities across investors, labs, infrastructure, and ${govEntityCount} sovereign/government programs in the network.`,
        },
        {
          text: `${verification.pct}% of flows are source-linked. Unverified deals are flagged in the Observatory — critical for due diligence and audit trails.`,
        },
        {
          text: "Audience: RAI teams advising boards, regulators, and enterprise buyers on concentration risk, sovereign AI, and systemic dependencies.",
        },
      ],
      findings: [
        {
          severity: "info",
          title: "Why capital maps matter for RAI",
          detail:
            "Investment concentration shapes who can deploy frontier models, what safety budgets exist, and which jurisdictions control compute — all core to governance frameworks.",
        },
      ],
      chart: growth.length > 0 ? { type: "growth", data: growth, height: 160 } : undefined,
      layout: "split",
      footnote: "Curated dataset · not investment advice · verify all figures via source links in the app.",
    },
    {
      id: "sectors",
      title: "Capital allocation by sector",
      subtitle: "Where money flows shapes who governs the stack",
      tags: ["Market structure", "Concentration"],
      bullets: sectors.slice(0, 5).map((s) => ({
        text: `${s.label}: ${formatUsd(s.totalFunding)} across ${s.entityCount} entities — ${((s.totalFunding / sectors.reduce((a, b) => a + b.totalFunding, 0)) * 100).toFixed(0)}% of sector funding.`,
        emphasis: formatUsd(s.totalFunding),
      })),
      findings: [
        {
          severity: "watch",
          title: "Foundation models absorb disproportionate capital",
          detail:
            "A small set of frontier labs receives the majority of private AI funding. This creates single points of failure for safety commitments, model access, and vendor dependency.",
        },
        {
          severity: "info",
          title: "Infrastructure layer is the new chokepoint",
          detail:
            "Compute, energy, and silicon attract secondary waves of capital. Governance teams should map supply-chain dependencies alongside model-level risks.",
        },
      ],
      chart: {
        type: "bars",
        data: sectors.map((s) => ({ label: s.label, value: s.totalFunding, color: s.color })),
        height: 260,
      },
      stats: fastest
        ? [
            { label: "Fastest momentum (6 mo.)", value: fastest.label, accent: fastest.color },
            {
              label: "Capital change",
              value: `${fastest.momentum >= 0 ? "+" : ""}${(fastest.momentum * 100).toFixed(0)}%`,
              accent: fastest.momentum >= 0 ? "#34d399" : "#fb7185",
            },
          ]
        : undefined,
      layout: "split",
      footnote: "Sector totals reflect cumulative funding on entity profiles, not single-year VC reports.",
    },
    {
      id: "concentration",
      title: "Foundation-model concentration",
      subtitle: "Systemic risk metrics for frontier AI governance",
      tags: ["HHI", "Systemic risk", "Competition"],
      stat: {
        label: "Herfindahl-Hirschman Index",
        value: hhi.index.toFixed(0),
        accent: hhi.index > 2500 ? "#fb7185" : "#f5b301",
      },
      bullets: [
        {
          text: `Market classification: ${hhi.level} (HHI >2,500 = highly concentrated per DOJ/FTC thresholds).`,
          emphasis: hhi.level,
        },
        {
          text: `Top lab — ${hhi.shares[0]?.name ?? "N/A"} — holds ~${((hhi.shares[0]?.share ?? 0) * 100).toFixed(0)}% of foundation-model capital in this dataset.`,
        },
        {
          text: "Circular capital flows: hyperscalers invest in model labs that purchase compute from the same hyperscalers — blurring competition and dependency lines.",
        },
        {
          text: `Investor-side HHI: ${investorHhi.index.toFixed(0)} (${investorHhi.level}) — capital deployment itself is ${investorHhi.level.toLowerCase()}.`,
        },
      ],
      findings: [
        {
          severity: "critical",
          title: "Governance implication",
          detail:
            "High concentration means a handful of actors set de facto safety standards, pricing, and access terms. Client RAI programs must account for vendor lock-in and limited audit rights.",
        },
        {
          severity: "watch",
          title: "Competition & antitrust lens",
          detail:
            "Regulators in the EU, UK, and US are scrutinizing vertical integration (Microsoft–OpenAI, Amazon–Anthropic). Capital maps support competition assessments.",
        },
      ],
      chart: {
        type: "hhi",
        index: hhi.index,
        level: hhi.level,
        shares: hhi.shares.slice(0, 5).map((s) => ({ name: s.name, share: s.share })),
      },
      layout: "split",
      footnote: "HHI: sum of squared market shares (0–10,000). Applied here to foundation-model funding shares.",
    },
    {
      id: "sovereign",
      title: "Sovereign AI & policy capital",
      subtitle: "Government programs reshaping the global AI landscape",
      tags: ["Sovereign AI", "Policy", "Geopolitics"],
      stat: {
        label: "Government-originated capital flows",
        value: formatUsd(govSpend),
        accent: SECTORS.government.color,
      },
      bullets: govPrograms.slice(0, 4).map((g) => ({
        text: `${g.name}: ${formatUsd(g.committed)} committed across ${g.targets} target entities.`,
        emphasis: formatUsd(g.committed),
      })),
      findings: [
        {
          severity: "info",
          title: "Sovereign AI is a governance priority",
          detail:
            "US CHIPS Act grants, EU AI innovation funding, Gulf sovereign compute (G42, HUMAIN), and national champions (Mistral, Cohere) reflect a shift from pure market allocation to industrial policy.",
        },
        {
          severity: "watch",
          title: "Cross-border data & model governance",
          detail:
            "Sovereign compute clusters raise questions about data residency, export controls, and whether safety evaluations can be conducted independently of host governments.",
        },
        {
          severity: "info",
          title: "EU AI Act alignment",
          detail:
            "European programs (France, Germany, EU-wide grants to Mistral, ASML) intersect directly with high-risk system obligations — relevant for client compliance roadmaps.",
        },
      ],
      chart: {
        type: "gov-bars",
        data: govPrograms.map((g) => ({ name: g.name, committed: g.committed })),
        height: 240,
      },
      layout: "split",
      footnote: "Includes grants, sovereign partnerships, and national AI strategy allocations in the dataset.",
    },
    {
      id: "mega-deals",
      title: "Mega-deals & market structure",
      subtitle: "Largest rounds signal power consolidation",
      tags: ["Deal flow", "Due diligence"],
      bullets: topRounds.map((r) => ({
        text: `${r.name} — ${r.type} (${r.date.slice(0, 7)}): ${formatUsd(r.amount)}`,
        emphasis: formatUsd(r.amount),
      })),
      findings: [
        {
          severity: "watch",
          title: "Round size outpaces revenue at frontier labs",
          detail:
            "Multi-billion raises at pre-profit labs create pressure for rapid deployment — a tension RAI teams should surface in client risk registers and board materials.",
        },
        {
          severity: "info",
          title: "Source verification is non-negotiable",
          detail:
            "Mega-deal announcements often precede finalized terms. The Observatory links to press, filings, and databases — use these for audit-ready diligence.",
        },
      ],
      chart: {
        type: "bars",
        data: topRounds.map((r, i) => ({
          label: r.name.length > 18 ? r.name.slice(0, 16) + "…" : r.name,
          value: r.amount,
          color: ["#8b5cf6", "#6366f1", "#38bdf8", "#22d3ee", "#2dd4bf"][i] ?? "#8b5cf6",
        })),
        height: 220,
      },
      stats: stats.largestRound
        ? [{ label: "Largest round", value: `${stats.largestRound.name} · ${formatUsd(stats.largestRound.amount)}` }]
        : undefined,
      layout: "split",
      footnote: "Round sizes from company announcements and financial press. See Investment Routes for source links.",
    },
    {
      id: "infrastructure",
      title: "Compute, energy & physical constraints",
      subtitle: "Infrastructure dependencies for responsible deployment",
      tags: ["Supply chain", "Energy", "Sustainability"],
      stat: {
        label: "Compute & hardware commitments",
        value: formatUsd(infra),
        accent: SECTORS.compute.color,
      },
      bullets: [
        {
          text: `${formatUsd(energy)} in long-term power purchase agreements and energy infrastructure — datacenter power is now a board-level governance topic.`,
        },
        {
          text: "GPU supply (Nvidia H100/B200), neocloud capacity (CoreWeave, Lambda), and hyperscaler capex form a vertically integrated stack.",
        },
        {
          text: "Amazon, Google, Meta, and Microsoft collectively plan $300B+ in 2025 capex — mostly AI-driven (public company guidance).",
        },
        {
          text: "Nuclear and renewable PPAs (Oklo, Kairos, Talen, Brookfield) reflect energy as the binding constraint on AI scale.",
        },
      ],
      findings: [
        {
          severity: "watch",
          title: "Environmental governance",
          detail:
            "Scope 2/3 emissions from AI training and inference are increasingly material for ESG reporting. Energy PPAs and datacenter location choices are auditable governance levers.",
        },
        {
          severity: "critical",
          title: "Single-vendor compute risk",
          detail:
            "Nvidia's dominance in AI accelerators creates export-control and supply disruption exposure — relevant for national security and continuity planning.",
        },
      ],
      chart: {
        type: "comparison",
        data: [
          { label: "Compute / hardware", value: infra, color: SECTORS.compute.color },
          { label: "Energy contracts", value: energy, color: SECTORS.energy.color },
          { label: "Foundation models", value: sectors.find((s) => s.sector === "foundation-model")?.totalFunding ?? 0, color: SECTORS["foundation-model"].color },
        ],
        height: 180,
      },
      layout: "split",
      footnote: "Hyperscaler capex: aggregated from public 2025 guidance (10-K, earnings calls).",
    },
    {
      id: "momentum",
      title: "Capital velocity & emerging sectors",
      subtitle: "Where the next governance questions will arise",
      tags: ["Trends", "Agentic AI", "Robotics"],
      bullets: momentum.slice(0, 4).map((m) => ({
        text: `${m.label}: ${formatUsd(m.recent)} in last 6 months (${m.momentum >= 0 ? "+" : ""}${(m.momentum * 100).toFixed(0)}% vs prior period).`,
        emphasis: formatUsd(m.recent),
      })),
      findings: [
        {
          severity: "watch",
          title: "Agent infrastructure is accelerating",
          detail:
            "Orchestration, retrieval, and agent tooling are receiving rapid capital inflows — these layers sit closest to enterprise deployment and require new guardrail frameworks.",
        },
        {
          severity: "info",
          title: "Robotics & embodied AI",
          detail:
            "Humanoid and manipulation startups attract defense-adjacent and industrial capital. Physical-world AI raises distinct safety, liability, and human oversight questions.",
        },
      ],
      chart: {
        type: "momentum",
        data: momentum.map((m) => ({
          label: m.label,
          value: m.momentum,
          color: m.momentum >= 0 ? "#34d399" : "#fb7185",
        })),
        height: 240,
      },
      layout: "split",
      footnote: "Momentum = (last 6 months − prior 6 months) / prior 6 months, by recipient sector.",
    },
    {
      id: "dot-com",
      title: "AI cycle vs. dot-com benchmark",
      subtitle: "Historical context for governance risk framing",
      tags: ["Macro", "Risk assessment"],
      bullets: [
        {
          text: "Dot-com peak (2000): U.S. VC deployed ~$104B; Nasdaq fell ~78% by Oct 2002. Many firms lacked revenue or viable business models.",
          emphasis: "~$104B",
        },
        {
          text: "AI era (2024): Global private AI funding estimated at $90–100B+ in a single year (Stanford HAI / Crunchbase).",
          emphasis: "$90–100B+",
        },
        {
          text: "Key structural difference: Incumbents (Microsoft, Google, Amazon, Nvidia) fund the buildout from operating cash flow — not venture hype alone.",
        },
        {
          text: "Counter-signal: Physical constraints (GPUs, power, fabs) slow pure speculation relative to 1999's bandwidth-overbuild.",
        },
      ],
      findings: [
        {
          severity: "info",
          title: "Different bubble, different governance risks",
          detail:
            "The AI cycle is capex-heavy and incumbent-led. Governance focus shifts from 'will they survive?' to 'what power do survivors wield?' — concentration, access, and safety commitments.",
        },
      ],
      chart: {
        type: "comparison",
        data: [
          { label: "Dot-com VC peak (2000)", value: 104_000_000_000, color: "#fb7185", note: "Nasdaq −78%" },
          { label: "Global AI funding (2024 est.)", value: 95_000_000_000, color: "#38bdf8", note: "Single year" },
          { label: "Hyperscaler 2025 capex", value: 300_000_000_000, color: "#6366f1", note: "Operating cash flow" },
        ],
        height: 200,
      },
      layout: "split",
      footnote: "Dot-com: NVCA/PitchBook. 2024 AI funding: Stanford HAI AI Index. Capex: company guidance.",
    },
    {
      id: "signals",
      title: "Governance signals & counter-signals",
      subtitle: "What to monitor in client engagements",
      tags: ["Risk signals", "Verification"],
      bullets: [
        {
          text: `Source verification: ${verification.verified} of ${verification.total} flows (${verification.pct}%) linked to public sources — unverified flows flagged in-app.`,
        },
        {
          text: "Circular deal structures: hyperscaler ↔ lab ↔ compute loops create conflicts of interest for independent safety evaluation.",
        },
        {
          text: `Safety-tagged entities in dataset: ${safetyTagged} — safety-focused capital remains a small fraction of total frontier investment.`,
        },
        {
          text: "Counter-signal: Enterprise AI revenue is growing (cloud AI services), not just page views — real adoption underpins some valuations.",
        },
      ],
      findings: [
        {
          severity: "critical",
          title: "Safety investment gap",
          detail:
            "Capital flows overwhelmingly toward scale and capability, not safety research or red-teaming infrastructure. RAI teams should quantify this gap in client assessments.",
        },
        {
          severity: "watch",
          title: "Top capital deployers",
          detail: `${topInvestors.slice(0, 3).map((i) => i.name).join(", ")} lead deployment — their portfolio choices shape the AI ecosystem clients inherit.`,
        },
      ],
      chart: {
        type: "donut",
        data: [
          { label: "Verified flows", value: verification.verified, color: "#34d399" },
          { label: "Unverified flows", value: verification.total - verification.verified, color: "#5d6877" },
        ],
        centerLabel: "Source-linked",
        centerValue: `${verification.pct}%`,
      },
      stats: topInvestors.slice(0, 3).map((i) => ({
        label: i.name,
        value: formatUsd(i.deployed),
      })),
      layout: "split",
      footnote: "Verification = flow has at least one linked public source (press, filing, database).",
    },
    {
      id: "implications",
      title: "Implications for RAI practitioners",
      subtitle: "Actionable findings for consulting engagements",
      tags: ["Client advisory", "Framework"],
      bullets: [
        {
          text: "Map capital concentration in client vendor portfolios — HHI-style metrics apply to procurement risk, not just antitrust.",
        },
        {
          text: "Track sovereign AI programs in jurisdictions where clients operate — data residency and model hosting choices follow policy capital.",
        },
        {
          text: "Audit mega-deal claims against source links before citing in board decks or regulatory submissions.",
        },
        {
          text: "Include infrastructure and energy dependencies in AI risk registers — compute and power are governance surfaces, not just IT.",
        },
        {
          text: "Monitor agent-infra and robotics capital inflows — these sectors will drive the next wave of deployment governance questions.",
        },
      ],
      findings: [
        {
          severity: "info",
          title: "Suggested client deliverables",
          detail:
            "Capital concentration report · Sovereign AI exposure map · Vendor dependency matrix · Source-verified deal timeline · Energy/ESG footprint assessment.",
        },
        {
          severity: "watch",
          title: "Regulatory watchlist",
          detail:
            "EU AI Act high-risk obligations · US EO 14110 follow-ons · UK AISI evaluations · OECD AI principles alignment · NIST AI RMF mapping.",
        },
      ],
      stat: { label: "Entities in network", value: String(stats.entityCount), accent: "#38bdf8" },
      layout: "default",
      footnote: "Framework references are illustrative — align to client jurisdiction and sector.",
    },
    {
      id: "takeaways",
      title: "Key takeaways",
      subtitle: "Summary for stakeholder presentations",
      tags: ["Summary"],
      bullets: [
        {
          text: "AI capital is real, massive, and increasingly concentrated — governance must address market power, not just model behavior.",
        },
        {
          text: "Sovereign AI programs are reshaping where models are trained, hosted, and governed — geopolitics is a RAI variable.",
        },
        {
          text: "Infrastructure and energy layers are the emerging chokepoints — supply-chain governance is as critical as algorithmic fairness.",
        },
        {
          text: "Safety-focused investment remains dwarfed by scale capital — quantify the gap in client risk assessments.",
        },
        {
          text: "Always verify: use source-linked flows in the Observatory for audit-ready diligence.",
        },
        {
          text: "Watch: IPO windows (Anthropic, Databricks), export controls on chips, and power-contract bottlenecks.",
        },
      ],
      stat: {
        label: "Tracked capital in dataset",
        value: formatUsd(stats.totalCapital),
        accent: "#38bdf8",
      },
      chart: fmTreemap.length > 0 ? { type: "treemap", data: fmTreemap, height: 140 } : undefined,
      layout: "split",
      footnote: "AI Capital Flow Observatory · curated research dataset · not investment advice.",
    },
  ];
}
