# TaggyEcoScore — Front-end

Stack: **React 19**, **Vite 6**, **TanStack Router** (file-based routing), **TanStack Query**, **Tailwind CSS 4** e utilitários compatíveis com **shadcn/ui** (`components.json`).

## Requisitos

- Node.js 20+
- `pnpm` (ou `npm` / `yarn`)

## Setup

```bash
cd app/front
cp .env.example .env   # opcional
pnpm install
pnpm dev
```

App disponível em `http://localhost:5173`.

Durante o desenvolvimento, requisições para `/api` são redirecionadas via proxy para `http://localhost:8000` (configurado em `vite.config.ts`).

## Scripts

| Comando          | Descrição                |
| ---------------- | ------------------------ |
| `pnpm dev`       | Inicia o servidor de dev |
| `pnpm build`     | Gera build de produção   |
| `pnpm preview`   | Serve o build localmente |
| `pnpm typecheck` | Validação de tipos (TS)  |

## Estrutura e organização

- **Feature-first**: código organizado por domínio em `src/features/<feature>/`
  - `components/`, `hooks/`, `api/`, etc.
  - cada feature expõe uma interface pública via `index.ts`

- **Rotas (`src/routes/`)**
  - arquivos do TanStack Router apenas definem a rota e renderizam um componente
  - **não devem conter lógica de negócio**
  - a lógica fica dentro das features

- **Código compartilhado**
  - `src/lib/`: utilitários, cliente HTTP, helpers
  - `src/components/ui/`: componentes base (shadcn/ui)

- **Imports**
  - `@/` → `src/`
  - `@/features/...` → `src/features/...`

## Criando uma nova página

1. Criar a feature:

```
src/features/minha-feature/
```

2. Implementar a página:

```
components/MinhaFeaturePage.tsx
```

3. Exportar no `index.ts` da feature

4. Conectar na rota:

```ts
// src/routes/minha-rota.tsx
export const Route = createFileRoute("/minha-rota")({
  component: MinhaFeaturePage,
});
```

Use a feature `home` como referência.

## Observações

- `src/routeTree.gen.ts` é gerado automaticamente pelo TanStack Router
- O arquivo é versionado para permitir `typecheck` sem precisar rodar o dev
- Sempre que adicionar/alterar rotas, execute:

  ```bash
  pnpm dev
  ```

  ou

  ```bash
  pnpm build
  ```

  para regenerar
