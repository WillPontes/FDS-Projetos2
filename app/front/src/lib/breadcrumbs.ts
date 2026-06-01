export type BreadcrumbItem = {
  label: string;
  to: string;
};

export type BreadcrumbContext = {
  entityNames?: Record<string, string>;
};

function normalizePathname(pathname: string): string {
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

function matchDynamic(pathname: string, prefix: string): string | undefined {
  const normalized = normalizePathname(pathname);
  if (normalized === prefix) return normalized;
  if (normalized.startsWith(`${prefix}/`)) return normalized;
  return undefined;
}

function dynamicIdSegment(path: string, prefix: string): string | undefined {
  const matched = matchDynamic(path, prefix);
  if (!matched || matched === prefix) return undefined;
  const rest = matched.slice(prefix.length + 1);
  const id = rest.split("/")[0];
  return id && /^\d+$/.test(id) ? id : undefined;
}

export function getBreadcrumbs(
  pathname: string,
  context?: BreadcrumbContext,
): BreadcrumbItem[] {
  const path = normalizePathname(pathname);
  const names = context?.entityNames ?? {};

  if (path === "/") {
    return [{ label: "Dashboard", to: "/" }];
  }

  const orgId = dynamicIdSegment(path, "/organizacoes");
  if (orgId) {
    const name = names[`org-${orgId}`] ?? `Organização #${orgId}`;
    if (path.endsWith("/editar")) {
      return [
        { label: "Organizações", to: "/organizacoes" },
        { label: name, to: `/organizacoes/${orgId}` },
        { label: "Editar", to: path },
      ];
    }
    return [
      { label: "Organizações", to: "/organizacoes" },
      { label: name, to: path },
    ];
  }

  if (path === "/organizacoes") {
    return [{ label: "Organizações", to: "/organizacoes" }];
  }

  const fleetId = dynamicIdSegment(path, "/frotas");
  if (fleetId) {
    const name = names[`fleet-${fleetId}`] ?? `Frota #${fleetId}`;
    return [
      { label: "Frotas", to: "/frotas" },
      { label: name, to: path },
    ];
  }

  if (path === "/frotas") {
    return [{ label: "Frotas", to: "/frotas" }];
  }

  const vehicleId = dynamicIdSegment(path, "/frota");
  if (vehicleId) {
    const name = names[`vehicle-${vehicleId}`] ?? `Veículo #${vehicleId}`;
    return [
      { label: "Veículos", to: "/frota" },
      { label: name, to: path },
    ];
  }

  if (path === "/frota") {
    return [{ label: "Veículos", to: "/frota" }];
  }

  const driverId = dynamicIdSegment(path, "/motoristas");
  if (driverId) {
    const name = names[`driver-${driverId}`] ?? `Motorista #${driverId}`;
    return [
      { label: "Motoristas", to: "/motoristas" },
      { label: name, to: path },
    ];
  }

  if (path === "/motoristas") {
    return [{ label: "Motoristas", to: "/motoristas" }];
  }

  if (matchDynamic(path, "/usuarios/editar")) {
    return [
      { label: "Usuários", to: "/usuarios" },
      { label: "Editar Usuário", to: path },
    ];
  }

  if (path === "/usuarios") {
    return [{ label: "Usuários", to: "/usuarios" }];
  }

  if (path === "/perfil/notificacoes") {
    return [
      { label: "Meu Perfil", to: "/perfil" },
      { label: "Notificações", to: "/perfil/notificacoes" },
    ];
  }

  if (path === "/perfil/veiculo") {
    return [
      { label: "Meu Perfil", to: "/perfil" },
      { label: "Informações do Veículo", to: "/perfil/veiculo" },
    ];
  }

  if (path === "/perfil") {
    return [{ label: "Meu Perfil", to: "/perfil" }];
  }

  const singleSegmentRoutes: Record<string, BreadcrumbItem> = {
    "/relatorios": { label: "Relatórios", to: "/relatorios" },
    "/rota": { label: "Calcular Rota", to: "/rota" },
    "/passagens": { label: "Minhas Passagens", to: "/passagens" },
    "/passagens-auditoria": { label: "Passagens", to: "/passagens-auditoria" },
    "/impacto": { label: "Meu Impacto", to: "/impacto" },
    "/ajuda": { label: "Ajuda e Suporte", to: "/ajuda" },
    "/configuracoes": { label: "Configurações Gerais", to: "/configuracoes" },
  };

  const single = singleSegmentRoutes[path];
  if (single) return [single];

  return [];
}
