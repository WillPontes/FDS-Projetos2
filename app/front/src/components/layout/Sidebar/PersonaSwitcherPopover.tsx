import { useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Check, UserRoundCog } from "lucide-react";
import { PERSONA_MOCKS } from "@/constants/personas";
import { APP_NAV_ITEMS } from "@/constants/nav";
import { useAuthStore } from "@/features/auth/auth-store";
import type { CurrentUser, UserRole } from "@/features/auth/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ROLE_HOME: Record<UserRole, string> = {
  admin: "/",
  gestor_frota: "/",
  motorista: "/impacto",
};

function isRouteAllowedForRole(pathname: string, role: UserRole): boolean {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const item = APP_NAV_ITEMS.find((nav) => {
    if (nav.exact) return normalized === nav.to;
    return normalized === nav.to || normalized.startsWith(`${nav.to}/`);
  });
  if (!item) return true;
  if (!item.roles) return role === "motorista";
  return item.roles.includes(role);
}

function normalizePath(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed || "/";
}

type PersonaSwitcherPopoverProps = {
  onSelect?: () => void;
};

export const PersonaSwitcherPopover = ({ onSelect }: PersonaSwitcherPopoverProps) => {
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleSelect = async (persona: CurrentUser) => {
    if (user?.id === persona.id) return;

    login(persona);
    onSelect?.();

    await queryClient.cancelQueries();
    queryClient.clear();

    const nextPath = isRouteAllowedForRole(pathname, persona.role)
      ? pathname
      : ROLE_HOME[persona.role];

    const currentPath = normalizePath(window.location.pathname);
    const targetPath = normalizePath(nextPath);

    // Full reload so in-flight/cached requests never use the previous X-User-Id.
    // Requires SPA rewrite on the host (see app/front/vercel.json).
    if (targetPath === currentPath) {
      window.location.reload();
      return;
    }

    window.location.assign(targetPath);
  };

  const activeLabel =
    PERSONA_MOCKS.find((p) => p.persona.id === user?.id)?.label ??
    user?.role ??
    "—";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-2 h-auto font-normal text-sm text-black hover:bg-taggy-brand-accent"
        >
          <UserRoundCog className="size-5 shrink-0" />
          <span className="truncate text-left">Persona: {activeLabel}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="top" className="w-72 p-2">
        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
          Trocar persona
        </p>
        <div className="flex flex-col gap-1">
          {PERSONA_MOCKS.map(({ persona, label }) => {
            const isActive = user?.id === persona.id;
            return (
              <button
                key={persona.id}
                type="button"
                onClick={() => handleSelect(persona)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-neutral-100",
                  isActive && "bg-neutral-100",
                )}
              >
                <Check
                  className={cn("size-4 shrink-0", !isActive && "invisible")}
                />
                <div className="min-w-0">
                  <p className="font-medium truncate">{label}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {persona.email}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
