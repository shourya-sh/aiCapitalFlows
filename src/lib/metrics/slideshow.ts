import { verificationStats } from "../data";
import { formatUsd } from "../utils";
import {
  energySpending,
  foundationModelConcentration,
  fundingBySector,
  headlineStats,
  infrastructureSpending,
  investorInfluence,
  sectorMomentum,
} from "./analytics";
import { dataset } from "../data";

export interface SlideBullet {
  text: string;
  emphasis?: string;
}

export interface SlideContent {
  id: string;
  title: string;
  subtitle?: string;
  bullets: SlideBullet[];
  /** Large callout stat */
  stat?: { label: string; value: string };
  /** Secondary stats row */
  stats?: { label: string; value: string }[];
  footnote?: string;
}

/**
 * Builds 7 presentation slides from live dataset metrics + sourced historical context.
 */
export function buildSlideshowSlides(): SlideContent[] {
  const stats = headlineStats();
  const sectors = fundingBySector().slice(0, 5);
  const momentum = sectorMomentum().filter((m) => m.recent > 0).slice(0, 3);
  const hhi = foundationModelConcentration();
  const infra = infrastructureSpending();
  const energy = energySpending();
  const verification = verificationStats();
  const topInvestors = investorInfluence(8).filter((i) => i.id !== "united-states" && i.id !== "gic").slice(0, 5);

  const topRounds = [...dataset.rounds]
    .sort((a, b) => b.amountUsd - a.amountUsd)
    .slice(0, 4)
    .map((r) => {
      const name = dataset.entities.find((e) => e.id === r.targetId)?.name ?? r.targetId;
      return { name, amount: r.amountUsd, type: r.roundType, date: r.date };
    });

  const fastest = momentum[0];

  return [
    {
      id: "overview",
      title: "AI Capital Flow Observatory",
      subtitle: "Investment landscape · 2024 – present",
      stat: { label: "Tracked capital flows in this dataset", value: formatUsd(stats.totalCapital) },
      bullets: [
        { text: `${stats.entityCount} companies, investors, and governments mapped across the AI economy.` },
        { text: `${stats.flowCount} documented capital flows · ${stats.roundCount} funding rounds.` },
        { text: `${verification.pct}% of flows linked to public sources (press, filings, Crunchbase).` },
      ],
      footnote: "All dollar figures on slides 1–4 are computed from the Observatory curated dataset (June 2026).",
    },
    {
      id: "sectors",
      title: "Where capital is going",
      subtitle: "Funding concentration by sector",
      bullets: sectors.map((s) => ({
        text: `${s.label}: ${formatUsd(s.totalFunding)} across ${s.entityCount} entities`,
        emphasis: formatUsd(s.totalFunding),
      })),
      stats: fastest
        ? [
            { label: "Fastest momentum (6 mo.)", value: fastest.label },
            { label: "Change", value: `${fastest.momentum >= 0 ? "+" : ""}${(fastest.momentum * 100).toFixed(0)}%` },
          ]
        : undefined,
      footnote: "Sector totals reflect cumulative funding on entity profiles, not single-year VC reports.",
    },
    {
      id: "mega-deals",
      title: "The mega-deals",
      subtitle: "Largest rounds in the dataset",
      bullets: topRounds.map((r) => ({
        text: `${r.name} — ${r.type} (${r.date.slice(0, 7)}): ${formatUsd(r.amount)}`,
        emphasis: formatUsd(r.amount),
      })),
      stats: stats.largestRound
        ? [{ label: "Largest single round", value: `${stats.largestRound.name} · ${formatUsd(stats.largestRound.amount)}` }]
        : undefined,
      footnote: "Round sizes from company announcements and financial press. See Investment Routes for source links.",
    },
    {
      id: "infrastructure",
      title: "Picks, shovels & power",
      subtitle: "Infrastructure spending in the dataset",
      stat: { label: "Compute & hardware commitments", value: formatUsd(infra) },
      bullets: [
        { text: `${formatUsd(energy)} in long-term power purchase agreements and energy infrastructure.` },
        { text: "GPU supply, neocloud capacity, and hyperscaler capex dominate the value chain." },
        { text: "Energy is the emerging bottleneck — nuclear and renewable deals are accelerating." },
      ],
      stats: [
        { label: "Big-tech + neocloud", value: "CoreWeave, Oracle, Azure, AWS" },
        { label: "Energy players", value: "Oklo, Kairos, Talen, Brookfield" },
      ],
      footnote: "Compare: Amazon, Google, Meta, and Microsoft collectively plan $300B+ in 2025 capex (company guidance, public filings).",
    },
    {
      id: "dot-com",
      title: "AI boom vs. dot-com bubble",
      subtitle: "Historical comparison (sourced benchmarks)",
      bullets: [
        {
          text: "Dot-com peak (2000): U.S. VC hit a record ~$104B deployed; Nasdaq fell ~78% by Oct 2002.",
          emphasis: "~$104B",
        },
        {
          text: "AI era (2024): Private AI funding estimated at $90–100B+ globally in a single year.",
          emphasis: "$90–100B+",
        },
        {
          text: "Today: A handful of foundation-model labs absorb disproportionate capital (OpenAI, Anthropic, xAI).",
        },
        {
          text: "Key difference: Incumbents (Microsoft, Google, Amazon, Nvidia) have cash flow funding the buildout — many dot-com firms did not.",
        },
      ],
      footnote: "Dot-com VC: NVCA/PitchBook historical data. 2024 AI funding: Stanford HAI AI Index / Crunchbase estimates.",
    },
    {
      id: "bubble-signals",
      title: "Bubble signals & counter-signals",
      subtitle: "What to watch",
      bullets: [
        {
          text: `Foundation-model funding HHI: ${hhi.index.toFixed(0)} (${hhi.level}) — top lab holds ~${((hhi.shares[0]?.share ?? 0) * 100).toFixed(0)}% of sector capital.`,
          emphasis: hhi.level,
        },
        {
          text: "Circular deals: hyperscalers invest in model labs that buy compute back from the same hyperscalers.",
        },
        {
          text: "Counter-signal: Real enterprise adoption — cloud AI revenue is growing, not just page views.",
        },
        {
          text: "Counter-signal: Physical constraints (GPUs, power, fabs) slow pure speculation relative to 1999.",
        },
      ],
      stats: topInvestors.slice(0, 3).map((i) => ({
        label: i.name,
        value: formatUsd(i.deployed),
      })),
      footnote: "HHI (Herfindahl-Hirschman Index): 0–10,000 scale; >2,500 = highly concentrated.",
    },
    {
      id: "takeaways",
      title: "Key takeaways",
      subtitle: "Summary",
      bullets: [
        { text: "Capital is real and massive — but increasingly concentrated in fewer names and vertical integrations." },
        { text: "The AI \"bubble\" looks different from dot-com: more capex-heavy, more incumbent-led, slower to unwind." },
        { text: "Infrastructure and energy layers are where secondary investment waves are building." },
        { text: "Verify before you trust: always check source links on deals; unverified flows are flagged in the app." },
        { text: "Watch for: IPO windows (Anthropic, Databricks), sovereign fund entries, and power-contract bottlenecks." },
      ],
      stat: { label: "Entities in network", value: String(stats.entityCount) },
      footnote: "AI Capital Flow Observatory · curated research dataset · not investment advice.",
    },
  ];
}
