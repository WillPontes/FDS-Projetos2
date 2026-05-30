export function filterBySearch<T>(
  items: T[],
  search: string | null | undefined,
  getSearchableText: (item: T) => string[],
): T[] {
  const term = search?.trim().toLowerCase();
  if (!term) return items;

  return items.filter((item) =>
    getSearchableText(item).some((text) => text.toLowerCase().includes(term)),
  );
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number,
): { items: T[]; total: number } {
  const total = items.length;
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
  };
}

export function sortItems<T>(
  items: T[],
  sortKey: string | null | undefined,
  order: "asc" | "desc",
  getValue: (item: T, key: string) => string | number,
): T[] {
  if (!sortKey) return items;

  return [...items].sort((a, b) => {
    const aVal = getValue(a, sortKey);
    const bVal = getValue(b, sortKey);
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}
