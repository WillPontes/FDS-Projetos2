export const routeKeys = {
  all: ["routes"] as const,
  suggest: () => [...routeKeys.all, "suggest"] as const,
};
