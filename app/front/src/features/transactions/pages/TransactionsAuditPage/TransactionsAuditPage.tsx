import type { ColumnDef, OnChangeFn, PaginationState } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { useState } from "react";
import {
  parseAsInteger,
  useQueryStates,
} from "nuqs";
import { ActionHintPopover } from "@/components/ActionHintPopover";
import { OrganizationsRelationSelect } from "@/components/form/relation-selects";
import { DataTable, entityIdColumn } from "@/components/DataTable";
import { PageLayout } from "@/components/layout/PageLayout";
import { TransactionFilters } from "@/components/TransactionFilters/TransactionFilters";
import type { TransactionFilterState } from "@/components/TransactionFilters/TransactionFilters";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PAGE_SIZE } from "@/constants";
import { useCurrentUser } from "@/features/auth";
import type { Transaction } from "../../api/types";
import { useGetTransactions } from "../../hooks/useGetTransactions";

const formatNumber = (value: number | null, digits = 2) =>
  value != null ? value.toFixed(digits) : "—";

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("pt-BR");

const columns = (
  onViewDetails: (transaction: Transaction) => void,
): ColumnDef<Transaction>[] => [
  entityIdColumn<Transaction>(),
  {
    accessorKey: "created_at",
    header: "Data",
    cell: ({ row }) => formatDateTime(row.original.created_at),
  },
  {
    accessorKey: "plate",
    header: "Placa",
    cell: ({ row }) => row.original.plate ?? "—",
  },
  { accessorKey: "context", header: "Contexto" },
  {
    accessorKey: "uf",
    header: "UF",
    cell: ({ row }) => row.original.uf ?? "—",
  },
  {
    accessorKey: "is_digital",
    header: "Digital",
    cell: ({ row }) => (row.original.is_digital ? "Sim" : "Não"),
  },
  {
    accessorKey: "elapsed_time_sec",
    header: "Tempo (s)",
    cell: ({ row }) => formatNumber(row.original.elapsed_time_sec, 0),
  },
  {
    accessorKey: "co2_avoided_kg",
    header: "CO₂ (kg)",
    cell: ({ row }) => formatNumber(row.original.co2_avoided_kg, 3),
  },
  {
    accessorKey: "fuel_saved_liters",
    header: "Comb. (L)",
    cell: ({ row }) => formatNumber(row.original.fuel_saved_liters, 3),
  },
  {
    accessorKey: "time_saved_sec",
    header: "Tempo econ. (s)",
    cell: ({ row }) => formatNumber(row.original.time_saved_sec, 0),
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
    accessorKey: "water_saved_liters",
    header: "Água (L)",
    cell: ({ row }) => formatNumber(row.original.water_saved_liters, 2),
  },
  {
    accessorKey: "user_id",
    header: "User ID",
    cell: ({ row }) => row.original.user_id ?? "—",
  },
  {
    accessorKey: "vehicle_id",
    header: "Veículo ID",
    cell: ({ row }) => row.original.vehicle_id ?? "—",
  },
  {
    accessorKey: "organization_id",
    header: "Org ID",
    cell: ({ row }) => row.original.organization_id ?? "—",
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <ActionHintPopover label="Ver detalhes técnicos">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(row.original)}
          aria-label="Ver detalhes técnicos"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </ActionHintPopover>
    ),
  },
];

const auditSearchParams = {
  page: parseAsInteger.withDefault(1),
  org: parseAsInteger,
};

export const TransactionsAuditPage = () => {
  const { user } = useCurrentUser();
  const isAdmin = user?.role === "admin";
  const [{ page, org }, setParams] = useQueryStates(auditSearchParams, {
    history: "replace",
  });
  const [filters, setFilters] = useState<TransactionFilterState>({});
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const scopedOrgId =
    user?.role === "gestor_frota"
      ? (user.organization_id ?? undefined)
      : isAdmin
        ? (org ?? undefined)
        : undefined;

  const { data, isLoading } = useGetTransactions({
    page,
    pageSize: PAGE_SIZE,
    organizationId: scopedOrgId,
    plate: filters.plate,
    context: filters.context,
    uf: filters.uf,
    fromDate: filters.dateRange?.from
      ? format(filters.dateRange.from, "yyyy-MM-dd")
      : undefined,
    toDate: filters.dateRange?.to
      ? format(filters.dateRange.to, "yyyy-MM-dd")
      : undefined,
  });

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: PAGE_SIZE,
  };

  const pageCount = data ? Math.ceil(data.total / PAGE_SIZE) : undefined;

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;
    setParams({ page: next.pageIndex + 1 });
  };

  const handleFiltersChange = (next: TransactionFilterState) => {
    setFilters(next);
    setParams({ page: 1 });
  };

  return (
    <PageLayout
      title="Passagens"
      description="Auditoria completa de todas as transações registradas no sistema."
    >
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <TransactionFilters
            filters={filters}
            onChange={handleFiltersChange}
            showPlate
          />
          {isAdmin && (
            <OrganizationsRelationSelect
              value={org ?? undefined}
              onValueChange={(value) =>
                setParams({ org: value ?? null, page: 1 })
              }
              placeholder="Todas as organizações"
              emptyLabel="Todas as organizações"
              className="w-52"
            />
          )}
        </div>
      </section>

      <DataTable
        columns={columns(setSelectedTransaction)}
        data={data?.items ?? []}
        isLoading={isLoading}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
      />

      <Sheet
        open={selectedTransaction != null}
        onOpenChange={(open) => !open && setSelectedTransaction(null)}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>
              Passagem #{selectedTransaction?.id ?? ""}
            </SheetTitle>
          </SheetHeader>
          {selectedTransaction && (
            <pre className="mt-4 overflow-x-auto rounded-md bg-neutral-100 p-4 text-xs">
              {JSON.stringify(selectedTransaction.parameters_snapshot, null, 2)}
            </pre>
          )}
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
};
