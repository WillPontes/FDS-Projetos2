import type { ColumnDef } from "@tanstack/react-table";

export function entityIdColumn<T extends { id: number }>(): ColumnDef<T> {
  return {
    accessorKey: "id",
    header: "ID",
    enableSorting: true,
    cell: ({ row }) => row.original.id,
  };
}
