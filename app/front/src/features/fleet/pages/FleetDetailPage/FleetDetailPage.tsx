import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import type { ColumnDef, OnChangeFn, PaginationState } from "@tanstack/react-table";
import { ArrowLeft, Car, Coins, Fuel, Leaf, Link2, Scroll, Ticket, Unlink, Users } from "lucide-react";
import { format } from "date-fns";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PAGE_SIZE } from "@/constants";
import { KpiCard } from "@/features/sustainability/components/MetricCard";
import {
  formatEnvironmentalFinancial,
  formatKpiCo2,
  formatKpiCount,
  formatKpiFuel,
  formatKpiPaper,
  KPI_ICON_SIZE,
  KPI_TITLES,
} from "@/features/sustainability/lib/kpi";
import { TransactionFilters } from "@/components/TransactionFilters/TransactionFilters";
import type { TransactionFilterState } from "@/components/TransactionFilters/TransactionFilters";
import {
  UsersRelationSelect,
  VehiclesRelationSelect,
} from "@/components/form/relation-selects";
import type { User } from "@/features/users/api/types";
import {
  getFleetSummary,
  getFleetTransactions,
  getFleetUsers,
  getFleetVehicles,
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
  const [selectedLinkVehicleId, setSelectedLinkVehicleId] = useState<number | undefined>();
  const [selectedLinkUserId, setSelectedLinkUserId] = useState<number | undefined>();

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
    onError: (error) =>
      toast.error(
        getToastErrorMessage(error, { fallback: "Erro ao desvincular veículo." }),
      ),
  });

  const linkVehicleMutation = useMutation({
    mutationFn: (vehicleId: number) => linkFleetVehicle(fleetId, vehicleId),
    onSuccess: () => {
      toast.success("Veículo vinculado.");
      invalidateFleet();
      setLinkVehicleOpen(false);
      setSelectedLinkVehicleId(undefined);
    },
    onError: (error) =>
      toast.error(
        getToastErrorMessage(error, { fallback: "Erro ao vincular veículo." }),
      ),
  });

  const unlinkUserMutation = useMutation({
    mutationFn: (userId: number) => unlinkFleetUser(fleetId, userId),
    onSuccess: () => { toast.success("Usuário desvinculado."); invalidateFleet(); },
    onError: (error) =>
      toast.error(
        getToastErrorMessage(error, { fallback: "Erro ao desvincular usuário." }),
      ),
  });

  const linkUserMutation = useMutation({
    mutationFn: (userId: number) => linkFleetUser(fleetId, userId),
    onSuccess: () => {
      toast.success("Usuário vinculado.");
      invalidateFleet();
      setLinkUserOpen(false);
      setSelectedLinkUserId(undefined);
    },
    onError: (error) =>
      toast.error(
        getToastErrorMessage(error, { fallback: "Erro ao vincular usuário." }),
      ),
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

  const fleetUserIds = fleetUsers.map((u) => u.id);
  const fleetVehicleIds = fleetVehicles.map((v) => v.id);

  return (
    <PageLayout title={`#${fleetId} · ${fleetName}`} description="Detalhes e métricas da frota.">
      <div className="mb-2">
        <Button variant="outline" size="sm" onClick={() => navigate({ to: "/frotas" })}>
          <ArrowLeft className="mr-1 h-3 w-3" />
          Frotas
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-7">
        <KpiCard title={KPI_TITLES.vehicles} value={formatKpiCount(summary?.vehicle_count)} icon={<Car className="text-[#72C215]" size={KPI_ICON_SIZE} />} />
        <KpiCard title={KPI_TITLES.drivers} value={formatKpiCount(summary?.driver_count)} icon={<Users className="text-[#72C215]" size={KPI_ICON_SIZE} />} />
        <KpiCard title={KPI_TITLES.passages} value={formatKpiCount(summary?.transaction_count)} icon={<Ticket className="text-[#72C215]" size={KPI_ICON_SIZE} />} />
        <KpiCard title={KPI_TITLES.co2Avoided} value={formatKpiCo2(summary?.co2_total_kg)} icon={<Leaf className="text-[#72C215]" size={KPI_ICON_SIZE} />} />
        <KpiCard title={KPI_TITLES.fuelSaved} value={formatKpiFuel(summary?.fuel_total_liters)} icon={<Fuel className="text-[#72C215]" size={KPI_ICON_SIZE} />} />
        <KpiCard title={KPI_TITLES.paperSaved} value={formatKpiPaper(summary?.paper_saved_meters)} icon={<Scroll className="text-[#72C215]" size={KPI_ICON_SIZE} />} />
        <KpiCard title={KPI_TITLES.financialSavings} value={formatEnvironmentalFinancial(summary ?? {})} icon={<Coins className="text-[#72C215]" size={KPI_ICON_SIZE} />} />
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

      <Dialog
        open={linkVehicleOpen}
        onOpenChange={(open) => {
          setLinkVehicleOpen(open);
          if (!open) setSelectedLinkVehicleId(undefined);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vincular Veículo</DialogTitle>
          </DialogHeader>
          <VehiclesRelationSelect
            value={selectedLinkVehicleId}
            onValueChange={(value) =>
              setSelectedLinkVehicleId(typeof value === "number" ? value : undefined)
            }
            semFrota
            excludeIds={fleetVehicleIds}
            placeholder="Selecione um veículo sem frota"
            allowEmpty={false}
            className="mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setLinkVehicleOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={selectedLinkVehicleId == null || linkVehicleMutation.isPending}
              onClick={() => {
                if (selectedLinkVehicleId != null) {
                  linkVehicleMutation.mutate(selectedLinkVehicleId);
                }
              }}
            >
              {linkVehicleMutation.isPending ? "Vinculando…" : "Vincular"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={linkUserOpen}
        onOpenChange={(open) => {
          setLinkUserOpen(open);
          if (!open) setSelectedLinkUserId(undefined);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vincular Motorista</DialogTitle>
          </DialogHeader>
          <UsersRelationSelect
            value={selectedLinkUserId}
            onValueChange={setSelectedLinkUserId}
            role="motorista"
            excludeIds={fleetUserIds}
            placeholder="Selecione um motorista"
            allowEmpty={false}
            className="mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setLinkUserOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={selectedLinkUserId == null || linkUserMutation.isPending}
              onClick={() => {
                if (selectedLinkUserId != null) {
                  linkUserMutation.mutate(selectedLinkUserId);
                }
              }}
            >
              {linkUserMutation.isPending ? "Vinculando…" : "Vincular"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};
