import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { ChevronLeft, ChevronRight, Home, Truck, Leaf } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type SidebarLinkProps = {
  to: string
  label: string
  icon: LucideIcon
  collapsed: boolean
  exact?: boolean
}

const SidebarLink = ({ to, label, icon: Icon, collapsed, exact = false }: SidebarLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        collapsed && "justify-center px-2"
      )}
      activeProps={{ className: "bg-accent text-accent-foreground font-medium" }}
      activeOptions={{ exact }}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true"
  })

  const toggle = () => {
    setCollapsed((prev) => {
      localStorage.setItem("sidebar-collapsed", String(!prev))
      return !prev
    })
  }

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center border-b px-3">
        {!collapsed && <span className="font-semibold">Gestão</span>}
        <Button variant="ghost" size="icon" className="ml-auto" onClick={toggle}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex flex-col gap-1 p-2">
        <SidebarLink to="/" label="Início" icon={Home} collapsed={collapsed} exact />

        <SidebarLink to="/frota" label="Frota" icon={Truck} collapsed={collapsed} exact />

        <SidebarLink
          to="/dashboard"
          label="Impacto Ambiental"
          icon={Leaf}
          collapsed={collapsed}
          exact
        />
      </nav>
    </aside>
  )
}
