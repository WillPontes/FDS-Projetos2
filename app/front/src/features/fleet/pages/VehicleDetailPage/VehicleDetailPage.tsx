import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef, OnChangeFn, PaginationState } from "@tanstack/react-table";
import { ArrowLeft, Coins, Fuel, Leaf, Scroll, Ticket } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { DataTable, entityIdColumn } from "@/components/DataTable";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE } from "@/constants";
import { KpiCard, SectionCard } from "@/features/sustainability/components/MetricCard";
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
import { getVehicle, getVehicleTransactionsFiltered, getVehicleSummary } from "../../api/requests";
import type { VehicleTransaction } from "../../api/types";
import { VehicleFormDialog } from "../../components/VehicleFormDialog/VehicleFormDialog";
import { VEHICLE_CATEGORY_LABELS } from "../../constants";

type VehicleDetailPageProps = {
  vehicleId: number;
};

const transactionColumns: ColumnDef<VehicleTransaction>[] = [
  entityIdColumn<VehicleTransaction>(),
  {
    accessorKey: "plate",
    header: "PLACA",
    cell: ({ row }) => row.original.plate ?? "—",
  },
  { accessorKey: "context", header: "CONTEXTO" },
  { accessorKey: "uf", header: "UF", cell: ({ row }) => row.original.uf ?? "—" },
  {
    accessorKey: "co2_avoided_kg",
    header: "CO₂ Evitado (kg)",
    cell: ({ row }) =>
      row.original.co2_avoided_kg != null
        ? row.original.co2_avoided_kg.toFixed(3)
        : "—",
  },
  {
    accessorKey: "fuel_saved_liters",
    header: "Comb. (L)",
    cell: ({ row }) =>
      row.original.fuel_saved_liters != null
        ? row.original.fuel_saved_liters.toFixed(3)
        : "—",
  },
  {
    accessorKey: "financial_savings_brl",
    header: "Economia (R$)",
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

const InfoRow = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div className="flex justify-between border-b border-neutral-100 py-2 text-sm last:border-0">
    <span className="text-neutral-500">{label}</span>
    <span className="font-medium text-neutral-900">{value ?? "—"}</span>
  </div>
);

const fuelLabels: Record<string, string> = {
  diesel_s10: "Diesel S10",
  gasolina_c: "Gasolina C",
  etanol: "Etanol",
};

export const VehicleDetailPage = ({ vehicleId }: VehicleDetailPageProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [txPage, setTxPage] = useState(1);
  const [txFilters, setTxFilters] = useState<TransactionFilterState>({});
  const [editOpen, setEditOpen] = useState(false);

  const { data: vehicle, isLoading: vehicleLoading } = useQuery({
    queryKey: ["vehicles", vehicleId],
    queryFn: () => getVehicle(vehicleId),
  });

  const { data: summary } = useQuery({
    queryKey: ["vehicles", vehicleId, "summary"],
    queryFn: () => getVehicleSummary(vehicleId),
  });

  const filters = {
    context: txFilters.context,
    uf: txFilters.uf,
    fromDate: txFilters.dateRange?.from ? format(txFilters.dateRange.from, "yyyy-MM-dd") : undefined,
    toDate: txFilters.dateRange?.to ? format(txFilters.dateRange.to, "yyyy-MM-dd") : undefined,
  };

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ["vehicles", vehicleId, "transactions", txPage, filters],
    queryFn: () => getVehicleTransactionsFiltered(vehicleId, txPage, PAGE_SIZE, filters),
  });

  const txPagination: PaginationState = {
    pageIndex: txPage - 1,
    pageSize: PAGE_SIZE,
  };

  const handleTxPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(txPagination) : updater;
    setTxPage(next.pageIndex + 1);
  };

  const handleFiltersChange = (f: TransactionFilterState) => {
    setTxFilters(f);
    setTxPage(1);
  };

  return (
    <PageLayout
      title={vehicleLoading ? "Carregando…" : (vehicle?.model ?? "Veículo")}
      description={vehicle ? `${vehicle.license_plate} · ${fuelLabels[vehicle.fuel_type] ?? vehicle.fuel_type}` : "Detalhes do veículo."}
    >
      <div className="mb-2">
        <Button variant="outline" size="sm" onClick={() => navigate({ to: "/frota" })}>
          <ArrowLeft className="mr-1 h-3 w-3" />
          Veículos
        </Button>
      </div>

      <SectionCard title="Informações">
        <InfoRow label="TAG ID" value={vehicle?.id_tag} />
        <InfoRow label="Placa" value={vehicle?.license_plate} />
        <InfoRow label="Modelo" value={vehicle?.model} />
        <InfoRow
          label="Combustível"
          value={vehicle?.fuel_type ? fuelLabels[vehicle.fuel_type] ?? vehicle.fuel_type : undefined}
        />
        <InfoRow
          label="Categoria"
          value={
            vehicle?.category
              ? VEHICLE_CATEGORY_LABELS[vehicle.category] ?? vehicle.category
              : undefined
          }
        />
        <InfoRow
          label="Autonomia média (km/L)"
          value={
            vehicle?.average_autonomy_km != null
              ? String(vehicle.average_autonomy_km)
              : undefined
          }
        />
        <div className="mt-3 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            Editar veículo
          </Button>
        </div>
      </SectionCard>

      {vehicle && (
        <VehicleFormDialog
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            queryClient.invalidateQueries({ queryKey: ["vehicles", vehicleId] });
          }}
          vehicle={vehicle}
        />
      )}

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard
          title={KPI_TITLES.passages}
          value={formatKpiCount(summary?.transaction_count)}
          icon={<Ticket className="text-[#72C215]" size={KPI_ICON_SIZE} />}
        />
        <KpiCard
          title={KPI_TITLES.co2Avoided}
          value={formatKpiCo2(summary?.co2_total_kg)}
          icon={<Leaf className="text-[#72C215]" size={KPI_ICON_SIZE} />}
        />
        <KpiCard
          title={KPI_TITLES.fuelSaved}
          value={formatKpiFuel(summary?.fuel_total_liters)}
          icon={<Fuel className="text-[#72C215]" size={KPI_ICON_SIZE} />}
        />
        <KpiCard
          title={KPI_TITLES.paperSaved}
          value={formatKpiPaper(summary?.paper_saved_meters)}
          icon={<Scroll className="text-[#72C215]" size={KPI_ICON_SIZE} />}
        />
        <KpiCard
          title={KPI_TITLES.financialSavings}
          value={formatEnvironmentalFinancial(summary ?? {})}
          icon={<Coins className="text-[#72C215]" size={KPI_ICON_SIZE} />}
        />
      </div>

      <SectionCard title="Passagens">
        <div className="mb-3">
          <TransactionFilters filters={txFilters} onChange={handleFiltersChange} />
        </div>
        <DataTable
          columns={transactionColumns}
          data={txData?.items ?? []}
          isLoading={txLoading}
          pageCount={txData ? Math.ceil(txData.total / PAGE_SIZE) : undefined}
          pagination={txPagination}
          onPaginationChange={handleTxPaginationChange}
        />
      </SectionCard>
    </PageLayout>
  );
};
