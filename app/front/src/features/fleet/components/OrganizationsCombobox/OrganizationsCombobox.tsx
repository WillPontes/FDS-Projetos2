import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "@/lib/http-client";
import type { Organization } from "../../api/types";

const PAGE_SIZE = 20;

async function getOrganizationsPaginated(page: number, search: string) {
  return api
    .get("/api/organizations", {
      searchParams: { page, page_size: PAGE_SIZE, search: search || undefined, paginate: "true" },
    })
    .json<{ items: Organization[]; total: number }>();
}

type OrganizationsComboboxProps = {
  value: number | undefined;
  onValueChange: (value: number | undefined) => void;
  placeholder?: string;
};

export const OrganizationsCombobox = ({
  value,
  onValueChange,
  placeholder = "Todas as frotas",
}: OrganizationsComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["organizations", "paginated", debouncedSearch],
    queryFn: ({ pageParam = 1 }) => getOrganizationsPaginated(pageParam as number, debouncedSearch),
    getNextPageParam: (lastPage, pages) => {
      const loaded = pages.reduce((acc, p) => acc + p.items.length, 0);
      return loaded < lastPage.total ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const allOrgs = data?.pages.flatMap((p) => p.items) ?? [];
  const selectedOrg = allOrgs.find((o) => o.id === value);

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
        <Button variant="outline" className="h-9 w-52 justify-between font-normal">
          <span className="truncate text-sm">
            {selectedOrg ? selectedOrg.name : placeholder}
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
          <button
            type="button"
            className="w-full rounded px-3 py-1.5 text-left text-sm hover:bg-neutral-100"
            onClick={() => { onValueChange(undefined); setOpen(false); }}
          >
            {placeholder}
          </button>
          {allOrgs.map((org) => (
            <button
              key={org.id}
              type="button"
              className={`w-full rounded px-3 py-1.5 text-left text-sm hover:bg-neutral-100 ${value === org.id ? "bg-neutral-100 font-medium" : ""}`}
              onClick={() => { onValueChange(org.id); setOpen(false); }}
            >
              {org.name}
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
