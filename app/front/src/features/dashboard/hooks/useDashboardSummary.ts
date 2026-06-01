import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/http-client";

export type DashboardSummary = {
  total_co2_avoided_kg: number;
  total_fuel_saved_liters: number;
  accumulated_economy: number;
  active_tags: number;
  paper_saved_meters: number;
  transaction_count: number;
};

type UseDashboardSummaryParams = {
  organizationId?: number;
};

export const useDashboardSummary = ({
  organizationId,
}: UseDashboardSummaryParams = {}) => {
  return useQuery({
    queryKey: ["dashboard", "summary", organizationId],
    queryFn: () =>
      api
        .get("/api/dashboard/summary", {
          searchParams: {
            ...(organizationId != null && { organization_id: organizationId }),
          },
        })
        .json<DashboardSummary>(),
  });
};
