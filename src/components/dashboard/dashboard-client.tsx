"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Dashboard } from "@/components/dashboard/dashboard";
import { computeDashboardData } from "@/lib/metrics/dashboard-data";
import { dataset as staticDataset } from "@/lib/data";
import { loadCachedDataset, refreshLiveData, saveCachedDataset } from "@/lib/data/live-cache";
import type { ObservatoryDataset } from "@/lib/types";
import type { DashboardData } from "@/lib/metrics/dashboard-data";

interface DashboardClientProps {
  initial: DashboardData;
}

export function DashboardClient({ initial }: DashboardClientProps) {
  const [liveDataset, setLiveDataset] = useState<ObservatoryDataset | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [newFlowCount, setNewFlowCount] = useState(0);

  useEffect(() => {
    const cached = loadCachedDataset();
    if (cached && cached.generatedAt >= staticDataset.generatedAt) {
      setLiveDataset(cached);
      setLastRefresh(cached.generatedAt);
    }
  }, []);

  const dashboard = useMemo(() => {
    if (!liveDataset) return initial;
    return computeDashboardData(liveDataset);
  }, [initial, liveDataset]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshError(null);
    try {
      const since = liveDataset?.generatedAt ?? staticDataset.generatedAt;
      const priorCount = (liveDataset ?? staticDataset).flows.length;
      const { dataset, report } = await refreshLiveData(since);
      saveCachedDataset(dataset);
      setLiveDataset(dataset);
      setLastRefresh(report.generatedAt);
      setNewFlowCount(Math.max(0, dataset.flows.length - priorCount));
    } catch (err) {
      setRefreshError(err instanceof Error ? err.message : "Refresh failed");
    } finally {
      setRefreshing(false);
    }
  }, [liveDataset]);

  return (
    <Dashboard
      graphNodes={dashboard.nodes}
      graphEdges={dashboard.edges}
      stats={dashboard.stats}
      insights={dashboard.insights}
      sectorBars={dashboard.sectorBars}
      momentum={dashboard.momentum}
      verification={dashboard.verification}
      dataGeneratedAt={dashboard.generatedAt}
      lastRefresh={lastRefresh}
      refreshing={refreshing}
      refreshError={refreshError}
      newFlowCount={newFlowCount}
      onRefreshData={handleRefresh}
    />
  );
}
