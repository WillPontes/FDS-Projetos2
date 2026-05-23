# Arquitetura Feature-Based

Padrões completos em **[docs/tecnico/convencoes.md](../../../docs/tecnico/convencoes.md)**.

## Features atuais

| Feature | Domínio | Rotas |
|---------|---------|-------|
| `home` | Landing | `/` |
| `dashboard` | Gestor — KPIs ambientais (Tela 09) | `/dashboard` |
| `fleet` | Gestor — inventário frota (US05) | `/frota`, `/frota/adicionar` |
| `users` | Admin — listagem | `/users` |
| `sustainability` | Motorista — impacto + passagens (contratos §1–§2) | `/impact`, `/passagens` |

## Estrutura de uma feature

Ver convencoes.md: `api/`, `hooks/`, `pages/<Page>/`, `schemas/`, `components/`, `index.ts`.

## Layout global

- **App:** `AppLayout` (sidebar fixa + `Header` + `Footer`) via `AppShell` em todas as rotas
- **Página:** `GestorPageShell` opcional (título, descrição, ações) dentro do conteúdo da rota
- **Motorista (UI):** componentes em `components/layout/driver/` (`MetricCard`, `StatCard`, etc.)
