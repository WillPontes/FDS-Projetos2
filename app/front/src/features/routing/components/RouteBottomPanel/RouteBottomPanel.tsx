import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type RouteBottomPanelProps = {
  children: ReactNode;
  className?: string;
};

export const RouteBottomPanel = ({
  children,
  className,
}: RouteBottomPanelProps) => {
  return (
    <div
      className={cn(
        "shrink-0 rounded-t-2xl border-t border-border bg-white p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] pb-[max(1rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      {children}
    </div>
  );
};
