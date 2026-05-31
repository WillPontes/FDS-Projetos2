import { type ReactElement, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ActionHintPopoverProps = {
  label: string;
  children: ReactElement;
};

export const ActionHintPopover = ({ label, children }: ActionHintPopoverProps) => {
  const [open, setOpen] = useState(false);

  const show = () => setOpen(true);
  const hide = () => setOpen(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        className="w-auto max-w-xs px-2.5 py-1.5 text-xs"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {label}
      </PopoverContent>
    </Popover>
  );
};
