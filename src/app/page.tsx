import { cache } from "react";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { computeDashboardData } from "@/lib/metrics/dashboard-data";

const getDashboardData = cache(() => computeDashboardData());

export default function HomePage() {
  const initial = getDashboardData();

  return <DashboardClient initial={initial} />;
}
