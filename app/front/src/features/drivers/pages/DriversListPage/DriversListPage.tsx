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
import {
  FleetsRelationSelect,
  OrganizationsRelationSelect,
} from "@/components/form/relation-selects";
import { DataTable, entityIdColumn } from "@/components/DataTable";
import { PageLayout } from "@/components/layout/PageLayout";
import { PAGE_SIZE } from "@/constants";
import { useCurrentUser } from "@/features/auth";
import type { UserWithVehicle } from "@/features/users/api/types";
import { useDeleteUser } from "@/features/users/hooks/useUpdateUser";
import { useGetDrivers } from "../../hooks/useGetDrivers";

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
  org: parseAsInteger,
  fleet: parseAsInteger,
};

export const DriversListPage = () => {
  const { user } = useCurrentUser();
  const isAdmin = user?.role === "admin";
  const [{ page, sort, order, search, org, fleet }, setParams] = useQueryStates(
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

  const scopedOrgId =
    user?.role === "gestor_frota"
      ? (user.organization_id ?? undefined)
      : isAdmin
        ? (org ?? undefined)
        : undefined;

  const fleetFilterOrgId =
    user?.role === "gestor_frota"
      ? (user.organization_id ?? undefined)
      : isAdmin
        ? (org ?? undefined)
        : undefined;

  const { data, isLoading, isError, error } = useGetDrivers({
    page,
    pageSize: PAGE_SIZE,
    search: search ?? undefined,
    organizationId: scopedOrgId,
    fleetId: fleet ?? undefined,
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
      {isError ? (
        <p className="text-destructive" role="alert">
          {getToastErrorMessage(error, {
            fallback: "Erro ao carregar motoristas.",
          })}
        </p>
      ) : (
        <>
          <section className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <FilterInput
              placeholder="Buscar por nome ou placa"
              value={search ?? ""}
              onChange={(e) =>
                setParams({ search: e.target.value || null, page: 1 })
              }
              className="lg:flex-1"
            />
            <div className="flex flex-wrap items-center gap-2">
              {isAdmin && (
                <OrganizationsRelationSelect
                  value={org ?? undefined}
                  onValueChange={(value) =>
                    setParams({ org: value ?? null, fleet: null, page: 1 })
                  }
                  placeholder="Todas as organizações"
                  emptyLabel="Todas as organizações"
                  className="w-52"
                />
              )}
              <FleetsRelationSelect
                value={fleet ?? undefined}
                onValueChange={(value) =>
                  setParams({ fleet: value ?? null, page: 1 })
                }
                organizationId={fleetFilterOrgId}
                placeholder="Todas as frotas"
                noneLabel="Todas as frotas"
                className="w-44"
              />
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Cadastrar Motorista
              </Button>
            </div>
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
