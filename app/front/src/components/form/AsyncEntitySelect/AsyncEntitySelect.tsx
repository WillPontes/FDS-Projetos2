import {
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";

import { FieldTrigger } from "@/components/ui/field-trigger";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  normalizePaginatedResponse,
  type PaginatedResponse,
} from "@/lib/paginated-response";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

export type PaginatedResult<T> = PaginatedResponse<T>;

function normalizePageResult<T>(result: unknown): PaginatedResult<T> {
  return normalizePaginatedResponse<T>(result);
}

export type AsyncEntitySelectProps<T> = {
  mode?: "single" | "multiple";
  value: T | T[] | null | undefined;
  onChange: (value: T | T[] | null | undefined) => void;
  queryKey: readonly unknown[];
  fetchPage: (page: number, search: string) => Promise<PaginatedResult<T>>;
  getOptionValue: (item: T) => number | string;
  getOptionLabel: (item: T) => string;
  placeholder?: string;
  emptyLabel?: string;
  disabled?: boolean;
  excludeIds?: Array<number | string>;
  className?: string;
  allowEmpty?: boolean;
  renderOption?: (item: T) => React.ReactNode;
  multipleSummary?: (count: number) => string;
};

export function AsyncEntitySelect<T>({
  mode = "single",
  value,
  onChange,
  queryKey,
  fetchPage,
  getOptionValue,
  getOptionLabel,
  placeholder = "Selecione...",
  emptyLabel,
  disabled,
  excludeIds = [],
  className,
  allowEmpty = true,
  renderOption,
  multipleSummary = (count) => `${count} selecionado${count === 1 ? "" : "s"}`,
}: AsyncEntitySelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [labelCache, setLabelCache] = useState<Map<string | number, string>>(
    () => new Map(),
  );
  const sentinelRef = useRef<HTMLDivElement>(null);

  const getOptionValueRef = useRef(getOptionValue);
  const getOptionLabelRef = useRef(getOptionLabel);
  getOptionValueRef.current = getOptionValue;
  getOptionLabelRef.current = getOptionLabel;

  const excludeKey = excludeIds.map(String).join(",");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const hasSelection =
    mode === "multiple"
      ? Array.isArray(value) && value.length > 0
      : value != null;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, isPending } =
    useInfiniteQuery({
      queryKey: [...queryKey, debouncedSearch],
      queryFn: async ({ pageParam = 1 }): Promise<PaginatedResult<T>> =>
        normalizePageResult(
          await fetchPage(pageParam as number, debouncedSearch),
        ),
      getNextPageParam: (lastPage, pages) => {
        const normalized = normalizePageResult(lastPage);
        const loaded = pages.reduce(
          (acc, page) => acc + normalizePageResult(page).items.length,
          0,
        );
        return loaded < normalized.total ? pages.length + 1 : undefined;
      },
      initialPageParam: 1,
      enabled: open,
      placeholderData: keepPreviousData,
    });

  const allItems = useMemo(() => {
    const items = data?.pages.flatMap((page) => page.items) ?? [];
    if (!excludeKey) return items;
    const exclude = new Set(excludeKey.split(",").filter(Boolean));
    return items.filter(
      (item) => !exclude.has(String(getOptionValueRef.current(item))),
    );
  }, [data, excludeKey]);

  useEffect(() => {
    if (!data?.pages.length) return;
    const items = data.pages.flatMap((page) => page.items);
    if (items.length === 0) return;

    setLabelCache((prev) => {
      const next = new Map(prev);
      let changed = false;
      for (const item of items) {
        const id = getOptionValueRef.current(item);
        const label = getOptionLabelRef.current(item);
        if (next.get(id) !== label) {
          next.set(id, label);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [data]);

  useEffect(() => {
    if (!open || !sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, open, allItems.length]);

  const selectedIdSet = useMemo(() => {
    if (mode === "multiple") {
      const items = Array.isArray(value) ? value : [];
      return new Set(items.map((item) => String(getOptionValueRef.current(item))));
    }
    return value != null
      ? new Set([String(getOptionValueRef.current(value as T))])
      : new Set<string>();
  }, [mode, value]);

  const triggerLabel = useMemo(() => {
    if (mode === "multiple") {
      const items = Array.isArray(value) ? value : [];
      if (items.length === 0) return placeholder;
      const labels = items
        .map((item) => {
          const id = getOptionValueRef.current(item);
          return labelCache.get(id) ?? getOptionLabelRef.current(item);
        })
        .filter(Boolean);
      if (labels.length <= 2) return labels.join(", ");
      return multipleSummary(items.length);
    }

    if (value == null) return placeholder;
    const id = getOptionValueRef.current(value as T);
    return labelCache.get(id) ?? getOptionLabelRef.current(value as T);
  }, [mode, value, placeholder, labelCache, multipleSummary]);

  const showLoading = open && isFetching && allItems.length === 0;
  const showEmpty = open && !isPending && !isFetching && allItems.length === 0;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setSearch("");
      setDebouncedSearch("");
    }
  };

  const handleClear = () => {
    onChange(mode === "multiple" ? [] : null);
  };

  const handleSelectSingle = (item: T) => {
    const id = getOptionValueRef.current(item);
    const label = getOptionLabelRef.current(item);
    setLabelCache((prev) => {
      const next = new Map(prev);
      next.set(id, label);
      return next;
    });
    onChange(item);
    handleOpenChange(false);
  };

  const handleToggleMultiple = (item: T) => {
    const current = Array.isArray(value) ? value : [];
    const id = String(getOptionValueRef.current(item));
    const exists = current.some(
      (entry) => String(getOptionValueRef.current(entry)) === id,
    );
    if (exists) {
      onChange(
        current.filter(
          (entry) => String(getOptionValueRef.current(entry)) !== id,
        ),
      );
      return;
    }
    onChange([...current, item]);
  };

  const handleSelectEmpty = () => {
    onChange(mode === "multiple" ? [] : null);
    handleOpenChange(false);
  };

  return (
    <Popover modal={false} open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <FieldTrigger
          disabled={disabled}
          showClear={hasSelection && allowEmpty}
          onClear={handleClear}
          className={cn(!hasSelection && "text-muted-foreground", className)}
        >
          {triggerLabel}
        </FieldTrigger>
      </PopoverTrigger>
      <PopoverContent
        className="z-[200] w-[var(--radix-popover-trigger-width)] p-2"
        align="start"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <Input
          placeholder="Buscar..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          className="mb-2"
          clearable={false}
          autoFocus
        />
        <div className="max-h-56 overflow-y-auto">
          {allowEmpty && emptyLabel ? (
            <button
              type="button"
              className={cn(
                "w-full rounded px-3 py-1.5 text-left text-sm hover:bg-neutral-100",
                !hasSelection && "bg-neutral-100 font-medium",
              )}
              onClick={handleSelectEmpty}
            >
              {emptyLabel}
            </button>
          ) : null}
          {showLoading ? (
            <p className="px-3 py-2 text-sm text-neutral-500">Carregando…</p>
          ) : null}
          {allItems.map((item) => {
            const id = String(getOptionValueRef.current(item));
            const isSelected = selectedIdSet.has(id);
            return (
              <button
                key={id}
                type="button"
                className={cn(
                  "flex w-full items-center gap-2 rounded px-3 py-1.5 text-left text-sm hover:bg-neutral-100",
                  isSelected && "bg-neutral-100 font-medium",
                )}
                onClick={() =>
                  mode === "multiple"
                    ? handleToggleMultiple(item)
                    : handleSelectSingle(item)
                }
              >
                {mode === "multiple" ? (
                  <input
                    type="checkbox"
                    readOnly
                    checked={isSelected}
                    className="h-4 w-4 rounded border-neutral-300"
                  />
                ) : null}
                <span className="min-w-0 flex-1 truncate">
                  {renderOption
                    ? renderOption(item)
                    : getOptionLabelRef.current(item)}
                </span>
              </button>
            );
          })}
          {showEmpty ? (
            <p className="px-3 py-2 text-sm text-neutral-500">Nenhum resultado.</p>
          ) : null}
          <div ref={sentinelRef} className="py-1">
            {isFetchingNextPage ? (
              <p className="text-center text-xs text-neutral-400">Carregando…</p>
            ) : null}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { PAGE_SIZE as ASYNC_ENTITY_PAGE_SIZE };
