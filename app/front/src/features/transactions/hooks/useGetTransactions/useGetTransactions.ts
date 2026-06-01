import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../../api/requests";
import type { GetTransactionsParams } from "../../api/types";

export const useGetTransactions = (params: GetTransactionsParams = {}) => {
  return useQuery({
    queryKey: ["transactions", "audit", params],
    queryFn: () => getTransactions(params),
  });
};
