import { Link } from "@tanstack/react-router"

export const HomePage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold tracking-tight">Taggy EcoScore</h1>

      <Link
        to="/users"
        className="text-primary text-sm font-medium underline underline-offset-4 hover:opacity-90"
      >
        Ver usuários
      </Link>
    </main>
  )
}
