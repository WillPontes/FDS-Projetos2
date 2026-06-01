export type PaginatedResponse<T> = {
  items: T[];
  total: number;
};

export function normalizePaginatedResponse<T>(
  result: unknown,
): PaginatedResponse<T> {
  if (Array.isArray(result)) {
    return { items: result as T[], total: result.length };
  }

  if (result && typeof result === "object") {
    const record = result as Record<string, unknown>;

    if (Array.isArray(record.items)) {
      const items = record.items as T[];
      return {
        items,
        total: typeof record.total === "number" ? record.total : items.length,
      };
    }

    if (Array.isArray(record.data)) {
      const items = record.data as T[];
      return {
        items,
        total: typeof record.total === "number" ? record.total : items.length,
      };
    }
  }

  return { items: [], total: 0 };
}
