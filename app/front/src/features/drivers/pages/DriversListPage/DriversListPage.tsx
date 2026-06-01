import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { DriverFormDialog } from "../../components/DriverFormDialog/DriverFormDialog";
import { DriverCreateDialog } from "../../components/DriverCreateDialog/DriverCreateDialog";
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { FilterInput } from "@/components/ui/FilterInput";
import { getToastErrorMessage } from "@/lib/api-error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ActionHintPopover } from "@/components/ActionHintPopover";
import { DataTable, entityIdColumn } from "@/components/DataTable";
import { PageLayout } from "@/components/layout/PageLayout";
import { PAGE_SIZE } from "@/constants";
import { KpiCard } from "@/features/sustainability/components/MetricCard";
import type { UserWithVehicle } from "@/features/users/api/types";
import { useDeleteUser } from "@/features/users/hooks/useUpdateUser";
import { api } from "@/lib/http-client";
import { Leaf, Fuel, DollarSign, Users } from "lucide-react";
import { useGetDrivers } from "../../hooks/useGetDrivers";

type UserStatItem = {
  user_id: number;
  co2_total_kg: number;
  fuel_total_liters: number;
  financial_total_brl: number;
  transactions_count: number;
};

const columns = (
  onDelete: (driver: UserWithVehicle) => void,
  onEdit: (driver: UserWithVehicle) => void,
): ColumnDef<UserWithVehicle>[] => [
  entityIdColumn<UserWithVehicle>(),
  {
    accessorKey: "name",
    header: "Nome",
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "E-mail",
    enableSorting: true,
  },
  {
    id: "plate",
    header: "Placa",
    enableSorting: true,
    accessorFn: (row) => row.plate ?? "",
    cell: ({ row }) => row.original.plate ?? "—",
  },
  {
    id: "fleet",
    header: "Frota",
    enableSorting: true,
    accessorFn: (row) =>
      row.isFleetLinked ? String(row.fleetOrganizationId ?? "") : "individual",
    cell: ({ row }) => {
      const driver = row.original;
      if (driver.isFleetLinked && driver.fleetOrganizationId != null) {
        return (
          <Badge variant="outline">Frota {driver.fleetOrganizationId}</Badge>
        );
      }
      return "";
    },
  },
  {
    id: "actions",
    header: "Ações",
    enableSorting: false,
    cell: ({ row }) => {
      const driver = row.original;
      return (
        <div className="flex items-center gap-2">
          <ActionHintPopover label="Ver detalhes do motorista">
            <Button asChild variant="outline" size="sm">
              <Link
                to="/motoristas/$id"
                params={{ id: String(driver.id) }}
                aria-label="Ver detalhes do motorista"
              >
                Ver
              </Link>
            </Button>
          </ActionHintPopover>
          <ActionHintPopover label="Editar motorista">
            <Button variant="outline" size="sm" onClick={() => onEdit(driver)} aria-label="Editar motorista">
              <Pencil className="h-4 w-4" />
            </Button>
          </ActionHintPopover>
          <ActionHintPopover label="Excluir motorista">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onDelete(driver)}
              aria-label="Excluir motorista"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </ActionHintPopover>
        </div>
      );
    },
  },
];

const driversSearchParams = {
  page: parseAsInteger.withDefault(1),
  sort: parseAsString,
  order: parseAsStringEnum(["asc", "desc"] as const).withDefault("asc"),
  search: parseAsString,
};

export const DriversListPage = () => {
  const { data: allStats } = useQuery({
    queryKey: ["user-stats"],
    queryFn: () => api.get("/api/user-stats/").json<UserStatItem[]>(),
  });

  const totals = allStats?.reduce(
    (acc, s) => ({
      drivers: acc.drivers + 1,
      co2: acc.co2 + s.co2_total_kg,
      fuel: acc.fuel + s.fuel_total_liters,
      financial: acc.financial + s.financial_total_brl,
    }),
    { drivers: 0, co2: 0, fuel: 0, financial: 0 },
  );

  const [{ page, sort, order, search }, setParams] = useQueryStates(
    driversSearchParams,
    { history: "replace" },
  );
  const [driverToDelete, setDriverToDelete] = useState<UserWithVehicle | null>(null);
  const [driverToEdit, setDriverToEdit] = useState<UserWithVehicle | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const { mutate: deleteDriver, isPending: isDeleting } = useDeleteUser();

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: PAGE_SIZE,
  };
  const sorting: SortingState = sort
    ? [{ id: sort, desc: order === "desc" }]
    : [];

  const { data, isLoading, isError, error } = useGetDrivers({
    page,
    pageSize: PAGE_SIZE,
    search: search ?? undefined,
    sortBy: sort ?? undefined,
    sortOrder: order,
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

  const handleConfirmDelete = () => {
    if (!driverToDelete) return;
    deleteDriver(driverToDelete.id, {
      onSuccess: () => setDriverToDelete(null),
    });
  };

  return (
    <PageLayout
      title="Motoristas"
      description="Consulte e gerencie os motoristas cadastrados no sistema."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          title="MOTORISTAS"
          value={data?.total ?? "—"}
          icon={<Users className="text-[#72C215]" size={24} />}
        />
        <KpiCard
          title="CO₂ EVITADO (KG)"
          value={totals ? totals.co2.toFixed(1) : "—"}
          icon={<Leaf className="text-[#72C215]" size={24} />}
        />
        <KpiCard
          title="COMBUSTÍVEL (L)"
          value={totals ? totals.fuel.toFixed(1) : "—"}
          icon={<Fuel className="text-[#72C215]" size={24} />}
        />
        <KpiCard
          title="ECONOMIA (R$)"
          value={totals ? `R$ ${totals.financial.toFixed(0)}` : "—"}
          icon={<DollarSign className="text-[#72C215]" size={24} />}
        />
      </div>

      {isError ? (
        <p className="text-destructive" role="alert">
          {getToastErrorMessage(error, {
            fallback: "Erro ao carregar motoristas.",
          })}
        </p>
      ) : (
        <>
          <section className="flex items-center gap-4">
            <FilterInput
              placeholder="Buscar por nome ou placa"
              value={search ?? ""}
              onChange={(e) =>
                setParams({ search: e.target.value || null, page: 1 })
              }
              className="w-full"
            />
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-1 h-4 w-4" />
              Cadastrar Motorista
            </Button>
          </section>

          <DataTable
            columns={columns(setDriverToDelete, setDriverToEdit)}
            data={data?.items ?? []}
            isLoading={isLoading}
            pageCount={pageCount}
            pagination={pagination}
            onPaginationChange={handlePaginationChange}
            sorting={sorting}
            onSortingChange={handleSortingChange}
          />
        </>
      )}

      {driverToEdit && (
        <DriverFormDialog
          open={!!driverToEdit}
          onClose={() => setDriverToEdit(null)}
          driver={driverToEdit}
        />
      )}

      <DriverCreateDialog open={createOpen} onClose={() => setCreateOpen(false)} />

      <Dialog
        open={driverToDelete != null}
        onOpenChange={(open) => !open && setDriverToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir motorista</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir{" "}
              <strong>{driverToDelete?.name}</strong>? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDriverToDelete(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};
