import { Clock, Droplet, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

export type PassageListItemData = {
  id: number
  localName: string
  passageDatetime: string
  carbon: string
  waterSaved: string
  time: string
}

type PassageListItemProps = {
  passage: PassageListItemData
  showBorder?: boolean
}

export const PassageListItem = ({
  passage,
  showBorder = true,
}: PassageListItemProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between",
        showBorder && "border-b border-border",
      )}
    >
      <div>
        <h3 className="text-sm font-bold text-foreground">
          {passage.localName}
        </h3>
        <span className="text-xs font-medium text-muted-foreground">
          {passage.passageDatetime}
        </span>
      </div>
      <div className="flex items-center gap-4 text-[11px] font-medium text-muted-foreground">
        <div className="flex items-center gap-1 rounded border border-border bg-muted px-2 py-1">
          <Leaf className="h-3.5 w-3.5 text-primary" />
          <span>{passage.carbon}</span>
        </div>
        <div className="flex items-center gap-1 rounded border border-border bg-muted px-2 py-1">
          <Droplet className="h-3.5 w-3.5 text-primary" />
          <span>{passage.waterSaved}</span>
        </div>
        <div className="flex items-center gap-1 rounded border border-border bg-muted px-2 py-1">
          <Clock className="h-3.5 w-3.5 text-success" />
          <span>{passage.time}</span>
        </div>
      </div>
    </div>
  )
}
