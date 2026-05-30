import { useMutation } from "@tanstack/react-query";
import { suggestRoute } from "../../api/requests";
import type { RouteSuggestRequest } from "../../api/types";

export const useSuggestRoute = () => {
  return useMutation({
    mutationFn: (payload: RouteSuggestRequest) => suggestRoute(payload),
  });
};
