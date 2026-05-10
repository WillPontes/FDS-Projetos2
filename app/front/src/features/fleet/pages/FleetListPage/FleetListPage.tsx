import { Link } from "@tanstack/react-router"
import type { OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table"
import { Plus } from "lucide-react"
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import { PAGE_SIZE } from "@/constants"
import { useGetVehicles } from "../../hooks/useGetVehicles"
import { columns } from "./columns"

const fleetSearchParams = {
  page: parseAsInteger.withDefault(1),
  sort: parseAsString,
  order: parseAsStringEnum(["asc", "desc"] as const).withDefault("asc"),
}

export const FleetListPage = () => {
  const [{ page, sort, order }, setParams] = useQueryStates(fleetSearchParams, {
    history: "replace",
  })

  const pagination: PaginationState = { pageIndex: page - 1, pageSize: PAGE_SIZE }
  const sorting: SortingState = sort ? [{ id: sort, desc: order === "desc" }] : []

  const { data, isLoading } = useGetVehicles({
    page,
    pageSize: PAGE_SIZE,
    sortBy: sort ?? undefined,
    sortOrder: order,
  })

  const pageCount = data ? Math.ceil(data.total / PAGE_SIZE) : undefined

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater
    setParams({ page: next.pageIndex + 1 })
  }

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === "function" ? updater(sorting) : updater
    setParams({
      sort: next[0]?.id ?? null,
      order: next[0]?.desc ? "desc" : "asc",
      page: 1,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Frota</h1>
        <Button asChild>
          <Link to="/fleet/new">
            <Plus className="h-4 w-4" />
            Novo Veículo
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        sorting={sorting}
        onSortingChange={handleSortingChange}
      />
    </div>
  )
}
