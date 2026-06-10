"use client";

import { useEffect, useState, type CSSProperties } from "react";

/** Staggered entrance when slide becomes active. */
export function useSlideAnimation(isActive: boolean, staggerMs = 80) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setVisible(false);
      return;
    }
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, [isActive]);

  const enterClass = visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0";

  const enter = (index = 0) =>
    `transition-all duration-500 ease-out ${enterClass}`;

  const enterStyle = (index = 0): CSSProperties => ({
    transitionDelay: visible ? `${index * staggerMs}ms` : "0ms",
  });

  return { visible, enter, enterStyle, staggerMs };
}
