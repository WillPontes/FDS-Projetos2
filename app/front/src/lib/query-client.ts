import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "./api-error";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});
