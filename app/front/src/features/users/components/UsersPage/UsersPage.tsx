import { Link } from "@tanstack/react-router"
import { useGetUsers } from "@/api/users/hooks/useGetUsers"

export const UsersPage = () => {
  const { data, isPending, isError, error } = useGetUsers()

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-6 p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Usuários</h1>
        <Link
          to="/"
          className="text-muted-foreground text-sm underline underline-offset-4 hover:text-foreground"
        >
          Início
        </Link>
      </div>

      {isPending ? (
        <p className="text-muted-foreground">Carregando…</p>
      ) : isError ? (
        <p className="text-destructive" role="alert">
          {error instanceof Error
            ? error.message
            : "Erro ao carregar usuários."}
        </p>
      ) : data?.length === 0 ? (
        <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border">
          {data?.map((user) => (
            <li key={user.id} className="flex flex-col gap-0.5 px-4 py-3">
              <span className="font-medium">{user.name}</span>
              <span className="text-muted-foreground text-sm">
                {user.email}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
