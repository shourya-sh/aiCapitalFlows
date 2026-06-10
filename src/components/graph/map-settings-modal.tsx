"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Database,
  KeyRound,
  Layers,
  Loader2,
  Radio,
  RefreshCw,
  X,
  Zap,
} from "lucide-react";
import {
  COMPLEXITY_PRESETS,
  type MapComplexity,
} from "@/lib/metrics/graph-complexity";
import { cn } from "@/lib/utils";

interface MapSettingsModalProps {
  open: boolean;
  onClose: () => void;
  complexity: MapComplexity;
  onComplexityChange: (value: MapComplexity) => void;
  visibleNodes: number;
  visibleEdges: number;
  totalNodes: number;
  totalEdges: number;
  dataGeneratedAt?: string;
  lastRefresh?: string | null;
  refreshing?: boolean;
  refreshError?: string | null;
  newFlowCount?: number;
  onRefreshData?: () => void;
}

const LIVE_SOURCES = [
  {
    name: "Crunchbase",
    key: "CRUNCHBASE_API_KEY",
    required: true,
    note: "Primary source for funding rounds, investors, and acquisitions. Enterprise API key from crunchbase.com.",
  },
  {
    name: "SEC EDGAR",
    key: "SEC_USER_AGENT",
    required: false,
    note: 'Public filings (10-K, 8-K). Set to "YourName your@email.com" — no paid key, but required by SEC.',
  },
  {
    name: "OECD AI",
    key: "OECD_API_KEY",
    required: false,
    note: "Government AI investment datasets and national program spend.",
  },
  {
    name: "Supabase",
    key: "NEXT_PUBLIC_SUPABASE_URL + keys",
    required: false,
    note: "Optional persistence layer. Without it, data is written to local seed JSON after ingest.",
  },
] as const;

export function MapSettingsModal({
  open,
  onClose,
  complexity,
  onComplexityChange,
  visibleNodes,
  visibleEdges,
  totalNodes,
  totalEdges,
  dataGeneratedAt,
  lastRefresh,
  refreshing,
  refreshError,
  newFlowCount,
  onRefreshData,
}: MapSettingsModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--background-elevated)] shadow-2xl"
          >
            <ModalInner
              complexity={complexity}
              onComplexityChange={onComplexityChange}
              onClose={onClose}
              visibleNodes={visibleNodes}
              visibleEdges={visibleEdges}
              totalNodes={totalNodes}
              totalEdges={totalEdges}
              dataGeneratedAt={dataGeneratedAt}
              lastRefresh={lastRefresh}
              refreshing={refreshing}
              refreshError={refreshError}
              newFlowCount={newFlowCount}
              onRefreshData={onRefreshData}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ModalInner({
  complexity,
  onComplexityChange,
  onClose,
  visibleNodes,
  visibleEdges,
  totalNodes,
  totalEdges,
  dataGeneratedAt,
  lastRefresh,
  refreshing,
  refreshError,
  newFlowCount,
  onRefreshData,
}: Omit<MapSettingsModalProps, "open">) {
  const refreshedLabel = lastRefresh
    ? new Date(lastRefresh).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
    : dataGeneratedAt
      ? new Date(dataGeneratedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
      : null;

  return (
    <div>
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent/25 to-violet-500/15 ring-1 ring-white/10">
            <Layers className="h-4 w-4 text-accent" />
          </div>
          <div>
            <div className="text-sm font-semibold">Map Settings</div>
            <div className="text-[11px] text-muted-2">Complexity & live data</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-white/5 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[min(70vh,560px)] overflow-y-auto p-5">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-2">
              <Zap className="h-3.5 w-3.5" /> Map complexity
            </h3>
            <span className="mono text-[10px] tabular text-muted">
              {visibleNodes}/{totalNodes} nodes · {visibleEdges}/{totalEdges} flows
            </span>
          </div>

          <div className="space-y-2">
            {COMPLEXITY_PRESETS.map((preset) => {
              const active = complexity === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onComplexityChange(preset.id)}
                  className={cn(
                    "group flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                    active
                      ? "border-accent/50 bg-accent/10 ring-1 ring-accent/20"
                      : "border-[var(--border)] bg-white/[0.02] hover:border-[var(--border-strong)] hover:bg-white/[0.04]"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors",
                      active
                        ? "border-accent bg-accent text-[var(--background)]"
                        : "border-[var(--border-strong)] bg-transparent text-transparent group-hover:border-muted"
                    )}
                  >
                    <Check className="h-3 w-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{preset.label}</span>
                      {preset.id === "standard" && (
                        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-accent">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-2">
                      {preset.description}
                      {preset.id !== "complete" && " · Gold edges = always-visible landmark deals"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6 border-t border-[var(--border)] pt-6">
          <h3 className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-2">
            <Radio className="h-3.5 w-3.5" /> Live data
          </h3>

          <div className="rounded-xl border border-[var(--border)] bg-white/[0.02] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs leading-relaxed text-muted">
                  Pull the latest AI funding deals from press releases and RSS feeds. Add{" "}
                  <code className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-foreground">CRUNCHBASE_API_KEY</code>{" "}
                  to also ingest live Crunchbase rounds.
                </p>
                {refreshedLabel && (
                  <p className="mt-2 text-[11px] text-muted-2">
                    Last updated: <span className="text-foreground">{refreshedLabel}</span>
                    {newFlowCount != null && newFlowCount > 0 && (
                      <span className="ml-2 text-accent">+{newFlowCount} new flows</span>
                    )}
                  </p>
                )}
              </div>
              {onRefreshData && (
                <button
                  type="button"
                  onClick={onRefreshData}
                  disabled={refreshing}
                  className="flex shrink-0 items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-3.5 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent/20 disabled:opacity-60"
                >
                  {refreshing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  {refreshing ? "Scanning…" : "Refresh deals"}
                </button>
              )}
            </div>

            {refreshError && (
              <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[11px] text-red-300">
                {refreshError}
              </p>
            )}

            <div className="mt-4 space-y-3">
              {LIVE_SOURCES.map((src) => (
                <div key={src.name} className="flex gap-3">
                  <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/[0.04]">
                    <KeyRound className="h-3.5 w-3.5 text-muted" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium">{src.name}</span>
                      {src.required ? (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-medium text-amber-400">
                          Required for live funding
                        </span>
                      ) : (
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-muted-2">
                          Optional
                        </span>
                      )}
                    </div>
                    <code className="mt-1 block text-[11px] text-accent">{src.key}</code>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-2">{src.note}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-accent/5 px-3 py-2.5">
              <Database className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              <p className="text-[11px] leading-relaxed text-muted">
                <span className="font-medium text-foreground">Minimum to go live:</span>{" "}
                <code className="text-accent">CRUNCHBASE_API_KEY</code> only. SEC and OECD enrich
                government and public-market flows but aren&apos;t required to start.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
