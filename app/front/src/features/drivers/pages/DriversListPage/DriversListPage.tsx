import { Link } from "@tanstack/react-router";
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
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
import { DataTable } from "@/components/DataTable";
import { PageLayout } from "@/components/layout/PageLayout";
import { PAGE_SIZE } from "@/constants";
import type { UserWithVehicle } from "@/features/users/api/types";
import { useDeleteUser } from "@/features/users/hooks/useUpdateUser";
import { useGetDrivers } from "../../hooks/useGetDrivers";

const columns = (
  onDelete: (driver: UserWithVehicle) => void,
): ColumnDef<UserWithVehicle>[] => [
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
          <Button asChild variant="outline" size="sm">
            <Link
              to="/motoristas/editar/$id"
              params={{ id: String(driver.id) }}
            >
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onDelete(driver)}
          >
            <Trash className="h-4 w-4" />
          </Button>
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
  const [{ page, sort, order, search }, setParams] = useQueryStates(
    driversSearchParams,
    { history: "replace" },
  );
  const [driverToDelete, setDriverToDelete] = useState<UserWithVehicle | null>(
    null,
  );
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
      {isError ? (
        <p className="text-destructive" role="alert">
          {error instanceof Error
            ? error.message
            : "Erro ao carregar motoristas."}
        </p>
      ) : (
        <>
          <section className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Buscar por nome ou placa"
              value={search ?? ""}
              onChange={(e) =>
                setParams({ search: e.target.value || null, page: 1 })
              }
              className="h-10 w-full rounded-md border border-neutral-300 bg-neutral-100 px-4 py-2 text-sm outline-none"
            />
          </section>

          <DataTable
            columns={columns(setDriverToDelete)}
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
