import { Fragment } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/components/layout/UserProfile";
import { getBreadcrumbs } from "@/lib/breadcrumbs";

type HeaderProps = {
  onMenuClick: () => void;
};

export const Header = ({ onMenuClick }: HeaderProps) => {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const crumbs = getBreadcrumbs(pathname);

  return (
    <header className="relative flex h-14 items-center justify-between border-b px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="size-5" />
        <span className="sr-only">Abrir menu</span>
      </Button>

      <Link
        to="/"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden"
      >
        <Logo className="h-8 w-24" />
      </Link>

      <nav className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto text-sm md:max-w-[60%]">
        <Link to="/" className="shrink-0 text-muted-foreground hover:text-foreground">
          Início
        </Link>
        {crumbs.map((crumb, i) => (
          <Fragment key={crumb.to}>
            <span className="text-muted-foreground">/</span>
            {i === crumbs.length - 1 ? (
              <span className="font-medium">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.to}
                className="text-muted-foreground hover:text-foreground"
              >
                {crumb.label}
              </Link>
            )}
          </Fragment>
        ))}
      </nav>

      <UserProfile />
    </header>
  );
};
