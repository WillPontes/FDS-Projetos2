import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Pencil, Plus, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
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
import type { ColumnDef } from "@tanstack/react-table";
import {
  createOrganization,
  deleteOrganization,
  getOrganizations,
  updateOrganization,
} from "../../api/requests";
import type { Organization } from "../../api/types";

type OrgFormData = { name: string; cnpj: string };

const defaultForm: OrgFormData = { name: "", cnpj: "" };

const OrgFormDialog = ({
  open,
  onClose,
  initial,
  onSubmit,
  title,
}: {
  open: boolean;
  onClose: () => void;
  initial?: OrgFormData;
  onSubmit: (data: OrgFormData) => void;
  title: string;
}) => {
  const [form, setForm] = useState<OrgFormData>(initial ?? defaultForm);

  const handleChange = (field: keyof OrgFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="org-name">Nome *</Label>
            <Input
              id="org-name"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Nome da organização"
            />
          </div>
          <div>
            <Label htmlFor="org-cnpj">CNPJ</Label>
            <Input
              id="org-cnpj"
              value={form.cnpj}
              onChange={handleChange("cnpj")}
              placeholder="00.000.000/0000-00"
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

export const OrganizationsPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Organization | null>(null);

  const { data: orgs = [], isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return orgs;
    const q = search.toLowerCase();
    return orgs.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        (o.cnpj ?? "").toLowerCase().includes(q) ||
        String(o.id).includes(q),
    );
  }, [orgs, search]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["organizations"] });

  const createMutation = useMutation({
    mutationFn: (data: OrgFormData) =>
      createOrganization({ name: data.name, cnpj: data.cnpj || undefined }),
    onSuccess: () => { toast.success("Organização criada."); invalidate(); },
    onError: () => toast.error("Erro ao criar organização."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: OrgFormData }) =>
      updateOrganization(id, { name: data.name, cnpj: data.cnpj || undefined }),
    onSuccess: () => { toast.success("Organização atualizada."); invalidate(); },
    onError: () => toast.error("Erro ao atualizar organização."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteOrganization(id),
    onSuccess: () => { toast.success("Organização removida."); invalidate(); },
    onError: () => toast.error("Erro ao remover organização."),
  });

  const columns: ColumnDef<Organization>[] = [
    entityIdColumn<Organization>(),
    { accessorKey: "name", header: "NOME", enableSorting: true },
    { accessorKey: "cnpj", header: "CNPJ", cell: ({ row }) => row.original.cnpj ?? "—" },
    {
      accessorKey: "created_at",
      header: "CRIADO EM",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString("pt-BR"),
    },
    {
      id: "actions",
      header: "AÇÕES",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/organizacoes/$id" params={{ id: String(row.original.id) }}>
              Ver
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditTarget(row.original)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteMutation.mutate(row.original.id)}
          >
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="Organizações"
      description="Gerencie as organizações do sistema."
    >
      <div className="flex items-center justify-between gap-3">
        <FilterInput
          placeholder="Buscar por nome, CNPJ ou ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Nova Organização
        </Button>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={isLoading} />

      <OrgFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Nova Organização"
        onSubmit={(data) => createMutation.mutate(data)}
      />

      {editTarget && (
        <OrgFormDialog
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          title="Editar Organização"
          initial={{ name: editTarget.name, cnpj: editTarget.cnpj ?? "" }}
          onSubmit={(data) => updateMutation.mutate({ id: editTarget.id, data })}
        />
      )}
    </PageLayout>
  );
};
