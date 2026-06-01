import { useQuery } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-router";
import { UserFormDialog } from "../../components/UserFormDialog/UserFormDialog";
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
import { ActionHintPopover } from "@/components/ActionHintPopover";
import { DataTable, entityIdColumn } from "@/components/DataTable";
import { PageLayout } from "@/components/layout/PageLayout";
import { PAGE_SIZE } from "@/constants";
import { useCurrentUser } from "@/features/auth";
import { getOrganizations } from "@/features/fleet/api/requests";
import type { User } from "../../api/types";
import { USER_ROLE_LABELS, USER_ROLE_OPTIONS } from "../../constants";
import { useGetUsersFiltered } from "../../hooks/useGetUsersFiltered";
import { useDeleteUser } from "../../hooks/useUpdateUser";

const columns = (onDelete: (user: User) => void, onEdit: (user: User) => void): ColumnDef<User>[] => [
  entityIdColumn<User>(),
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
          <ActionHintPopover label="Editar usuário">
            <Button variant="outline" size="sm" onClick={() => onEdit(user)} aria-label="Editar usuário">
              <Pencil className="h-4 w-4" />
            </Button>
          </ActionHintPopover>
          <ActionHintPopover label="Excluir usuário">
            <Button type="button" variant="outline" size="sm" onClick={() => onDelete(user)} aria-label="Excluir usuário">
              <Trash className="h-4 w-4" />
            </Button>
          </ActionHintPopover>
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
  org: parseAsInteger,
};

export const UsersListPage = () => {
  const { user, isAuthenticated } = useCurrentUser();
  const { data: orgs } = useQuery({ queryKey: ["organizations"], queryFn: getOrganizations });
  const [{ page, sort, order, search, role, org }, setParams] = useQueryStates(
    usersSearchParams,
    { history: "replace" },
  );
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
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
    organizationId: org ?? "all",
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
                setParams({ role: value as typeof role, page: 1 })
              }
            >
              <SelectTrigger className="w-full md:w-44">
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
            <Select
              value={org != null ? String(org) : "all"}
              onValueChange={(v) =>
                setParams({ org: v === "all" ? null : Number(v), page: 1 })
              }
            >
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="Todas as organizações" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as organizações</SelectItem>
                {orgs?.map((o) => (
                  <SelectItem key={o.id} value={String(o.id)}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setCreateOpen(true)} className="shrink-0">
              <Plus className="mr-1 h-4 w-4" />
              Novo Usuário
            </Button>
          </section>

          <DataTable
            columns={columns(setUserToDelete, setUserToEdit)}
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

      {userToEdit && (
        <UserFormDialog
          open={!!userToEdit}
          onClose={() => setUserToEdit(null)}
          user={userToEdit}
        />
      )}

      <UserFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

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
