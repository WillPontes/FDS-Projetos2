import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const metricCardSurfaceClass =
  "rounded border border-neutral-300 bg-white";

export const kpiCardClass = cn(
  metricCardSurfaceClass,
  "flex h-36 w-full flex-col items-start justify-between gap-2 p-4",
);

export const sectionCardClass = cn(metricCardSurfaceClass, "w-full");

export const sectionCardLabelClass =
  "text-xs font-medium uppercase tracking-wider text-neutral-500";

type MetricCardProps = {
  children: ReactNode;
  className?: string;
  variant?: "section" | "kpi";
};

export const MetricCard = ({
  children,
  className,
  variant = "section",
}: MetricCardProps) => {
  return (
    <div
      className={cn(
        variant === "kpi" ? kpiCardClass : sectionCardClass,
        className,
      )}
    >
      {children}
    </div>
  );
};

type KpiCardProps = {
  title: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export const KpiCard = ({ title, value, icon, className }: KpiCardProps) => {
  return (
    <div className={cn(kpiCardClass, className)}>
      <h2 className="text-xs text-neutral-500">{title}</h2>
      {icon ?? <span className="h-[30px]" aria-hidden />}
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
};

type SectionCardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export const SectionCard = ({
  title,
  children,
  className,
  contentClassName,
}: SectionCardProps) => {
  return (
    <div className={cn(sectionCardClass, className)}>
      {title ? (
        <p className={cn(sectionCardLabelClass, "p-4 pb-0")}>{title}</p>
      ) : null}
      <div className={cn(title ? "p-4 pt-3" : "p-4", contentClassName)}>
        {children}
      </div>
    </div>
  );
};
