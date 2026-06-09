import * as React from "react";
import { cn } from "@/lib/utils";

interface StatProps {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  accent?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function Stat({ label, value, sub, accent, icon, className }: StatProps) {
  return (
    <div className={cn("glass card-hover rounded-2xl p-5", className)}>
      <div className="flex items-start justify-between">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-2">{label}</div>
        {icon && (
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-white/[0.04]" style={accent ? { color: accent } : undefined}>
            {icon}
          </div>
        )}
      </div>
      <div className="mono mt-3 text-2xl font-semibold tabular" style={accent ? { color: accent } : undefined}>
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
    </div>
  );
}

export function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
