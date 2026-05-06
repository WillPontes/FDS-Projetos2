import { useState } from "react"
import { Link } from "@tanstack/react-router"
import type { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table/data-table"
import { useVehiclesQuery } from "../hooks/use-vehicles-query"
import type { Vehicle } from "../schemas/vehicle-schema"

const STATUS_LABELS: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo",
  maintenance: "Em Manutenção",
}

const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "plate",
    header: "Placa",
    enableSorting: true,
  },
  {
    accessorKey: "model",
    header: "Modelo",
    enableSorting: true,
  },
  {
    accessorKey: "year",
    header: "Ano",
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => STATUS_LABELS[row.getValue<string>("status")] ?? row.getValue("status"),
  },
]

export function FleetListPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])

  const { data, isLoading } = useVehiclesQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
  })

  const pageCount = data ? Math.ceil(data.total / pagination.pageSize) : undefined

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
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
      />
    </div>
  )
}
