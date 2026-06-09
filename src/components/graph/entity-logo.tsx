"use client";

import { useState } from "react";

/**
 * Renders an entity logo with a graceful fallback chain:
 * primary (Clearbit / flag) → fallback (favicon) → colored initials.
 */
export function EntityLogo({
  name,
  color,
  primary,
  fallback,
  size = 40,
  className = "",
}: {
  name: string;
  color: string;
  primary?: string;
  fallback?: string;
  size?: number;
  className?: string;
}) {
  const sources = [primary, fallback].filter(Boolean) as string[];
  const [idx, setIdx] = useState(0);
  const src = sources[idx];

  if (!src) {
    return (
      <span
        className={`grid place-items-center rounded-full font-semibold ${className}`}
        style={{
          width: size,
          height: size,
          background: `${color}22`,
          color,
          fontSize: Math.max(10, size * 0.32),
        }}
      >
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <span
      className={`grid place-items-center overflow-hidden rounded-full bg-white ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        className="object-contain"
        style={{ width: size * 0.72, height: size * 0.72 }}
        loading="lazy"
        draggable={false}
        onError={() => setIdx((i) => i + 1)}
      />
    </span>
  );
}
