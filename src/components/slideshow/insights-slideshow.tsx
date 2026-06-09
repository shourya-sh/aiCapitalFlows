"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Info,
  Shield,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  GrowthChart,
  HorizontalBars,
  MomentumChart,
  ShareTreemap,
} from "@/components/charts/funding-charts";
import { AXIS_STYLE, ChartTooltip } from "@/components/charts/primitives";
import {
  buildSlideshowSlides,
  type SlideChart,
  type SlideContent,
  type SlideFinding,
} from "@/lib/metrics/slideshow";
import { formatUsd } from "@/lib/utils";

interface InsightsSlideshowProps {
  onClose: () => void;
}

const SEVERITY_STYLES: Record<
  SlideFinding["severity"],
  { border: string; bg: string; icon: typeof Info }
> = {
  info: { border: "border-[#38bdf8]/30", bg: "bg-[#38bdf8]/8", icon: Info },
  watch: { border: "border-[#f5b301]/30", bg: "bg-[#f5b301]/8", icon: AlertTriangle },
  critical: { border: "border-[#fb7185]/30", bg: "bg-[#fb7185]/8", icon: Shield },
};

export function InsightsSlideshow({ onClose }: InsightsSlideshowProps) {
  const slides = buildSlideshowSlides();
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => Math.max(0, Math.min(slides.length - 1, i + delta)));
    },
    [slides.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const slide = slides[index];

  return (
    <div className="slide-deck fixed inset-0 z-[60] flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Ambient grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(56,189,248,0.12), transparent), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(139,92,246,0.08), transparent)",
        }}
      />

      {/* Top bar */}
      <div className="relative flex shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--background-elevated)]/90 px-5 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#38bdf8]/15">
            <Shield className="h-3.5 w-3.5 text-[#38bdf8]" />
          </div>
          <div>
            <span className="text-xs font-semibold tracking-wide text-[var(--foreground)]">
              AI Capital Observatory
            </span>
            <span className="ml-2 text-[10px] text-[var(--muted)]">
              Governance Briefing
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-white/[0.08]"
        >
          <X className="h-3.5 w-3.5" />
          Back to map
        </button>
      </div>

      {/* Slide area */}
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center p-4 sm:p-8">
        <div className="glass-strong flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[var(--border-strong)] shadow-2xl">
          <SlideView slide={slide} index={index} total={slides.length} />
        </div>
      </div>

      {/* Navigation */}
      <div className="relative flex shrink-0 items-center justify-between border-t border-[var(--border)] bg-[var(--background-elevated)]/90 px-5 py-3 backdrop-blur-md">
        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          className="flex items-center gap-1 rounded-lg border border-[var(--border-strong)] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-white/[0.08] disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-[#38bdf8]"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Slide ${i + 1}: ${s.title}`}
            />
          ))}
          <span className="ml-3 mono text-xs tabular text-[var(--muted)]">
            {index + 1} / {slides.length}
          </span>
        </div>

        <button
          onClick={() => go(1)}
          disabled={index === slides.length - 1}
          className="flex items-center gap-1 rounded-lg border border-[var(--border-strong)] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-white/[0.08] disabled:opacity-30"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SlideView({
  slide,
  index,
  total,
}: {
  slide: SlideContent;
  index: number;
  total: number;
}) {
  const isSplit = slide.layout === "split" && slide.chart;

  return (
    <div className="flex h-full min-h-[480px] flex-col p-6 sm:p-8 lg:p-10">
      {/* Tags */}
      {slide.tags && slide.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {slide.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--border)] bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <div className="mb-5 border-l-2 border-[#38bdf8] pl-4">
        <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl lg:text-3xl">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p className="mt-1 text-sm text-[var(--muted)]">{slide.subtitle}</p>
        )}
      </div>

      {/* Main stat */}
      {slide.stat && (
        <div className="mb-5 inline-flex w-fit flex-col rounded-xl border border-[var(--border)] bg-white/[0.03] px-5 py-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-2)]">
            {slide.stat.label}
          </span>
          <span
            className="mono text-3xl font-bold tabular sm:text-4xl"
            style={{ color: slide.stat.accent ?? "#38bdf8" }}
          >
            {slide.stat.value}
          </span>
        </div>
      )}

      {/* Content grid */}
      <div
        className={`flex min-h-0 flex-1 gap-6 ${isSplit ? "flex-col lg:flex-row" : "flex-col"}`}
      >
        {/* Text column */}
        <div className={`flex flex-col ${isSplit ? "lg:w-[48%]" : "w-full"}`}>
          <ul className="space-y-2.5 text-[13px] leading-relaxed text-[var(--foreground)]/90">
            {slide.bullets.map((b, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#38bdf8]" />
                <span>{b.text}</span>
              </li>
            ))}
          </ul>

          {/* Governance findings */}
          {slide.findings && slide.findings.length > 0 && (
            <div className="mt-4 space-y-2">
              {slide.findings.map((f, i) => (
                <FindingCard key={i} finding={f} />
              ))}
            </div>
          )}
        </div>

        {/* Visual column */}
        {slide.chart && (
          <div
            className={`min-h-0 ${isSplit ? "lg:w-[52%]" : "w-full"} ${isSplit ? "lg:min-h-[280px]" : ""}`}
          >
            <div className="h-full rounded-xl border border-[var(--border)] bg-white/[0.02] p-3">
              <SlideChartView chart={slide.chart} />
            </div>
          </div>
        )}
      </div>

      {/* Secondary stats */}
      {slide.stats && slide.stats.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-[var(--border)] pt-4 sm:grid-cols-3">
          {slide.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-[var(--border)] bg-white/[0.02] px-3 py-2"
            >
              <div className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted-2)]">
                {s.label}
              </div>
              <div
                className="mt-0.5 text-sm font-semibold text-[var(--foreground)]"
                style={s.accent ? { color: s.accent } : undefined}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-end justify-between gap-4 border-t border-[var(--border)] pt-4">
        {slide.footnote ? (
          <p className="max-w-[85%] text-[10px] leading-snug text-[var(--muted-2)]">
            {slide.footnote}
          </p>
        ) : (
          <span />
        )}
        <span className="mono shrink-0 text-[10px] tabular text-[var(--muted-2)]">
          {index + 1} / {total}
        </span>
      </div>
    </div>
  );
}

function FindingCard({ finding }: { finding: SlideFinding }) {
  const style = SEVERITY_STYLES[finding.severity];
  const Icon = style.icon;
  return (
    <div
      className={`rounded-lg border ${style.border} ${style.bg} px-3 py-2.5`}
    >
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
        <div>
          <div className="text-xs font-semibold text-[var(--foreground)]">
            {finding.title}
          </div>
          <div className="mt-0.5 text-[11px] leading-relaxed text-[var(--muted)]">
            {finding.detail}
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideChartView({ chart }: { chart: SlideChart }) {
  switch (chart.type) {
    case "bars":
      return <HorizontalBars data={chart.data} height={chart.height ?? 260} />;
    case "momentum":
      return (
        <MomentumChart
          data={chart.data.map((d) => ({
            label: d.label,
            momentum: d.value,
            color: d.color,
          }))}
          height={chart.height ?? 240}
        />
      );
    case "growth":
      return <GrowthChart data={chart.data} height={chart.height ?? 160} />;
    case "treemap":
      return <ShareTreemap data={chart.data} height={chart.height ?? 140} />;
    case "hhi":
      return <HHIChart chart={chart} />;
    case "comparison":
      return <ComparisonChart data={chart.data} height={chart.height ?? 180} />;
    case "gov-bars":
      return <GovBarsChart data={chart.data} height={chart.height ?? 240} />;
    case "donut":
      return <DonutChart chart={chart} />;
    default:
      return null;
  }
}

function HHIChart({
  chart,
}: {
  chart: Extract<SlideChart, { type: "hhi" }>;
}) {
  const pct = Math.min(100, (chart.index / 10000) * 100);
  const barColor =
    chart.index > 2500 ? "#fb7185" : chart.index > 1500 ? "#f5b301" : "#34d399";

  return (
    <div className="flex h-full flex-col justify-center gap-4 p-2">
      {/* Gauge */}
      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-xs text-[var(--muted)]">Concentration index</span>
          <span className="mono text-lg font-bold tabular" style={{ color: barColor }}>
            {chart.index.toFixed(0)}
          </span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all"
            style={{ width: `${pct}%`, background: barColor }}
          />
          {/* Threshold markers */}
          <div
            className="absolute inset-y-0 w-px bg-white/20"
            style={{ left: "15%" }}
            title="1,500 — Moderate"
          />
          <div
            className="absolute inset-y-0 w-px bg-white/30"
            style={{ left: "25%" }}
            title="2,500 — High"
          />
        </div>
        <div className="mt-1 flex justify-between text-[9px] text-[var(--muted-2)]">
          <span>0</span>
          <span>1,500</span>
          <span>2,500</span>
          <span>10,000</span>
        </div>
        <div
          className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ background: `${barColor}20`, color: barColor }}
        >
          {chart.level}
        </div>
      </div>

      {/* Share breakdown */}
      <div className="space-y-1.5">
        {chart.shares.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-[100px] truncate text-[11px] text-[var(--muted)]">
              {s.name}
            </div>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[#8b5cf6]"
                style={{ width: `${s.share * 100}%`, opacity: 1 - i * 0.15 }}
              />
            </div>
            <span className="mono w-10 text-right text-[10px] tabular text-[var(--foreground)]">
              {(s.share * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonChart({
  data,
  height = 180,
}: {
  data: Extract<SlideChart, { type: "comparison" }>["data"];
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div style={{ height }} className="flex flex-col justify-center gap-3 p-2">
      {data.map((d, i) => (
        <div key={i}>
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-[11px] text-[var(--muted)]">{d.label}</span>
            <span className="mono text-xs font-semibold tabular text-[var(--foreground)]">
              {formatUsd(d.value)}
            </span>
          </div>
          <div className="relative h-5 overflow-hidden rounded-md bg-white/[0.04]">
            <div
              className="absolute inset-y-0 left-0 rounded-md"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: d.color,
                opacity: 0.85,
              }}
            />
          </div>
          {d.note && (
            <div className="mt-0.5 text-[9px] text-[var(--muted-2)]">{d.note}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function GovBarsChart({
  data,
  height = 240,
}: {
  data: Extract<SlideChart, { type: "gov-bars" }>["data"];
  height?: number;
}) {
  const chartData = data.map((d) => ({
    name: d.name.length > 16 ? d.name.slice(0, 14) + "…" : d.name,
    committed: d.committed,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ left: 4, right: 24, top: 4, bottom: 4 }}
      >
        <XAxis
          type="number"
          tick={AXIS_STYLE}
          tickFormatter={(v) => formatUsd(v)}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={AXIS_STYLE}
          width={110}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
          content={<ChartTooltip />}
        />
        <Bar dataKey="committed" radius={[0, 6, 6, 0]} barSize={16} fill="#2dd4bf" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function DonutChart({ chart }: { chart: Extract<SlideChart, { type: "donut" }> }) {
  return (
    <div className="relative flex h-[200px] items-center justify-center">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chart.data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={2}
            stroke="none"
          >
            {chart.data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {chart.centerLabel && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase tracking-wider text-[var(--muted-2)]">
            {chart.centerLabel}
          </span>
          <span className="mono text-2xl font-bold tabular text-[#34d399]">
            {chart.centerValue}
          </span>
        </div>
      )}
      <div className="absolute bottom-0 flex gap-4">
        {chart.data.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
            <span className="text-[10px] text-[var(--muted)]">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
