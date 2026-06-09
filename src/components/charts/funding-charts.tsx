"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from "recharts";
import { SECTORS } from "@/lib/sectors";
import { formatMonth, formatUsd } from "@/lib/utils";
import type { Sector } from "@/lib/types";
import { AXIS_STYLE, ChartTooltip, GRID_COLOR } from "./primitives";

interface BarDatum {
  label: string;
  value: number;
  color: string;
}

export function HorizontalBars({ data, height = 280 }: { data: BarDatum[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke={GRID_COLOR} />
        <XAxis type="number" tick={AXIS_STYLE} tickFormatter={(v) => formatUsd(v)} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="label"
          tick={AXIS_STYLE}
          width={130}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} content={<ChartTooltip />} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function GrowthChart({
  data,
  height = 300,
}: {
  data: { month: string; amount: number; cumulative: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ left: 8, right: 12, top: 8, bottom: 4 }}>
        <defs>
          <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GRID_COLOR} />
        <XAxis dataKey="month" tick={AXIS_STYLE} tickFormatter={formatMonth} axisLine={false} tickLine={false} minTickGap={28} />
        <YAxis tick={AXIS_STYLE} tickFormatter={(v) => formatUsd(v)} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip labelFormatter={(l) => formatMonth(String(l))} />} />
        <Area type="monotone" dataKey="cumulative" name="Cumulative" stroke="#38bdf8" strokeWidth={2} fill="url(#cumGrad)" />
        <Bar dataKey="amount" name="Monthly" fill="#8b5cf6" radius={[3, 3, 0, 0]} barSize={10} opacity={0.7} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function StackedSectorChart({
  data,
  sectors,
  height = 320,
}: {
  data: Record<string, number | string>[];
  sectors: Sector[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ left: 8, right: 12, top: 8, bottom: 4 }}>
        <CartesianGrid vertical={false} stroke={GRID_COLOR} />
        <XAxis dataKey="month" tick={AXIS_STYLE} tickFormatter={(v) => formatMonth(String(v))} axisLine={false} tickLine={false} minTickGap={28} />
        <YAxis tick={AXIS_STYLE} tickFormatter={(v) => formatUsd(v)} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip labelFormatter={(l) => formatMonth(String(l))} />} />
        {sectors.map((s) => (
          <Area
            key={s}
            type="monotone"
            dataKey={s}
            name={SECTORS[s].label}
            stackId="1"
            stroke={SECTORS[s].color}
            fill={SECTORS[s].color}
            fillOpacity={0.5}
            strokeWidth={1}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MomentumChart({
  data,
  height = 280,
}: {
  data: { label: string; momentum: number; color: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 40, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke={GRID_COLOR} />
        <XAxis
          type="number"
          tick={AXIS_STYLE}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          axisLine={false}
          tickLine={false}
        />
        <YAxis type="category" dataKey="label" tick={AXIS_STYLE} width={130} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
          content={<ChartTooltip valueFormatter={(v) => `${(v * 100).toFixed(0)}%`} />}
        />
        <Bar dataKey="momentum" radius={[0, 6, 6, 0]} barSize={18}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.momentum >= 0 ? "#34d399" : "#fb7185"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface TreemapDatum {
  name: string;
  size: number;
  color: string;
  [key: string]: string | number;
}

function TreemapCell(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  color?: string;
}) {
  const { x = 0, y = 0, width = 0, height = 0, name = "", color = "#333" } = props;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={6}
        style={{ fill: color, fillOpacity: 0.85, stroke: "#06080d", strokeWidth: 2 }}
      />
      {width > 60 && height > 26 && (
        <text x={x + 8} y={y + 18} fill="#06080d" fontSize={11} fontWeight={600}>
          {name}
        </text>
      )}
    </g>
  );
}

export function ShareTreemap({ data, height = 300 }: { data: TreemapDatum[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <Treemap
        data={data}
        dataKey="size"
        aspectRatio={4 / 3}
        stroke="#06080d"
        content={<TreemapCell />}
      >
        <Tooltip content={<ChartTooltip />} />
      </Treemap>
    </ResponsiveContainer>
  );
}

export function MiniSparkline({
  data,
  color = "#38bdf8",
  height = 48,
}: {
  data: { month: string; cumulative: number }[];
  color?: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="cumulative" stroke={color} strokeWidth={1.5} fill={`url(#spark-${color})`} />
        <Line type="monotone" dataKey="cumulative" stroke={color} dot={false} strokeWidth={0} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
