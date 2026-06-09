import { cache } from "react";
import { Dashboard } from "@/components/dashboard/dashboard";
import { verificationStats } from "@/lib/data/index";
import { buildGraph } from "@/lib/metrics/graph";
import { fundingBySector, headlineStats, sectorMomentum } from "@/lib/metrics/analytics";
import { whatsHot } from "@/lib/metrics/insights";

const getDashboardData = cache(() => {
  const { nodes, edges } = buildGraph();
  const verification = verificationStats();
  return {
    nodes,
    edges,
    stats: headlineStats(),
    insights: whatsHot(),
    sectorBars: fundingBySector().map((s) => ({ label: s.label, value: s.totalFunding, color: s.color })),
    momentum: sectorMomentum().map((m) => ({ label: m.label, momentum: m.momentum, color: m.color })),
    verification,
  };
});

export default function HomePage() {
  const { nodes, edges, stats, insights, sectorBars, momentum, verification } = getDashboardData();

  return (
    <Dashboard
      graphNodes={nodes}
      graphEdges={edges}
      stats={stats}
      insights={insights}
      sectorBars={sectorBars}
      momentum={momentum}
      verification={verification}
    />
  );
}
