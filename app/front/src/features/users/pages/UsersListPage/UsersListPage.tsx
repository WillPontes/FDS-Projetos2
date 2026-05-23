import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "@tanstack/react-router"
import { GestorPageShell } from "@/components/layout/GestorPageShell"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { useGetUsers } from "../../hooks/useGetUsers"
import type { User } from "../../api/types"

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "E-mail",
  },
]

export const UsersListPage = () => {
  const { data, isLoading, isError, error } = useGetUsers()

  return (
    <GestorPageShell
      title="Usuários"
      actions={
        <Button variant="outline" asChild>
          <Link to="/">Início</Link>
        </Button>
      }
    >
      {isError ? (
        <p className="text-destructive" role="alert">
          {error instanceof Error
            ? error.message
            : "Erro ao carregar usuários."}
        </p>
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          isLoading={isLoading}
        />
      )}
    </GestorPageShell>
  )
}
