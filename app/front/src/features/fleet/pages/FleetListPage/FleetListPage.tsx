import { Link } from "@tanstack/react-router";
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { Pencil, Plus, Trash } from "lucide-react";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { PageLayout } from "@/components/layout/PageLayout";
import { PAGE_SIZE } from "@/constants";
import { useGetVehicles } from "../../hooks/useGetVehicles";
import type { Vehicle } from "../../schemas/vehicle-schema";

const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "id",
    header: "TAG ID",
    enableSorting: true,
  },
  {
    accessorKey: "plate",
    header: "PLACA",
    enableSorting: true,
  },
  {
    accessorKey: "model",
    header: "MODELO",
    enableSorting: true,
  },
  {
    accessorKey: "fuel_type",
    header: "TIPO DE COMBUSTÍVEL",
    enableSorting: true,
  },
  {
    accessorKey: "installation_date",
    header: "DATA DE INSTALAÇÃO",
    enableSorting: true,
  },
  {
    accessorKey: "actions",
    header: "AÇÕES",
    enableSorting: false,
    cell: ({ row }) => {
      const vehicle = row.original;
      const handleDelete = () => {
        console.log(vehicle);
      };

      return (
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link to="/frota/editar/$id" params={{ id: String(vehicle.id) }}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button type="button" variant="outline" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

const fleetSearchParams = {
  page: parseAsInteger.withDefault(1),
  sort: parseAsString,
  order: parseAsStringEnum(["asc", "desc"] as const).withDefault("asc"),
  search: parseAsString,
};

export const FleetListPage = () => {
  const [{ page, sort, order, search }, setParams] = useQueryStates(
    fleetSearchParams,
    {
      history: "replace",
    },
  );

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: PAGE_SIZE,
  };
  const sorting: SortingState = sort
    ? [{ id: sort, desc: order === "desc" }]
    : [];

  const { data, isLoading } = useGetVehicles({
    page,
    pageSize: PAGE_SIZE,
    sortBy: sort ?? undefined,
    sortOrder: order,
    search: search ?? undefined,
  });

  const pageCount = data ? Math.ceil(data.total / PAGE_SIZE) : undefined;

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;
    setParams({ page: next.pageIndex + 1 });
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;
    setParams({
      sort: next[0]?.id ?? null,
      order: next[0]?.desc ? "desc" : "asc",
      page: 1,
    });
  };

  const handleSearchChange = (value: string) => {
    setParams({ search: value, page: 1 });
  };

  return (
    <PageLayout
      title="Frota"
      description="Consulte e gerencie os veículos da frota, com busca, filtros e cadastro de novos veículos."
    >
      <section className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar"
          value={search ?? ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full rounded-md h-10 bg-neutral-100 border border-neutral-300 outline-none px-4 py-2 text-sm"
        />

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline">
            Filtrar
          </Button>
          <Button type="button" variant="outline">
            Importar CSV/Lote
          </Button>
          <Button asChild>
            <Link to="/frota/novo">
              <Plus className="h-4 w-4" />
              Cadastrar Veículo
            </Link>
          </Button>
        </div>
      </section>

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
    </PageLayout>
  );
};
