import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVehiclesQuery } from "../hooks/use-vehicles-query";
import type { Vehicle } from "../schemas/vehicle-schema";

const STATUS_LABELS: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo",
  maintenance: "Em Manutenção",
};

function statusBadgeVariant(
  status: string,
): "success" | "warning" | "secondary" {
  if (status === "active") return "success";
  if (status === "maintenance") return "warning";
  return "secondary";
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
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      const label = STATUS_LABELS[status] ?? status;
      return <Badge variant={statusBadgeVariant(status)}>{label}</Badge>;
    },
  },
];

export function FleetListPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isLoading } = useVehiclesQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
  });

  const pageCount = data
    ? Math.ceil(data.total / pagination.pageSize)
    : undefined;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        title="Frota"
        actions={
          <Button asChild>
            <Link to="/frota/adicionar">
              <Plus className="h-4 w-4" />
              Novo Veículo
            </Link>
          </Button>
        }
      />

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
  );
}
