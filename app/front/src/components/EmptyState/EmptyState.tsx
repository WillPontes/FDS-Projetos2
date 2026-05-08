import { PackageOpen } from "lucide-react"

export const EmptyState = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <PackageOpen className="h-10 w-10" />
      <p className="text-sm">Nenhum dado encontrado</p>
    </div>
  )
}
