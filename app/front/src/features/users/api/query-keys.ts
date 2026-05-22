export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  list: (params?: Record<string, never>) => [...userQueryKeys.lists(), params ?? {}] as const,
  details: () => [...userQueryKeys.all, "detail"] as const,
  detail: (id: string | number) => [...userQueryKeys.details(), id] as const,
};
