import { createFileRoute } from "@tanstack/react-router";
import { TransactionsAuditPage } from "@/features/transactions/pages/TransactionsAuditPage";
import { requireRoles } from "@/lib/route-guard";

export const Route = createFileRoute("/passagens-auditoria")({
  beforeLoad: requireRoles(["admin", "gestor_frota"]),
  component: TransactionsAuditPage,
});
