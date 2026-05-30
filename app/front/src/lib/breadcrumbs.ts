export type BreadcrumbItem = {
  label: string;
  to: string;
};

function normalizePathname(pathname: string): string {
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

function matchDynamic(
  pathname: string,
  prefix: string,
): string | undefined {
  const normalized = normalizePathname(pathname);
  if (normalized === prefix) return normalized;
  if (normalized.startsWith(`${prefix}/`)) return normalized;
  return undefined;
}

export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const path = normalizePathname(pathname);

  if (path === "/") {
    return [{ label: "Dashboard", to: "/" }];
  }

  if (matchDynamic(path, "/frota/editar")) {
    return [
      { label: "Frota", to: "/frota" },
      { label: "Editar Veículo", to: path },
    ];
  }

  if (path === "/frota/novo") {
    return [
      { label: "Frota", to: "/frota" },
      { label: "Cadastrar Veículo", to: "/frota/novo" },
    ];
  }

  if (path === "/frota" || path === "/frota/") {
    return [{ label: "Frota", to: "/frota" }];
  }

  if (matchDynamic(path, "/motoristas/editar")) {
    return [
      { label: "Motoristas", to: "/motoristas" },
      { label: "Editar Motorista", to: path },
    ];
  }

  if (path === "/motoristas" || path === "/motoristas/") {
    return [{ label: "Motoristas", to: "/motoristas" }];
  }

  if (matchDynamic(path, "/usuarios/editar")) {
    return [
      { label: "Usuários", to: "/usuarios" },
      { label: "Editar Usuário", to: path },
    ];
  }

  if (path === "/usuarios" || path === "/usuarios/") {
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

  if (path === "/perfil" || path === "/perfil/") {
    return [{ label: "Meu Perfil", to: "/perfil" }];
  }

  const singleSegmentRoutes: Record<string, BreadcrumbItem> = {
    "/relatorios": { label: "Relatórios", to: "/relatorios" },
    "/rota": { label: "Calcular Rota", to: "/rota" },
    "/passagens": { label: "Minhas Passagens", to: "/passagens" },
    "/impacto": { label: "Meu Impacto", to: "/impacto" },
    "/ajuda": { label: "Ajuda e Suporte", to: "/ajuda" },
    "/configuracoes": { label: "Configurações Gerais", to: "/configuracoes" },
    "/users": { label: "Usuários", to: "/users" },
  };

  const single = singleSegmentRoutes[path];
  if (single) return [single];

  return [];
}
