"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, LayoutGrid, Layers, Sparkles, X } from "lucide-react";
import { InsightsSlideshow } from "@/components/slideshow/insights-slideshow";
import { NetworkGraph } from "@/components/graph/network-graph";
import { MapSettingsModal } from "@/components/graph/map-settings-modal";
import { WhatsHotGrid } from "@/components/insights/whats-hot";
import { HorizontalBars, MomentumChart } from "@/components/charts/funding-charts";
import {
  DEFAULT_COMPLEXITY,
  type MapComplexity,
} from "@/lib/metrics/graph-complexity";
import type { GraphEdge, GraphNode } from "@/lib/metrics/graph";
import type { Insight } from "@/lib/metrics/insights";
import type { HeadlineStats } from "@/lib/metrics/analytics";
import { formatUsd } from "@/lib/utils";

const COMPLEXITY_STORAGE_KEY = "acf-map-complexity";

interface DashboardProps {
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  stats: HeadlineStats;
  insights: Insight[];
  sectorBars: { label: string; value: number; color: string }[];
  momentum: { label: string; momentum: number; color: string }[];
  verification: { verified: number; total: number; pct: number };
}

function StatChip({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="hidden text-right md:block">
      <div className="text-[9px] uppercase tracking-wider text-muted-2">{label}</div>
      <div className="mono text-sm font-semibold tabular" style={accent ? { color: accent } : undefined}>
        {value}
      </div>
    </div>
  );
}

export function Dashboard({ graphNodes, graphEdges, stats, insights, sectorBars, momentum, verification }: DashboardProps) {
  const [pulseOpen, setPulseOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [complexity, setComplexity] = useState<MapComplexity>(DEFAULT_COMPLEXITY);
  const [graphStats, setGraphStats] = useState({
    visibleNodes: graphNodes.length,
    visibleEdges: graphEdges.length,
    totalNodes: graphNodes.length,
    totalEdges: graphEdges.length,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COMPLEXITY_STORAGE_KEY) as MapComplexity | null;
      if (saved && ["overview", "standard", "detailed", "complete"].includes(saved)) {
        setComplexity(saved);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleComplexityChange = useCallback((value: MapComplexity) => {
    setComplexity(value);
    try {
      localStorage.setItem(COMPLEXITY_STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  }, []);

  const handleGraphStats = useCallback(
    (next: { visibleNodes: number; visibleEdges: number; totalNodes: number; totalEdges: number }) => {
      setGraphStats(next);
    },
    []
  );

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="z-30 flex shrink-0 items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--background-elevated)]/70 px-4 py-2.5 backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="relative grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-accent/30 to-violet-500/20 ring-1 ring-white/10">
            <div className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold tracking-tight">AI Capital Flow Observatory</div>
            <div className="hidden text-[10px] text-muted-2 sm:block">
              Where is AI capital flowing? · {verification.pct}% of flows source-linked
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <StatChip label="Tracked capital" value={formatUsd(stats.totalCapital)} accent="#38bdf8" />
          <StatChip label="Entities" value={String(stats.entityCount)} />
          <StatChip label="Capital flows" value={String(stats.flowCount)} />
          <button
            onClick={() => setSlideshowOpen(true)}
            title="Investment briefing slides"
            className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--border-strong)] bg-white/[0.03] text-muted transition-colors hover:bg-white/[0.07] hover:text-foreground"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--border-strong)] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-white/[0.07]"
          >
            <Layers className="h-3.5 w-3.5 text-accent" />
            <span className="hidden sm:inline">Map Settings</span>
            <span className="sm:hidden">Map</span>
          </button>
          <button
            onClick={() => setPulseOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--border-strong)] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-white/[0.07]"
          >
            <Activity className="h-3.5 w-3.5 text-accent" />
            <span className="hidden sm:inline">Market Pulse</span>
            <span className="sm:hidden">Pulse</span>
          </button>
        </div>
      </header>

      {/* Graph */}
      <div className="relative min-h-0 flex-1">
        <NetworkGraph
          graphNodes={graphNodes}
          graphEdges={graphEdges}
          complexity={complexity}
          onGraphStats={handleGraphStats}
        />
      </div>

      {slideshowOpen && <InsightsSlideshow onClose={() => setSlideshowOpen(false)} />}

      <MapSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        complexity={complexity}
        onComplexityChange={handleComplexityChange}
        visibleNodes={graphStats.visibleNodes}
        visibleEdges={graphStats.visibleEdges}
        totalNodes={graphStats.totalNodes}
        totalEdges={graphStats.totalEdges}
      />

      {/* Market Pulse drawer */}
      <AnimatePresence>
        {pulseOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPulseOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: 460 }}
              animate={{ x: 0 }}
              exit={{ x: 460 }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col border-l border-[var(--border-strong)] bg-[var(--background-elevated)]/95 backdrop-blur-2xl"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-5 py-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4 text-accent" /> Market Pulse
                </div>
                <button
                  onClick={() => setPulseOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-white/5 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5">
                <div className="grid grid-cols-2 gap-2">
                  <PulseStat label="Tracked capital" value={formatUsd(stats.totalCapital)} accent="#38bdf8" />
                  <PulseStat
                    label="Largest round"
                    value={stats.largestRound ? formatUsd(stats.largestRound.amount) : "—"}
                    sub={stats.largestRound?.name}
                    accent="#f5b301"
                  />
                </div>

                <div>
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-2">What&apos;s Hot</h3>
                  <div className="[&_.grid]:!grid-cols-1">
                    <WhatsHotGrid insights={insights} />
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-2">Funding by sector</h3>
                  <HorizontalBars data={sectorBars} height={240} />
                </div>

                <div>
                  <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-2">Sector momentum</h3>
                  <MomentumChart data={momentum} height={240} />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function PulseStat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white/[0.02] p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-2">{label}</div>
      <div className="mono mt-1 text-base font-semibold tabular" style={accent ? { color: accent } : undefined}>
        {value}
      </div>
      {sub && <div className="truncate text-[10px] text-muted-2">{sub}</div>}
    </div>
  );
}
