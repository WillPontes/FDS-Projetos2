import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/http-client";

export type DailyStatItem = {
  day: string;
  transaction_count: number;
  co2_total_kg: number;
};

type UseDailyStatsParams = {
  days?: number;
  organizationId?: number;
};

export const useDailyStats = ({ days = 30, organizationId }: UseDailyStatsParams = {}) => {
  return useQuery({
    queryKey: ["dashboard", "daily-stats", days, organizationId],
    queryFn: () =>
      api
        .get("/api/dashboard/daily-stats", {
          searchParams: {
            days,
            ...(organizationId != null && { organization_id: organizationId }),
          },
        })
        .json<{ items: DailyStatItem[] }>()
        .then((r) => r.items),
  });
};
