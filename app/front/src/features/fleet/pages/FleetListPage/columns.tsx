import type { ColumnDef } from "@tanstack/react-table"
import type { Vehicle } from "../../schemas/vehicle-schema"
import { STATUS_LABELS } from "../../constants"

export const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "plate",
    header: "Placa",
    enableSorting: true,
  },
  {
    accessorKey: "model",
    header: "Modelo",
    enableSorting: true,
  },
  {
    accessorKey: "year",
    header: "Ano",
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => STATUS_LABELS[row.getValue<string>("status")] ?? row.getValue("status"),
  },
]
