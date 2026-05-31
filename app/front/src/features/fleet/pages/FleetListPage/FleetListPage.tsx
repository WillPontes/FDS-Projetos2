import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { Pencil, Plus, Trash } from "lucide-react";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable, entityIdColumn } from "@/components/DataTable";
import { FilterInput } from "@/components/ui/FilterInput";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { PageLayout } from "@/components/layout/PageLayout";
import { PAGE_SIZE } from "@/constants";
import { FUEL_TYPE_OPTIONS } from "@/features/dashboard/constants";
import { useCurrentUser } from "@/features/auth";
import { useGetVehicles } from "../../hooks/useGetVehicles";
import { deleteVehicle } from "../../api/requests";
import { useQueryClient } from "@tanstack/react-query";
import { vehicleKeys } from "../../api/query-keys";
import type { Vehicle } from "../../schemas/vehicle-schema";
import { VehicleFormDialog } from "../../components/VehicleFormDialog/VehicleFormDialog";

const VehicleActions = ({
  vehicle,
  onEdit,
}: {
  vehicle: Vehicle;
  onEdit: (v: Vehicle) => void;
}) => {
  const queryClient = useQueryClient();
  const handleDelete = async () => {
    try {
      await deleteVehicle(vehicle.id);
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
      toast.success("Veículo removido.");
    } catch {
      toast.error("Erro ao remover veículo.");
    }
  };
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="outline" size="sm">
        <Link to="/frota/$id" params={{ id: String(vehicle.id) }}>Ver</Link>
      </Button>
      <Button variant="outline" size="sm" onClick={() => onEdit(vehicle)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={handleDelete}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

const fleetSearchParams = {
  page: parseAsInteger.withDefault(1),
  sort: parseAsString,
  order: parseAsStringEnum(["asc", "desc"] as const).withDefault("asc"),
  search: parseAsString,
  fuel_type: parseAsString,
  sem_frota: parseAsStringEnum(["all", "yes", "no"] as const).withDefault("all"),
};

const SEM_FROTA_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "yes", label: "Sem frota" },
  { value: "no", label: "Com frota" },
];

export const FleetListPage = () => {
  const { user } = useCurrentUser();
  const isAdmin = user?.role === "admin";
  const [{ page, sort, order, search, fuel_type, sem_frota }, setParams] = useQueryStates(
    fleetSearchParams,
    { history: "replace" },
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);

  const organizationId =
    user?.role === "gestor_frota" ? user.organization_id ?? undefined : undefined;

  const semFrotaParam =
    isAdmin && sem_frota === "yes" ? true : isAdmin && sem_frota === "no" ? false : undefined;

  const pagination: PaginationState = { pageIndex: page - 1, pageSize: PAGE_SIZE };
  const sorting: SortingState = sort ? [{ id: sort, desc: order === "desc" }] : [];

  const { data, isLoading } = useGetVehicles({
    page,
    pageSize: PAGE_SIZE,
    sortBy: sort ?? undefined,
    sortOrder: order,
    search: search ?? undefined,
    fuelType: fuel_type ?? undefined,
    organizationId,
    semFrota: semFrotaParam,
  });

  const pageCount = data ? Math.ceil(data.total / PAGE_SIZE) : undefined;

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;
    setParams({ page: next.pageIndex + 1 });
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;
    setParams({ sort: next[0]?.id ?? null, order: next[0]?.desc ? "desc" : "asc", page: 1 });
  };

  const columns: ColumnDef<Vehicle>[] = [
    entityIdColumn<Vehicle>(),
    { accessorKey: "id_tag", header: "TAG ID", enableSorting: true },
    { accessorKey: "license_plate", header: "PLACA", enableSorting: true },
    { accessorKey: "model", header: "MODELO", enableSorting: true },
    { accessorKey: "fuel_type", header: "TIPO DE COMBUSTÍVEL", enableSorting: true },
    {
      id: "actions",
      header: "AÇÕES",
      enableSorting: false,
      cell: ({ row }) => (
        <VehicleActions vehicle={row.original} onEdit={setEditVehicle} />
      ),
    },
  ];

  return (
    <PageLayout
      title="Veículos"
      description="Consulte e gerencie os veículos da frota."
    >
      <section className="flex items-center gap-4">
        <FilterInput
          placeholder="Buscar por placa, modelo ou TAG"
          value={search ?? ""}
          onChange={(e) => setParams({ search: e.target.value, page: 1 })}
          className="w-full"
        />
        <div className="flex items-center gap-2">
          <FilterSelect
            value={fuel_type ?? "all"}
            onValueChange={(v) => setParams({ fuel_type: v === "all" ? null : v, page: 1 })}
            options={[{ value: "all", label: "Todos combustíveis" }, ...FUEL_TYPE_OPTIONS]}
            placeholder="Combustível"
            className="w-44"
          />
          {isAdmin && (
            <FilterSelect
              value={sem_frota}
              onValueChange={(v) => setParams({ sem_frota: v as typeof sem_frota, page: 1 })}
              options={SEM_FROTA_OPTIONS}
              placeholder="Frota"
              className="w-36"
            />
          )}
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Cadastrar Veículo
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

      <VehicleFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        defaultOrganizationId={organizationId}
      />
      <VehicleFormDialog
        open={!!editVehicle}
        onClose={() => setEditVehicle(null)}
        vehicle={editVehicle ?? undefined}
      />
    </PageLayout>
  );
};
