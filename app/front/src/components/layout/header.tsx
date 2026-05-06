import { Fragment } from "react"
import { Link, useMatches } from "@tanstack/react-router"

const ROUTE_LABELS: Record<string, string> = {
  "/fleet/": "Frota",
  "/fleet/new": "Novo Veículo",
  "/users": "Usuários",
}

export function Header() {
  const matches = useMatches()
  const crumbs = matches
    .filter((m) => m.pathname !== "/" && ROUTE_LABELS[m.routeId])
    .map((m) => ({ label: ROUTE_LABELS[m.routeId]!, path: m.pathname }))

  return (
    <header className="flex h-14 items-center border-b px-6">
      <nav className="flex items-center gap-1.5 text-sm">
        <Link to="/" className="text-muted-foreground hover:text-foreground">
          Início
        </Link>
        {crumbs.map((crumb, i) => (
          <Fragment key={crumb.path}>
            <span className="text-muted-foreground">/</span>
            {i === crumbs.length - 1 ? (
              <span className="font-medium">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="text-muted-foreground hover:text-foreground">
                {crumb.label}
              </Link>
            )}
          </Fragment>
        ))}
      </nav>
    </header>
  )
}
