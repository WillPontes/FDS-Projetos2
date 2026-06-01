import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import type { ColumnDef, OnChangeFn, PaginationState } from "@tanstack/react-table";
import { ArrowLeft, Coins, Fuel, Leaf, Scroll, Ticket } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { DataTable, entityIdColumn } from "@/components/DataTable";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE } from "@/constants";
import { getUserById } from "@/features/users/api/requests";
import { getUserTransactions } from "@/features/fleet/api/requests";
import type { VehicleTransaction } from "@/features/fleet/api/types";
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
import { api } from "@/lib/http-client";

type DriverDetailPageProps = {
  driverId: number;
};

type UserStats = {
  co2_total_kg: number;
  fuel_total_liters: number;
  financial_total_brl: number;
  transactions_count: number;
  total_time_saved_sec: number;
  paper_saved_meters: number;
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

const roleLabels: Record<string, string> = {
  motorista: "Motorista",
  gestor_frota: "Gestor de Frota",
  admin: "Administrador",
};

export const DriverDetailPage = ({ driverId }: DriverDetailPageProps) => {
  const navigate = useNavigate();
  const [txPage, setTxPage] = useState(1);
  const [txFilters, setTxFilters] = useState<TransactionFilterState>({});

  const { data: driver, isLoading: driverLoading } = useQuery({
    queryKey: ["users", driverId],
    queryFn: () => getUserById(driverId),
  });

  const { data: stats } = useQuery({
    queryKey: ["user-stats", driverId],
    queryFn: () => api.get(`/api/user-stats/${driverId}`).json<UserStats>(),
  });

  const filters = {
    plate: txFilters.plate,
    context: txFilters.context,
    uf: txFilters.uf,
    fromDate: txFilters.dateRange?.from ? format(txFilters.dateRange.from, "yyyy-MM-dd") : undefined,
    toDate: txFilters.dateRange?.to ? format(txFilters.dateRange.to, "yyyy-MM-dd") : undefined,
  };

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ["transactions", "user", driverId, txPage, filters],
    queryFn: () => getUserTransactions(driverId, txPage, PAGE_SIZE, filters),
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
      title={driverLoading ? "Carregando…" : (driver?.name ?? "Motorista")}
      description="Detalhes e histórico do motorista."
    >
      <div className="mb-2">
        <Button variant="outline" size="sm" onClick={() => navigate({ to: "/motoristas" })}>
          <ArrowLeft className="mr-1 h-3 w-3" />
          Motoristas
        </Button>
      </div>

      <SectionCard title="Informações">
        <InfoRow label="Nome" value={driver?.name} />
        <InfoRow label="E-mail" value={driver?.email} />
        <InfoRow
          label="Função"
          value={driver?.role ? roleLabels[driver.role] ?? driver.role : undefined}
        />
        <div className="mt-3 flex justify-end">
          <Button asChild variant="outline" size="sm">
            <Link to="/motoristas/editar/$id" params={{ id: String(driverId) }}>
              Editar motorista
            </Link>
          </Button>
        </div>
      </SectionCard>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard
          title={KPI_TITLES.passages}
          value={formatKpiCount(stats?.transactions_count)}
          icon={<Ticket className="text-[#72C215]" size={KPI_ICON_SIZE} />}
        />
        <KpiCard
          title={KPI_TITLES.co2Avoided}
          value={formatKpiCo2(stats?.co2_total_kg)}
          icon={<Leaf className="text-[#72C215]" size={KPI_ICON_SIZE} />}
        />
        <KpiCard
          title={KPI_TITLES.fuelSaved}
          value={formatKpiFuel(stats?.fuel_total_liters)}
          icon={<Fuel className="text-[#72C215]" size={KPI_ICON_SIZE} />}
        />
        <KpiCard
          title={KPI_TITLES.paperSaved}
          value={formatKpiPaper(stats?.paper_saved_meters)}
          icon={<Scroll className="text-[#72C215]" size={KPI_ICON_SIZE} />}
        />
        <KpiCard
          title={KPI_TITLES.financialSavings}
          value={formatEnvironmentalFinancial(stats ?? {})}
          icon={<Coins className="text-[#72C215]" size={KPI_ICON_SIZE} />}
        />
      </div>

      <SectionCard title="Passagens">
        <div className="mb-3">
          <TransactionFilters
            filters={txFilters}
            onChange={handleFiltersChange}
            showPlate
          />
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
