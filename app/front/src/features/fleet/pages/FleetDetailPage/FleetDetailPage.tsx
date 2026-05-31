import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import type { ColumnDef, OnChangeFn, PaginationState } from "@tanstack/react-table";
import { ArrowLeft, Car, DollarSign, Fuel, Leaf, Link2, Ticket, Unlink, Users } from "lucide-react";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { toast } from "sonner";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PAGE_SIZE } from "@/constants";
import { KpiCard } from "@/features/sustainability/components/MetricCard";
import { TransactionFilters } from "@/components/TransactionFilters/TransactionFilters";
import type { TransactionFilterState } from "@/components/TransactionFilters/TransactionFilters";
import type { User } from "@/features/users/api/types";
import { useGetUsers } from "@/features/users/hooks/useGetUsers";
import {
  getFleetSummary,
  getFleetTransactions,
  getFleetUsers,
  getFleetVehicles,
  getVehicles,
  linkFleetUser,
  linkFleetVehicle,
  unlinkFleetUser,
  unlinkFleetVehicle,
} from "../../api/requests";
import type { VehicleTransaction } from "../../api/types";
import type { Vehicle } from "../../schemas/vehicle-schema";

type FleetDetailPageProps = {
  fleetId: number;
  fleetName: string;
};

const makeVehicleColumns = (
  onUnlink: (vehicle: Vehicle) => void,
): ColumnDef<Vehicle>[] => [
  entityIdColumn<Vehicle>(),
  { accessorKey: "id_tag", header: "TAG ID", enableSorting: true },
  { accessorKey: "license_plate", header: "PLACA", enableSorting: true },
  { accessorKey: "model", header: "MODELO", enableSorting: true },
  { accessorKey: "fuel_type", header: "COMBUSTÍVEL", enableSorting: true },
  {
    id: "actions",
    header: "AÇÕES",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <ActionHintPopover label="Ver detalhes do veículo">
          <Button asChild variant="outline" size="sm">
            <Link
              to="/frota/$id"
              params={{ id: String(row.original.id) }}
              aria-label="Ver detalhes do veículo"
            >
              Ver
            </Link>
          </Button>
        </ActionHintPopover>
        <ActionHintPopover label="Desvincular veículo da frota">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUnlink(row.original)}
            aria-label="Desvincular veículo da frota"
          >
            <Unlink className="h-3 w-3" />
          </Button>
        </ActionHintPopover>
      </div>
    ),
  },
];

const makeDriverColumns = (
  onUnlink: (user: User) => void,
): ColumnDef<User>[] => [
  entityIdColumn<User>(),
  { accessorKey: "name", header: "NOME", enableSorting: true },
  { accessorKey: "email", header: "E-MAIL", enableSorting: true },
  { accessorKey: "role", header: "FUNÇÃO", enableSorting: true },
  {
    id: "actions",
    header: "AÇÕES",
    enableSorting: false,
    cell: ({ row }) => (
      <ActionHintPopover label="Desvincular motorista da frota">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUnlink(row.original)}
          aria-label="Desvincular motorista da frota"
        >
          <Unlink className="h-3 w-3" />
        </Button>
      </ActionHintPopover>
    ),
  },
];

const transactionColumns: ColumnDef<VehicleTransaction>[] = [
  entityIdColumn<VehicleTransaction>(),
  { accessorKey: "plate", header: "PLACA", cell: ({ row }) => row.original.plate ?? "—" },
  { accessorKey: "context", header: "CONTEXTO" },
  { accessorKey: "uf", header: "UF", cell: ({ row }) => row.original.uf ?? "—" },
  {
    accessorKey: "financial_savings_brl",
    header: "ECONOMIA (R$)",
    cell: ({ row }) =>
      row.original.financial_savings_brl != null
        ? `R$ ${row.original.financial_savings_brl.toFixed(2)}`
        : "—",
  },
  {
    accessorKey: "created_at",
    header: "DATA",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString("pt-BR"),
  },
];

