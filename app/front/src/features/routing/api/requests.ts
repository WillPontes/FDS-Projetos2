import { api } from "@/lib/http-client";
import { mockSuggestRoute, resolveWithMock } from "@/mocks";
import type { RouteEstimate, RouteSuggestRequest } from "./types";

export const suggestRoute = async (
  payload: RouteSuggestRequest,
): Promise<RouteEstimate> => {
  return resolveWithMock(
    () => api.post("routes/suggest", { json: payload }).json<RouteEstimate>(),
    () => mockSuggestRoute(payload.destination),
  );
};
