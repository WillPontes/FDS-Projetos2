import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowLeft,
  Car,
  DollarSign,
  Fuel,
  Leaf,
  Link2,
  Pencil,
  Ticket,
  Unlink,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { getToastErrorMessage } from "@/lib/api-error";
import { ActionHintPopover } from "@/components/ActionHintPopover";
import { DataTable, entityIdColumn } from "@/components/DataTable";
import { PageLayout } from "@/components/layout/PageLayout";
import { FilterInput } from "@/components/ui/FilterInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KpiCard } from "@/features/sustainability/components/MetricCard";
import type { User } from "@/features/users/api/types";
import { useGetUsers } from "@/features/users/hooks/useGetUsers";
import {
  getOrganizationSummary,
  getOrganizationUsers,
  linkOrganizationUser,
  unlinkOrganizationUser,
  updateOrganization,
} from "../../api/requests";

type OrganizationDetailPageProps = {
  orgId: number;
  orgName: string;
  orgCnpj?: string | null;
};

type OrgFormData = { name: string; cnpj: string };

const makeUserColumns = (onUnlink: (user: User) => void): ColumnDef<User>[] => [
  entityIdColumn<User>(),
  { accessorKey: "name", header: "NOME", enableSorting: true },
  { accessorKey: "email", header: "E-MAIL", enableSorting: true },
  { accessorKey: "role", header: "FUNÇÃO", enableSorting: true },
  {
    id: "actions",
    header: "AÇÕES",
    enableSorting: false,
    cell: ({ row }) => (
      <ActionHintPopover label="Desvincular usuário da organização">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUnlink(row.original)}
          aria-label="Desvincular usuário da organização"
        >
          <Unlink className="h-3 w-3" />
        </Button>
      </ActionHintPopover>
    ),
  },
];

const EditOrgDialog = ({
  open,
  onClose,
  initial,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  initial: OrgFormData;
  onSubmit: (data: OrgFormData) => void;
}) => {
  const [form, setForm] = useState(initial);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Organização</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="org-name">Nome *</Label>
            <Input
              id="org-name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="org-cnpj">CNPJ</Label>
            <Input
              id="org-cnpj"
              value={form.cnpj}
              onChange={(e) => setForm((prev) => ({ ...prev, cnpj: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button
              onClick={() => { onSubmit(form); onClose(); }}
              disabled={!form.name.trim()}
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const OrganizationDetailPage = ({
  orgId,
  orgName,
  orgCnpj,
}: OrganizationDetailPageProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [userSearch, setUserSearch] = useState("");
  const [linkUserOpen, setLinkUserOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { data: summary } = useQuery({
    queryKey: ["organizations", orgId, "summary"],
    queryFn: () => getOrganizationSummary(orgId),
  });

  const { data: orgUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ["organizations", orgId, "users"],
    queryFn: () => getOrganizationUsers(orgId),
  });

  const { data: allUsers } = useGetUsers();

  const updateMutation = useMutation({
    mutationFn: (data: OrgFormData) =>
      updateOrganization(orgId, { name: data.name, cnpj: data.cnpj || undefined }),
    onSuccess: () => {
      toast.success("Organização atualizada.");
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (error) =>
      toast.error(
        getToastErrorMessage(error, {
          fallback: "Erro ao atualizar organização.",
        }),
      ),
  });

  const unlinkMutation = useMutation({
    mutationFn: (userId: number) => unlinkOrganizationUser(orgId, userId),
    onSuccess: () => {
      toast.success("Usuário desvinculado.");
      queryClient.invalidateQueries({ queryKey: ["organizations", orgId, "users"] });
    },
    onError: (error) =>
      toast.error(
        getToastErrorMessage(error, { fallback: "Erro ao desvincular usuário." }),
      ),
  });

  const linkMutation = useMutation({
    mutationFn: (userId: number) => linkOrganizationUser(orgId, userId),
    onSuccess: () => {
      toast.success("Usuário vinculado.");
      queryClient.invalidateQueries({ queryKey: ["organizations", orgId, "users"] });
      setLinkUserOpen(false);
    },
    onError: (error) =>
      toast.error(
        getToastErrorMessage(error, { fallback: "Erro ao vincular usuário." }),
      ),
  });

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return orgUsers;
    const q = userSearch.toLowerCase();
    return orgUsers.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [orgUsers, userSearch]);

  const orgUserIds = new Set(orgUsers.map((u) => u.id));
  const linkableUsers = (allUsers ?? []).filter((u) => !orgUserIds.has(u.id));

  return (
    <PageLayout
      title={`#${orgId} · ${orgName}`}
      description={orgCnpj ? `CNPJ: ${orgCnpj}` : "Detalhes da organização."}
    >
      <div className="mb-2 flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate({ to: "/organizacoes" })}>
          <ArrowLeft className="mr-1 h-3 w-3" />
          Organizações
        </Button>
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          <Pencil className="mr-1 h-3 w-3" />
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard title="VEÍCULOS" value={summary?.vehicle_count ?? "—"} icon={<Car className="text-[#72C215]" size={24} />} />
        <KpiCard title="PESSOAS" value={summary?.driver_count ?? "—"} icon={<Users className="text-[#72C215]" size={24} />} />
        <KpiCard title="PASSAGENS" value={summary?.transaction_count ?? "—"} icon={<Ticket className="text-[#72C215]" size={24} />} />
        <KpiCard title="CO₂ EVITADO (KG)" value={summary != null ? summary.co2_total_kg.toFixed(1) : "—"} icon={<Leaf className="text-[#72C215]" size={24} />} />
        <KpiCard title="COMBUSTÍVEL (L)" value={summary != null ? summary.fuel_total_liters.toFixed(1) : "—"} icon={<Fuel className="text-[#72C215]" size={24} />} />
        <KpiCard title="ECONOMIA (R$)" value={summary != null ? `R$ ${summary.total_savings_brl.toFixed(0)}` : "—"} icon={<DollarSign className="text-[#72C215]" size={24} />} />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <FilterInput
            placeholder="Buscar por nome ou e-mail"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button size="sm" onClick={() => setLinkUserOpen(true)}>
            <Link2 className="mr-1 h-3 w-3" />
            Vincular Pessoa
          </Button>
        </div>
        <DataTable
          columns={makeUserColumns((u) => unlinkMutation.mutate(u.id))}
          data={filteredUsers}
          isLoading={usersLoading}
        />
      </section>

      <EditOrgDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={{ name: orgName, cnpj: orgCnpj ?? "" }}
        onSubmit={(data) => updateMutation.mutate(data)}
      />

      <Dialog open={linkUserOpen} onOpenChange={setLinkUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vincular Pessoa</DialogTitle>
          </DialogHeader>
          <div className="max-h-64 space-y-1 overflow-y-auto">
            {linkableUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-neutral-100"
                onClick={() => linkMutation.mutate(u.id)}
              >
                <span>#{u.id} · {u.name}</span>
                <Link2 className="h-3 w-3 text-neutral-400" />
              </button>
            ))}
            {linkableUsers.length === 0 && (
              <p className="text-sm text-neutral-500">Nenhum usuário disponível.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};