export const FleetDetailPage = ({ fleetId, fleetName }: FleetDetailPageProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [driverSearch, setDriverSearch] = useState("");
  const [txPage, setTxPage] = useState(1);
  const [txFilters, setTxFilters] = useState<TransactionFilterState>({});
  const [linkVehicleOpen, setLinkVehicleOpen] = useState(false);
  const [linkUserOpen, setLinkUserOpen] = useState(false);
  const [linkVehicleSearch, setLinkVehicleSearch] = useState("");

  const { data: summary } = useQuery({
    queryKey: ["fleets", fleetId, "summary"],
    queryFn: () => getFleetSummary(fleetId),
  });

  const { data: fleetVehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ["fleets", fleetId, "vehicles"],
    queryFn: () => getFleetVehicles(fleetId),
  });

  const { data: fleetUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ["fleets", fleetId, "users"],
    queryFn: () => getFleetUsers(fleetId),
  });

  const { data: availableVehicles } = useQuery({
    queryKey: ["vehicles", "sem-frota", linkVehicleSearch],
    queryFn: () =>
      getVehicles({ semFrota: true, search: linkVehicleSearch || undefined, pageSize: 50 }),
    enabled: linkVehicleOpen,
  });

  const { data: orgUsers } = useGetUsers();

  const txApiFilters = {
    context: txFilters.context,
    uf: txFilters.uf,
    fromDate: txFilters.dateRange?.from ? format(txFilters.dateRange.from, "yyyy-MM-dd") : undefined,
    toDate: txFilters.dateRange?.to ? format(txFilters.dateRange.to, "yyyy-MM-dd") : undefined,
  };

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ["fleets", fleetId, "transactions", txPage, txApiFilters],
    queryFn: () => getFleetTransactions(fleetId, txPage, PAGE_SIZE, txApiFilters),
  });

  const txPagination: PaginationState = { pageIndex: txPage - 1, pageSize: PAGE_SIZE };

  const handleTxPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(txPagination) : updater;
    setTxPage(next.pageIndex + 1);
  };

  const invalidateFleet = () => {
    queryClient.invalidateQueries({ queryKey: ["fleets", fleetId] });
  };

  const unlinkVehicleMutation = useMutation({
    mutationFn: (vehicleId: number) => unlinkFleetVehicle(fleetId, vehicleId),
    onSuccess: () => { toast.success("Veículo desvinculado."); invalidateFleet(); },
    onError: () => toast.error("Erro ao desvincular veículo."),
  });

  const linkVehicleMutation = useMutation({
    mutationFn: (vehicleId: number) => linkFleetVehicle(fleetId, vehicleId),
    onSuccess: () => {
      toast.success("Veículo vinculado.");
      invalidateFleet();
      setLinkVehicleOpen(false);
    },
    onError: () => toast.error("Erro ao vincular veículo."),
  });

  const unlinkUserMutation = useMutation({
    mutationFn: (userId: number) => unlinkFleetUser(fleetId, userId),
    onSuccess: () => { toast.success("Usuário desvinculado."); invalidateFleet(); },
    onError: () => toast.error("Erro ao desvincular usuário."),
  });

  const linkUserMutation = useMutation({
    mutationFn: (userId: number) => linkFleetUser(fleetId, userId),
    onSuccess: () => {
      toast.success("Usuário vinculado.");
      invalidateFleet();
      setLinkUserOpen(false);
    },
    onError: () => toast.error("Erro ao vincular usuário."),
  });

  const filteredVehicles = useMemo(() => {
    if (!vehicleSearch.trim()) return fleetVehicles;
    const q = vehicleSearch.toLowerCase();
    return fleetVehicles.filter(
      (v) =>
        v.license_plate.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.id_tag.toLowerCase().includes(q),
    );
  }, [fleetVehicles, vehicleSearch]);

  const filteredDrivers = useMemo(() => {
    if (!driverSearch.trim()) return fleetUsers;
    const q = driverSearch.toLowerCase();
    return fleetUsers.filter((u) => u.name.toLowerCase().includes(q));
  }, [fleetUsers, driverSearch]);

  const fleetUserIds = new Set(fleetUsers.map((u) => u.id));
  const linkableUsers = (orgUsers ?? []).filter((u) => !fleetUserIds.has(u.id));

  return (
    <PageLayout title={`#${fleetId} · ${fleetName}`} description="Detalhes e métricas da frota.">
      <div className="mb-2">
        <Button variant="outline" size="sm" onClick={() => navigate({ to: "/frotas" })}>
          <ArrowLeft className="mr-1 h-3 w-3" />
          Frotas
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard title="VEÍCULOS" value={summary?.vehicle_count ?? "—"} icon={<Car className="text-[#72C215]" size={24} />} />
        <KpiCard title="MOTORISTAS" value={summary?.driver_count ?? "—"} icon={<Users className="text-[#72C215]" size={24} />} />
        <KpiCard title="PASSAGENS" value={summary?.transaction_count ?? "—"} icon={<Ticket className="text-[#72C215]" size={24} />} />
        <KpiCard title="CO₂ EVITADO (KG)" value={summary != null ? summary.co2_total_kg.toFixed(1) : "—"} icon={<Leaf className="text-[#72C215]" size={24} />} />
        <KpiCard title="COMBUSTÍVEL (L)" value={summary != null ? summary.fuel_total_liters.toFixed(1) : "—"} icon={<Fuel className="text-[#72C215]" size={24} />} />
        <KpiCard title="ECONOMIA (R$)" value={summary != null ? `R$ ${summary.total_savings_brl.toFixed(0)}` : "—"} icon={<DollarSign className="text-[#72C215]" size={24} />} />
      </div>

      <Tabs defaultValue="vehicles">
        <TabsList>
          <TabsTrigger value="vehicles">Veículos</TabsTrigger>
          <TabsTrigger value="drivers">Motoristas</TabsTrigger>
          <TabsTrigger value="passagens">Passagens</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles">
          <div className="mb-3 flex items-center justify-between gap-2">
            <FilterInput
              placeholder="Buscar por placa ou modelo"
              value={vehicleSearch}
              onChange={(e) => setVehicleSearch(e.target.value)}
              className="max-w-xs"
            />
            <Button size="sm" onClick={() => setLinkVehicleOpen(true)}>
              <Link2 className="mr-1 h-3 w-3" />
              Vincular Veículo
            </Button>
          </div>
          <DataTable
            columns={makeVehicleColumns((v) => unlinkVehicleMutation.mutate(v.id))}
            data={filteredVehicles}
            isLoading={vehiclesLoading}
          />
        </TabsContent>

        <TabsContent value="drivers">
          <div className="mb-3 flex items-center justify-between gap-2">
            <FilterInput
              placeholder="Buscar por nome"
              value={driverSearch}
              onChange={(e) => setDriverSearch(e.target.value)}
              className="max-w-xs"
            />
            <Button size="sm" onClick={() => setLinkUserOpen(true)}>
              <Link2 className="mr-1 h-3 w-3" />
              Vincular Motorista
            </Button>
          </div>
          <DataTable
            columns={makeDriverColumns((u) => unlinkUserMutation.mutate(u.id))}
            data={filteredDrivers}
            isLoading={usersLoading}
          />
        </TabsContent>

        <TabsContent value="passagens">
          <div className="mb-3">
            <TransactionFilters filters={txFilters} onChange={(f) => { setTxFilters(f); setTxPage(1); }} />
          </div>
          <DataTable
            columns={transactionColumns}
            data={txData?.items ?? []}
            isLoading={txLoading}
            pageCount={txData ? Math.ceil(txData.total / PAGE_SIZE) : undefined}
            pagination={txPagination}
            onPaginationChange={handleTxPaginationChange}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={linkVehicleOpen} onOpenChange={setLinkVehicleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vincular Veículo</DialogTitle>
          </DialogHeader>
          <FilterInput
            placeholder="Buscar veículo sem frota"
            value={linkVehicleSearch}
            onChange={(e) => setLinkVehicleSearch(e.target.value)}
            className="mb-3"
          />
          <div className="max-h-64 space-y-1 overflow-y-auto">
            {(availableVehicles?.items ?? []).map((v) => (
              <button
                key={v.id}
                type="button"
                className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-neutral-100"
                onClick={() => linkVehicleMutation.mutate(v.id)}
              >
                <span>#{v.id} · {v.license_plate} · {v.model}</span>
                <Link2 className="h-3 w-3 text-neutral-400" />
              </button>
            ))}
            {(availableVehicles?.items ?? []).length === 0 && (
              <p className="text-sm text-neutral-500">Nenhum veículo disponível.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={linkUserOpen} onOpenChange={setLinkUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vincular Motorista</DialogTitle>
          </DialogHeader>
          <div className="max-h-64 space-y-1 overflow-y-auto">
            {linkableUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-neutral-100"
                onClick={() => linkUserMutation.mutate(u.id)}
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
