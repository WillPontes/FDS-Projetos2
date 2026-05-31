import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "@/lib/http-client";
import type { Fleet } from "../../api/types";

const PAGE_SIZE = 20;

async function getFleetsPaginated(page: number, search: string, organizationId?: number) {
  return api
    .get("/api/fleets/", {
      searchParams: {
        page,
        page_size: PAGE_SIZE,
        search: search || undefined,
        paginate: "true",
        ...(organizationId != null && { organization_id: organizationId }),
      },
    })
    .json<{ items: Fleet[]; total: number }>();
}

type FleetsComboboxProps = {
  value: number | undefined;
  onValueChange: (value: number | undefined) => void;
  organizationId?: number;
  placeholder?: string;
  allowNone?: boolean;
  noneLabel?: string;
};

export const FleetsCombobox = ({
  value,
  onValueChange,
  organizationId,
  placeholder = "Selecione uma frota",
  allowNone = true,
  noneLabel = "Sem frota",
}: FleetsComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["fleets", "paginated", debouncedSearch, organizationId],
    queryFn: ({ pageParam = 1 }) =>
      getFleetsPaginated(pageParam as number, debouncedSearch, organizationId),
    getNextPageParam: (lastPage, pages) => {
      const loaded = pages.reduce((acc, p) => acc + p.items.length, 0);
      return loaded < lastPage.total ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const allFleets = data?.pages.flatMap((p) => p.items) ?? [];
  const selectedFleet = allFleets.find((f) => f.id === value);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9 w-full justify-between font-normal">
          <span className="truncate text-sm">
            {value === undefined && allowNone
              ? noneLabel
              : selectedFleet
                ? selectedFleet.name
                : placeholder}
          </span>
          <div className="flex items-center gap-1">
            {value !== undefined && (
              <X
                className="h-3 w-3 text-neutral-400 hover:text-neutral-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onValueChange(undefined);
                }}
              />
            )}
            <ChevronDown className="h-3 w-3 text-neutral-400" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <Input
          placeholder="Buscar frota..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2 h-8"
          autoFocus
        />
        <div className="max-h-56 overflow-y-auto">
          {allowNone && (
            <button
              type="button"
              className={`w-full rounded px-3 py-1.5 text-left text-sm hover:bg-neutral-100 ${value === undefined ? "bg-neutral-100 font-medium" : ""}`}
              onClick={() => { onValueChange(undefined); setOpen(false); }}
            >
              {noneLabel}
            </button>
          )}
          {allFleets.map((fleet) => (
            <button
              key={fleet.id}
              type="button"
              className={`w-full rounded px-3 py-1.5 text-left text-sm hover:bg-neutral-100 ${value === fleet.id ? "bg-neutral-100 font-medium" : ""}`}
              onClick={() => { onValueChange(fleet.id); setOpen(false); }}
            >
              #{fleet.id} · {fleet.name}
            </button>
          ))}
          <div ref={sentinelRef} className="py-1">
            {isFetchingNextPage && (
              <p className="text-center text-xs text-neutral-400">Carregando…</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
