import { Link } from "@tanstack/react-router";
import { LucideIcon } from "lucide-react";
import { APP_NAV_ITEMS, filterNavItemsByRole } from "@/constants/nav";
import { useCurrentUser } from "@/features/auth";
import { cn } from "@/lib/utils";

type SidebarLinkProps = {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  onLinkClick?: () => void;
};

const SidebarLink = ({
  to,
  label,
  icon: Icon,
  exact = false,
  onLinkClick,
}: SidebarLinkProps) => {
  return (
    <Link
      to={to}
      onClick={onLinkClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-black transition-colors",
        "hover:bg-taggy-brand-accent",
      )}
      activeProps={{
        className: "bg-taggy-brand-accent text-black",
      }}
      activeOptions={{ exact }}
    >
      <Icon className="size-5" />
      <span>{label}</span>
    </Link>
  );
};

type SidebarNavProps = {
  onLinkClick?: () => void;
};

export const SidebarNav = ({ onLinkClick }: SidebarNavProps) => {
  const { user } = useCurrentUser();
  const navItems = filterNavItemsByRole(APP_NAV_ITEMS, user?.role);

  return (
    <nav className="flex flex-col gap-1 overflow-y-auto px-2 py-2">
      {navItems.map((item) => (
        <SidebarLink
          key={item.to}
          to={item.to}
          label={item.label}
          icon={item.icon}
          exact={item.exact}
          onLinkClick={onLinkClick}
        />
      ))}
    </nav>
  );
};
