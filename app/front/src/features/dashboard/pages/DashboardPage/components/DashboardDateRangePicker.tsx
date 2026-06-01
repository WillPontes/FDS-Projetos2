import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { FieldTrigger } from "@/components/ui/field-trigger";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DashboardDateRangePickerProps = {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
};

export const DashboardDateRangePicker = ({
  date,
  onDateChange,
}: DashboardDateRangePickerProps) => {
  const [open, setOpen] = useState(false);
  const hasValue = Boolean(date?.from);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FieldTrigger
          showClear={hasValue}
          onClear={() => onDateChange(undefined)}
          className={cn("w-[280px]", !hasValue && "text-muted-foreground")}
        >
          <span className="flex min-w-0 items-center gap-2">
            <CalendarIcon className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd/MM/yyyy", { locale: ptBR })} –{" "}
                    {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
                  </>
                ) : (
                  format(date.from, "dd/MM/yyyy", { locale: ptBR })
                )
              ) : (
                "Selecionar período"
              )}
            </span>
          </span>
        </FieldTrigger>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          className="p-3"
          defaultMonth={date?.from}
          selected={date}
          onSelect={onDateChange}
          numberOfMonths={2}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
};
