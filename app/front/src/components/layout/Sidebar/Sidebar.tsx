import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { APP_NAV_ITEMS } from "@/constants/nav";

type SidebarLinkProps = {
  to: string;
  label: string;
  icon: React.ComponentType;
  exact?: boolean;
};

const SidebarLink = ({
  to,
  label,
  icon: Icon,
  exact = false,
}: SidebarLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-black transition-colors",
        "hover:bg-taggy-brand-accent",
      )}
      activeProps={{
        className: "bg-taggy-brand-accent font-medium text-black",
      }}
      activeOptions={{ exact }}
    >
      <Icon />
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar = () => {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <span className="font-semibold text-foreground">Taggy</span>
      </div>
      <nav className="flex flex-col gap-1 overflow-y-auto p-2">
        {APP_NAV_ITEMS.map((item) => (
          <SidebarLink
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            exact={item.exact}
          />
        ))}
      </nav>
    </aside>
  );
};
