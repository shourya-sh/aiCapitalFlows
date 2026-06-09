import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
  variant?: "solid" | "soft" | "outline";
}

export function Badge({ className, color, variant = "soft", style, children, ...props }: BadgeProps) {
  const computed: React.CSSProperties = { ...style };
  if (color) {
    if (variant === "soft") {
      computed.backgroundColor = `${color}1f`;
      computed.color = color;
      computed.borderColor = `${color}3a`;
    } else if (variant === "outline") {
      computed.color = color;
      computed.borderColor = `${color}55`;
    } else {
      computed.backgroundColor = color;
      computed.color = "#06080d";
    }
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        className
      )}
      style={computed}
      {...props}
    >
      {children}
    </span>
  );
}
