import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getToastErrorMessage } from "./api-error";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(
        getToastErrorMessage(error, {
          fallback: "Não foi possível carregar os dados. Tente novamente.",
        }),
      )
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});
