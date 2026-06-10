import type { ObservatoryDataset } from "../types";

const CACHE_KEY = "acf-live-dataset";

export function loadCachedDataset(): ObservatoryDataset | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ObservatoryDataset;
  } catch {
    return null;
  }
}

export function saveCachedDataset(ds: ObservatoryDataset): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(ds));
  } catch {
    /* quota exceeded — ignore */
  }
}

export function clearCachedDataset(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
}

export interface RefreshReport {
  generatedAt: string;
  counts: { entities: number; rounds: number; flows: number };
  newFlows: number;
  sources: { id: string; label: string; live: boolean; entities: number; flows: number }[];
}

export async function refreshLiveData(since?: string): Promise<{ dataset: ObservatoryDataset; report: RefreshReport }> {
  const res = await fetch("/api/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ since }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? `Refresh failed (${res.status})`);
  }
  return res.json() as Promise<{ dataset: ObservatoryDataset; report: RefreshReport }>;
}
