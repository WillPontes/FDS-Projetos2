import { Link, Navigate } from "@tanstack/react-router";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/DataTable";
import { PageLayout } from "@/components/layout/PageLayout";
import { PAGE_SIZE } from "@/constants";
import { useCurrentUser } from "@/features/auth";
import type { User } from "../../api/types";
import { USER_ROLE_LABELS, USER_ROLE_OPTIONS } from "../../constants";
import { useGetUsersFiltered } from "../../hooks/useGetUsersFiltered";
import { useDeleteUser } from "../../hooks/useUpdateUser";

const columns = (onDelete: (user: User) => void): ColumnDef<User>[] => [
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
    accessorKey: "role",
    header: "Perfil",
    enableSorting: true,
    cell: ({ row }) => (
      <Badge variant="outline">{USER_ROLE_LABELS[row.original.role]}</Badge>
    ),
  },
  {
    accessorKey: "organization_id",
    header: "Organização",
    enableSorting: true,
    cell: ({ row }) => row.original.organization_id ?? "—",
  },
  {
    id: "actions",
    header: "Ações",
    enableSorting: false,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/usuarios/editar/$id" params={{ id: String(user.id) }}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onDelete(user)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

const usersSearchParams = {
  page: parseAsInteger.withDefault(1),
  sort: parseAsString,
  order: parseAsStringEnum(["asc", "desc"] as const).withDefault("asc"),
  search: parseAsString,
  role: parseAsStringEnum([
    "all",
    "motorista",
    "gestor_frota",
    "admin",
  ] as const).withDefault("all"),
};

export const UsersListPage = () => {
  const { user, isAuthenticated } = useCurrentUser();
  const [{ page, sort, order, search, role }, setParams] = useQueryStates(
    usersSearchParams,
    { history: "replace" },
  );
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: PAGE_SIZE,
  };
  const sorting: SortingState = sort
    ? [{ id: sort, desc: order === "desc" }]
    : [];

  const { data, isLoading, isError, error } = useGetUsersFiltered({
    page,
    pageSize: PAGE_SIZE,
    search: search ?? undefined,
    role,
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
    if (!userToDelete) return;
    deleteUser(userToDelete.id, {
      onSuccess: () => setUserToDelete(null),
    });
  };

  if (!isAuthenticated || !user) {
    return <Navigate to="/" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/perfil" />;
  }

  return (
    <PageLayout
      title="Usuários"
      description="Gerencie os usuários do sistema, com busca e filtro por perfil."
    >
      {isError ? (
        <p className="text-destructive" role="alert">
          {error instanceof Error
            ? error.message
            : "Erro ao carregar usuários."}
        </p>
      ) : (
        <>
          <section className="flex flex-col gap-4 md:flex-row md:items-center">
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail"
              value={search ?? ""}
              onChange={(e) =>
                setParams({ search: e.target.value || null, page: 1 })
              }
              className="h-10 w-full rounded-md border border-neutral-300 bg-neutral-100 px-4 py-2 text-sm outline-none md:flex-1"
            />
            <Select
              value={role}
              onValueChange={(value) =>
                setParams({
                  role: value as typeof role,
                  page: 1,
                })
              }
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por perfil" />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          <DataTable
            columns={columns(setUserToDelete)}
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
        open={userToDelete != null}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir{" "}
              <strong>{userToDelete?.name}</strong>? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setUserToDelete(null)}
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
