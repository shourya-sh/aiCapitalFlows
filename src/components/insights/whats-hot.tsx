"use client";

import { motion } from "framer-motion";
import {
  Battery,
  Crown,
  Flame,
  Layers,
  Server,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import type { Insight, InsightKind } from "@/lib/metrics/insights";
import { sectorColor } from "@/lib/sectors";

const ICONS: Record<InsightKind, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  "fastest-sector": Flame,
  "largest-round": Trophy,
  "top-investor": Crown,
  "emerging-category": Sparkles,
  "infra-bottleneck": Server,
  "energy-bottleneck": Battery,
  concentration: Layers,
  government: TrendingUp,
};

export function WhatsHotGrid({ insights }: { insights: Insight[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {insights.map((insight, i) => {
        const Icon = ICONS[insight.kind] ?? Sparkles;
        const accent = insight.sector ? sectorColor(insight.sector) : "#38bdf8";
        return (
          <motion.div
            key={insight.kind}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="glass card-hover group relative overflow-hidden rounded-2xl p-5"
          >
            <div
              className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
              style={{ background: accent }}
            />
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-2">
                <Icon className="h-3.5 w-3.5" style={{ color: accent }} />
                {insight.title}
              </div>
              {insight.metric && (
                <span
                  className="mono rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular"
                  style={{ background: `${accent}1f`, color: accent }}
                >
                  {insight.metric}
                </span>
              )}
            </div>
            <div className="relative mt-3 text-lg font-semibold tracking-tight">{insight.headline}</div>
            <p className="relative mt-1.5 text-xs leading-relaxed text-muted">{insight.detail}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
