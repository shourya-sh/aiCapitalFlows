"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Calendar,
  ChevronDown,
  ExternalLink,
  MapPin,
  Newspaper,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AXIS_STYLE, ChartTooltip, GRID_COLOR } from "@/components/charts/primitives";
import { EntityLogo } from "./entity-logo";
import type { CapitalMovement, EntityDetail } from "@/lib/data/detail";
import { logoFor } from "@/lib/data/logos";
import { rationaleFor } from "@/lib/metrics/rationale";
import { generateNewsForEntity, relativeTime, type NewsItem } from "@/lib/data/news";
import { OwnershipChart } from "./ownership-chart";
import type { SourceCitation } from "@/lib/types";
import { formatCompact, formatDate, formatMonth, formatUsd } from "@/lib/utils";

function DealLabelChip({ movement: m }: { movement: CapitalMovement }) {
  const isRound = Boolean(m.roundType);
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <span
        className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
          isRound ? "bg-positive/15 text-positive" : "bg-accent/15 text-accent"
        }`}
      >
        {m.dealLabel}
      </span>
      <span className="text-[10px] text-muted-2">{m.dealStructure}</span>
    </span>
  );
}

function CounterpartyRow({
  id,
  name,
  color,
  amount,
  meta,
  onSelect,
  trailing,
}: {
  id: string;
  name: string;
  color: string;
  amount?: number;
  meta?: string;
  onSelect: (id: string) => void;
  trailing?: React.ReactNode;
}) {
  const logo = logoFor(id);
  return (
    <button
      onClick={() => onSelect(id)}
      className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/[0.05]"
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <EntityLogo name={name} color={color} primary={logo.primary} fallback={logo.fallback} size={26} />
        <span className="min-w-0">
          <span className="block truncate text-xs font-medium">{name}</span>
          {meta && <span className="block truncate text-[10px] text-muted-2">{meta}</span>}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {amount !== undefined && <span className="mono text-xs text-muted tabular">{formatUsd(amount)}</span>}
        {trailing}
      </span>
    </button>
  );
}

type Tab = "overview" | "ownership" | "investments" | "movements";

export function CopilotPanel({
  detail,
  onSelect,
  onClose,
}: {
  detail: EntityDetail;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const { entity, sectorColor, sectorLabel, fundingHistory, investors, portfolio, rounds, movements, ownership } = detail;
  const isFunder = entity.sector === "investor" || entity.sector === "government";
  const [tab, setTab] = useState<Tab>("overview");
  const news = useMemo(() => generateNewsForEntity(detail), [detail]);
  const logo = logoFor(entity.id);

  const inflows = movements.filter((m) => m.direction === "in");
  const outflows = movements.filter((m) => m.direction === "out");

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="relative shrink-0 border-b border-[var(--border)] p-5">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-25 blur-2xl"
          style={{ background: `radial-gradient(60% 100% at 50% 0, ${sectorColor}, transparent)` }}
        />
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-white/5 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="relative flex items-start gap-3">
          <EntityLogo name={entity.name} color={sectorColor} primary={logo.primary} fallback={logo.fallback} size={52} />
          <div className="min-w-0 pr-8">
            <h2 className="truncate text-lg font-semibold tracking-tight">{entity.name}</h2>
            <Badge color={sectorColor} className="mt-1">{sectorLabel}</Badge>
            <DataQualityBadge quality={entity.dataQuality} />
          </div>
        </div>
        <div className="relative mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-2">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {entity.headquarters}</span>
          {entity.founded && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {entity.founded}</span>}
          <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {entity.country}</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Stat chips */}
        <div className="grid grid-cols-3 gap-px border-b border-[var(--border)] bg-[var(--border)]">
          <Stat label="Raised" value={formatUsd(entity.totalFundingUsd)} />
          <Stat label={entity.marketCapUsd ? "Market cap" : "Valuation"} value={formatUsd(entity.marketCapUsd ?? entity.latestValuationUsd)} />
          <Stat label={isFunder ? "Deployed" : "Revenue"} value={formatUsd(isFunder ? detail.totalOutflow : entity.revenueUsd)} />
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-10 flex gap-1 border-b border-[var(--border)] bg-[var(--background-elevated)]/90 px-3 py-2 backdrop-blur-xl">
          {([
            ["overview", "Overview"],
            ...(ownership ? [["ownership", "Ownership"] as [Tab, string]] : []),
            ["investments", isFunder ? "Portfolio" : "Investments"],
            ["movements", `Routes · ${movements.length}`],
          ] as [Tab, string][]).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === t ? "bg-white/[0.07] text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === "overview" && (
            <div className="space-y-5">
              <p className="text-sm leading-relaxed text-muted">{entity.description}</p>

              {(entity.users || entity.enterpriseCustomers) && (
                <div className="flex gap-2">
                  {entity.users ? <MiniStat label="Users" value={formatCompact(entity.users)} /> : null}
                  {entity.enterpriseCustomers ? <MiniStat label="Enterprise customers" value={formatCompact(entity.enterpriseCustomers)} /> : null}
                </div>
              )}

              {entity.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {entity.tags.map((t) => (
                    <span key={t} className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] text-muted">{t}</span>
                  ))}
                </div>
              )}

              {fundingHistory.length > 1 && (
                <div>
                  <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-2">Funding history</div>
                  <ResponsiveContainer width="100%" height={150}>
                    <AreaChart data={fundingHistory} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
                      <defs>
                        <linearGradient id="copilotGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={sectorColor} stopOpacity={0.4} />
                          <stop offset="100%" stopColor={sectorColor} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke={GRID_COLOR} />
                      <XAxis dataKey="date" tick={AXIS_STYLE} tickFormatter={formatMonth} axisLine={false} tickLine={false} minTickGap={30} />
                      <YAxis tick={AXIS_STYLE} tickFormatter={(v) => formatUsd(v)} axisLine={false} tickLine={false} width={46} />
                      <Tooltip content={<ChartTooltip labelFormatter={(l) => formatDate(String(l))} />} />
                      <Area type="monotone" dataKey="cumulative" name="Cumulative raised" stroke={sectorColor} strokeWidth={2} fill="url(#copilotGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Latest Updates Feed */}
              {news.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-2">
                    <Newspaper className="h-3.5 w-3.5" /> Latest Updates
                  </div>
                  <div className="space-y-0.5">
                    {news.map((item) => (
                      <FeedItem key={item.id} item={item} sectorColor={sectorColor} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "ownership" && ownership && (
            <div className="space-y-5">
              <OwnershipChart snapshot={ownership} />
              <SourceList title="Ownership sources" citations={ownership.citations} />
            </div>
          )}

          {tab === "investments" && (
            <div className="space-y-5">
              {isFunder ? (
                <Section title={`Portfolio · ${portfolio.length}`}>
                  {portfolio.map((p) => (
                    <CounterpartyRow key={p.id} id={p.id} name={p.name} color={detail.sectorColor} amount={p.amount} meta={p.sector} onSelect={onSelect} />
                  ))}
                </Section>
              ) : (
                <>
                  <Section title={`Backed by · ${investors.length}`}>
                    {investors.map((inv) => (
                      <CounterpartyRow key={inv.id} id={inv.id} name={inv.name} color="#f5b301" amount={inv.amount} meta={inv.sector} onSelect={onSelect} />
                    ))}
                  </Section>
                  {rounds.length > 0 && (
                    <Section title={`Funding rounds · ${rounds.length}`}>
                      {rounds.slice().reverse().map((r) => (
                        <div key={r.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-white/[0.02] px-3 py-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="rounded-md bg-positive/15 px-1.5 py-0.5 text-[10px] font-semibold text-positive">
                                {r.roundType}
                              </span>
                              <span className="text-[10px] text-muted-2">Priced equity</span>
                            </div>
                            <div className="mt-0.5 text-[10px] text-muted-2">
                              {formatDate(r.date)} · Cash → Equity stake
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="mono text-xs font-semibold tabular">{formatUsd(r.amountUsd)}</div>
                            {r.valuationUsd ? <div className="text-[10px] text-muted-2">{formatUsd(r.valuationUsd)} val.</div> : null}
                          </div>
                        </div>
                      ))}
                    </Section>
                  )}
                  {portfolio.length > 0 && (
                    <Section title={`Strategic investments · ${portfolio.length}`}>
                      {portfolio.map((p) => (
                        <CounterpartyRow key={p.id} id={p.id} name={p.name} color={detail.sectorColor} amount={p.amount} meta={p.sector} onSelect={onSelect} />
                      ))}
                    </Section>
                  )}
                </>
              )}
            </div>
          )}

          {tab === "movements" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-[var(--border)] bg-positive/5 p-3">
                  <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-2">
                    <ArrowDownLeft className="h-3 w-3 text-positive" /> Inflow
                  </div>
                  <div className="mono mt-1 text-sm font-semibold tabular text-positive">{formatUsd(detail.totalInflow)}</div>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-accent/5 p-3">
                  <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-2">
                    <ArrowUpRight className="h-3 w-3 text-accent" /> Outflow
                  </div>
                  <div className="mono mt-1 text-sm font-semibold tabular text-accent">{formatUsd(detail.totalOutflow)}</div>
                </div>
              </div>
              <Section title={`All investment routes · ${movements.length}`}>
                {movements.map((m) => (
                  <MovementRow key={m.id} m={m} selfId={entity.id} onSelect={onSelect} />
                ))}
              </Section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MovementRow({
  m,
  selfId,
  onSelect,
}: {
  m: CapitalMovement;
  selfId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const logo = logoFor(m.counterpartyId);
  const inbound = m.direction === "in";
  const sourceId = inbound ? m.counterpartyId : selfId;
  const targetId = inbound ? selfId : m.counterpartyId;
  const rationale = useMemo(
    () =>
      open
        ? rationaleFor(sourceId, targetId, m.type, m.amount, {
            dealLabel: m.dealLabel,
            dealExchange: m.dealExchange,
            roundType: m.roundType,
            structureKind: m.structureKind,
            verified: m.verified,
            verifiedSummary: m.summary,
            citations: m.citations,
          })
        : null,
    [open, sourceId, targetId, m]
  );

  return (
    <div className="rounded-lg border border-transparent transition-colors data-[open=true]:border-[var(--border)] data-[open=true]:bg-white/[0.02]" data-open={open}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/[0.05]"
      >
        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md ${inbound ? "bg-positive/10 text-positive" : "bg-accent/10 text-accent"}`}>
          {inbound ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
        </span>
        <EntityLogo name={m.counterpartyName} color={m.counterpartyColor} primary={logo.primary} fallback={logo.fallback} size={24} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-medium">{m.counterpartyName}</span>
          <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-muted-2">
            <DealLabelChip movement={m} />
            <span>· {formatDate(m.date)}</span>
          </span>
        </span>
        <span className="mono shrink-0 text-xs font-semibold tabular" style={{ color: inbound ? "var(--positive)" : "var(--accent)" }}>
          {inbound ? "+" : "−"}{formatUsd(m.amount)}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-muted-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && rationale && (
        <div className="space-y-2.5 px-3 pb-3 pt-1">
          <div className="flex items-center gap-2 text-[10px] text-muted-2">
            <span className="font-medium" style={{ color: m.counterpartyColor }}>
              {inbound ? m.counterpartyName : "This entity"}
            </span>
            <ArrowRight className="h-3 w-3" />
            <span className="font-medium">{inbound ? "This entity" : m.counterpartyName}</span>
            <Badge color={m.counterpartyColor} className="ml-auto">{rationale.category}</Badge>
          </div>
          <div className="rounded-md border border-[var(--border)] bg-white/[0.02] px-2.5 py-1.5 text-[10px] text-muted">
            <span className="font-medium text-foreground/80">Exchange: </span>
            {m.dealExchange}
          </div>
          <p className="text-xs leading-relaxed text-foreground/90">{rationale.summary}</p>
          {rationale.verified ? (
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Verified against public sources
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-amber-400/90">
              <ShieldAlert className="h-3.5 w-3.5" /> Unverified — add CRUNCHBASE_API_KEY and run ingest for live data
            </div>
          )}
          {rationale.citations && rationale.citations.length > 0 && (
            <SourceList title="Sources" citations={rationale.citations} />
          )}
          <div className="grid gap-2 sm:grid-cols-2">
            <RationaleBox label="What the funder gains" text={rationale.sourceGain} tone="accent" />
            <RationaleBox label="What the recipient gains" text={rationale.targetGain} tone="positive" />
          </div>
          <button
            onClick={() => onSelect(m.counterpartyId)}
            className="flex items-center gap-1 text-[11px] font-medium text-accent hover:underline"
          >
            Open {m.counterpartyName} <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

function DataQualityBadge({ quality }: { quality?: string }) {
  if (!quality || quality === "verified") {
    return (
      <span className="ml-2 inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400">
        <ShieldCheck className="h-3 w-3" /> Sourced
      </span>
    );
  }
  if (quality === "partial") {
    return (
      <span className="ml-2 inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-amber-400">
        <ShieldAlert className="h-3 w-3" /> Partial
      </span>
    );
  }
  return (
    <span className="ml-2 inline-flex items-center gap-1 rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[9px] font-semibold text-muted-2">
      <ShieldAlert className="h-3 w-3" /> Needs source
    </span>
  );
}

function SourceList({ title, citations }: { title: string; citations: SourceCitation[] }) {
  return (
    <div>
      <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-2">{title}</div>
      <div className="space-y-2">
        {citations.map((c) => (
          <a
            key={c.id}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-2 rounded-lg border border-[var(--border)] bg-white/[0.02] px-3 py-2 transition-colors hover:border-accent/30 hover:bg-white/[0.04]"
          >
            <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-2 group-hover:text-accent" />
            <span className="min-w-0">
              <span className="block text-xs font-medium leading-snug text-foreground/90 group-hover:text-accent">
                {c.title}
              </span>
              <span className="mt-0.5 block text-[10px] text-muted-2">
                {c.publisher}
                {c.publishedAt ? ` · ${formatDate(c.publishedAt)}` : ""}
              </span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function RationaleBox({ label, text, tone }: { label: string; text: string; tone: "accent" | "positive" }) {
  const color = tone === "accent" ? "var(--accent)" : "var(--positive)";
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white/[0.02] p-2.5">
      <div className="mb-1 text-[9px] font-medium uppercase tracking-wider" style={{ color }}>
        {label}
      </div>
      <p className="text-[11px] leading-relaxed text-muted">{text}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--background-elevated)] p-4 text-center">
      <div className="text-[10px] uppercase tracking-wider text-muted-2">{label}</div>
      <div className="mono mt-1 text-sm font-semibold tabular">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 rounded-xl border border-[var(--border)] bg-white/[0.02] p-3">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-2">
        <TrendingUp className="h-3 w-3" /> {label}
      </div>
      <div className="mono mt-1 text-sm font-semibold tabular">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-2">{title}</div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

const TAG_COLORS: Record<NewsItem["tagColor"], string> = {
  green: "bg-emerald-500/15 text-emerald-400",
  blue: "bg-blue-500/15 text-blue-400",
  yellow: "bg-amber-500/15 text-amber-400",
  purple: "bg-violet-500/15 text-violet-400",
  red: "bg-rose-500/15 text-rose-400",
  cyan: "bg-cyan-500/15 text-cyan-400",
};

function FeedItem({ item, sectorColor }: { item: NewsItem; sectorColor: string }) {
  const body = (
    <>
      <div
        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: sectorColor }}
      />
      <div className="min-w-0 flex-1">
        <p
          className={`text-[13px] font-medium leading-snug text-foreground/90 ${
            item.url ? "group-hover:text-accent group-hover:underline" : ""
          }`}
        >
          {item.headline}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${TAG_COLORS[item.tagColor]}`}>
            {item.tag}
          </span>
          <span className="text-[10px] text-muted-2">{item.source}</span>
          <span className="text-[10px] text-muted-2">·</span>
          <span className="text-[10px] text-muted-2">{relativeTime(item.date)}</span>
          {item.url ? (
            <ExternalLink className="ml-auto h-3 w-3 text-muted-2 opacity-0 transition-opacity group-hover:text-accent group-hover:opacity-100" />
          ) : null}
        </div>
      </div>
    </>
  );

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.03]"
      >
        <div className="flex items-start gap-2.5">{body}</div>
      </a>
    );
  }

  return (
    <div className="group rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.03]">
      <div className="flex items-start gap-2.5">{body}</div>
    </div>
  );
}
