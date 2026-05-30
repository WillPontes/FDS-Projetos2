import { Logo } from "@/components/icons/Logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarNav } from "./SidebarNav";

type SidebarProps = {
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
};

export const Sidebar = ({ mobileOpen, onMobileOpenChange }: SidebarProps) => {
  return (
    <>
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r bg-card md:flex">
        <div className="flex items-center justify-center px-4">
          <Logo className="h-20 w-32" />
        </div>
        <SidebarNav />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu de navegação</SheetTitle>
          </SheetHeader>
          <SidebarNav onLinkClick={() => onMobileOpenChange(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
};
