"use client";

import { useEffect, useState } from "react";

/** Smooth count-up when slide becomes active. Uses rAF easing. */
export function useCountUp(end: number, duration = 1500, isActive: boolean, decimals = 0): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setValue(0);
      return;
    }

    let startTime: number | null = null;
    let frame: number;

    const tick = (ts: number) => {
      if (startTime === null) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = end * eased;
      setValue(decimals > 0 ? next : Math.floor(next));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setValue(end);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isActive, end, duration, decimals]);

  return value;
}

export function formatCountUp(value: number, decimals = 1): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(decimals)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(decimals)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(decimals)}M`;
  return `$${value.toFixed(0)}`;
}
