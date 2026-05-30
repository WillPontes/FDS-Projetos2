import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../../api/requests";
import { userQueryKeys } from "../../api/query-keys";

export const useGetUser = (id: number, enabled = true) => {
  return useQuery({
    queryKey: userQueryKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: enabled && Number.isFinite(id),
  });
};
