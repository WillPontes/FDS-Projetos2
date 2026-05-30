import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: ComponentProps<"div">["className"];
};

export const PageLayout = ({
  title,
  description,
  children,
  className,
}: PageLayoutProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="page-title text-3xl font-semibold">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      {children}
    </div>
  );
};
