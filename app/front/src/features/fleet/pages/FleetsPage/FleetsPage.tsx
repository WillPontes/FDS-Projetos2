import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { PageLayout } from "@/components/layout/PageLayout";
import { FilterInput } from "@/components/ui/FilterInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/features/auth";
import { OrganizationsCombobox } from "../../components/OrganizationsCombobox/OrganizationsCombobox";
import { createFleet, getFleets, getFleetSummary } from "../../api/requests";
import type { Fleet } from "../../api/types";

const FleetCard = ({ fleet }: { fleet: Fleet }) => {
  const { data: summary } = useQuery({
    queryKey: ["fleets", fleet.id, "summary"],
    queryFn: () => getFleetSummary(fleet.id),
  });

  return (
    <Link to="/frotas/$fleetId" params={{ fleetId: String(fleet.id) }}>
      <Card className="cursor-pointer transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-neutral-500">#{fleet.id}</p>
              <p className="font-semibold text-neutral-900">{fleet.name}</p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <StatMini label="Veículos" value={summary?.vehicle_count ?? "—"} />
            <StatMini label="Motoristas" value={summary?.driver_count ?? "—"} />
            <StatMini label="Passagens" value={summary?.transaction_count ?? "—"} />
            <StatMini label="CO₂ (kg)" value={summary ? summary.co2_total_kg.toFixed(1) : "—"} />
            <StatMini label="Combustível (L)" value={summary ? summary.fuel_total_liters.toFixed(1) : "—"} />
            <StatMini label="Economia (R$)" value={summary ? `R$ ${summary.total_savings_brl.toFixed(0)}` : "—"} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const StatMini = ({ label, value }: { label: string; value: number | string }) => (
  <div className="rounded-md border border-neutral-200 bg-neutral-50 p-2 text-center">
    <p className="text-sm font-semibold text-neutral-900">{value}</p>
    <p className="text-xs text-neutral-500">{label}</p>
  </div>
);

const CreateFleetDialog = ({
  open,
  onClose,
  defaultOrganizationId,
  isAdmin,
}: {
  open: boolean;
  onClose: () => void;
  defaultOrganizationId?: number;
  isAdmin: boolean;
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [organizationId, setOrganizationId] = useState<number | undefined>(defaultOrganizationId);

  const mutation = useMutation({
    mutationFn: () => {
      const orgId = isAdmin ? organizationId : defaultOrganizationId;
      if (orgId == null) throw new Error("Organização é obrigatória.");
      return createFleet({ name, organization_id: orgId });
    },
    onSuccess: () => {
      toast.success("Frota criada com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["fleets"] });
      setName("");
      onClose();
    },
    onError: () => toast.error("Erro ao criar frota."),
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Frota</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fleet-name">Nome *</Label>
            <Input
              id="fleet-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome da frota"
            />
          </div>
          {isAdmin && (
            <div className="space-y-1">
              <Label>Organização *</Label>
              <OrganizationsCombobox
                value={organizationId}
                onValueChange={setOrganizationId}
                placeholder="Selecione a organização"
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button
              onClick={() => mutation.mutate()}
              disabled={!name.trim() || mutation.isPending || (isAdmin && organizationId == null)}
            >
              {mutation.isPending ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const FleetsPage = () => {
  const { user } = useCurrentUser();
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const organizationId =
    user?.role === "gestor_frota" ? user.organization_id ?? undefined : undefined;

  const { data: fleets, isLoading } = useQuery({
    queryKey: ["fleets", organizationId, search],
    queryFn: () => getFleets({ organizationId, search: search || undefined }),
  });

  const filtered = useMemo(() => {
    if (!fleets) return [];
    if (!search.trim()) return fleets;
    const q = search.toLowerCase();
    return fleets.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        String(f.id).includes(q),
    );
  }, [fleets, search]);

  return (
    <PageLayout title="Frotas" description="Visualize e gerencie todas as frotas cadastradas.">
      <div className="flex items-center gap-3">
        <FilterInput
          placeholder="Buscar frota por nome ou ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Nova Frota
        </Button>
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Carregando frotas…</p>}
      {!isLoading && filtered.length === 0 && (
        <p className="text-sm text-neutral-500">Nenhuma frota encontrada.</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((fleet) => <FleetCard key={fleet.id} fleet={fleet} />)}
      </div>

      <CreateFleetDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        defaultOrganizationId={organizationId}
        isAdmin={user?.role === "admin"}
      />
    </PageLayout>
  );
};
