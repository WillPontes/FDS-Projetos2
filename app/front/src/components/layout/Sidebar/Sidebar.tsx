import { useState, useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { Home, Truck } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type SidebarLinkProps = {
  to: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

const SidebarLink = ({ to, label, icon: Icon, exact = false }: SidebarLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors",
        "hover:bg-accent hover:text-accent-foreground"
      )}
      activeProps={{ className: "bg-accent text-accent-foreground font-medium" }}
      activeOptions={{ exact }}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </Link>
  )
}

export const Sidebar = () => {
  // Controle absoluto: false = escondida em qualquer tela, true = aberta em qualquer tela
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Escuta o clique do botão de 3 listras da sua página
    const handleToggle = () => setIsOpen((prev) => !prev)
    
    window.addEventListener("toggle-sidebar", handleToggle)
    return () => window.removeEventListener("toggle-sidebar", handleToggle)
  }, [])

  return (
    <>
      {/* CORTINA ESCURA DE FUNDO: Se o menu abrir, clicar fora dele vai fechá-lo */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-90" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* A BARRA LATERAL (Agora 100% controlada pelo botão) */}
      <aside
        className={cn(
          "flex flex-col border-r bg-card transition-all duration-300 w-64",
          "fixed top-0 h-screen z-100",
          // REMOVIDO o "md:left-0". Agora ela obedece estritamente o estado do clique:
          isOpen ? "left-0" : "-left-64"
        )}
      >
        {/* Cabeçalho do Menu */}
        <div className="flex h-14 items-center border-b px-4">
          <span className="font-semibold text-slate-900">Gestão</span>
        </div>

        {/* Links de Navegação */}
        <nav className="flex flex-col gap-1 p-2">
          <SidebarLink to="/" label="Início" icon={Home} exact />
          <SidebarLink to="/frota" label="Frota" icon={Truck} exact />
        </nav>
      </aside>
    </>
  )
}