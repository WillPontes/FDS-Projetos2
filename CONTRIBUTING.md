# Guia de contribuição — Taggy-Ecoscore

Obrigado por contribuir com o **Taggy-Ecoscore**. Este documento descreve como configurar o ambiente, seguir os padrões do projeto e enviar alterações no **front-end** (`app/front`) e no **back-end** (`app/back`).

Para visão geral do produto, user stories e backlog, consulte o [README.md](README.md).

---

## Estrutura do repositório

```
Taggy-Ecoscore/
├── app/
│   ├── front/          # React 19 + Vite + TanStack Router/Query
│   └── back/           # FastAPI + SQLModel + Alembic
├── docs/               # Documentação de produto, negócio e técnica
└── CONTRIBUTING.md     # Este arquivo
```

Documentação técnica detalhada:

- [docs/tecnico/convencoes.md](docs/tecnico/convencoes.md) — padrões de código (front e back)
- [app/front/README.md](app/front/README.md) — setup e estrutura do front
- [app/back/README.md](app/back/README.md) — setup, Docker e API

---

## Pré-requisitos

| Camada | Requisitos |
| :----- | :--------- |
| **Front** | Node.js 20+, `pnpm` (recomendado) |
| **Back** | Python 3.12+, [uv](https://docs.astral.sh/uv/), PostgreSQL |
| **Geral** | Git, conta no [GitHub](https://github.com/WillPontes/Taggy-Ecoscore) |

---

## Configuração do ambiente

### 1. Clonar o repositório

```bash
git clone https://github.com/WillPontes/Taggy-Ecoscore.git
cd Taggy-Ecoscore
```

### 2. Back-end (API + banco)

**Opção A — Docker Compose (recomendado para começar)**

```bash
cd app/back
cp .env.example .env
docker compose up --build
```

A API sobe em `http://localhost:8000`. As migrações Alembic rodam automaticamente no arranque.

**Opção B — API local + Postgres**

```bash
cd app/back
cp .env.example .env
docker compose up db          # ou Postgres instalado localmente
uv sync
uv run alembic upgrade head
uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Swagger: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Front-end

```bash
cd app/front
cp .env.example .env
pnpm install
pnpm dev
```

App em `http://localhost:5173`. Requisições para `/api` são proxyadas para `http://localhost:8000` (ver `vite.config.ts`).

### Variáveis de ambiente

| Arquivo | Variáveis principais |
| :------ | :------------------- |
| `app/back/.env` | `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS` (opcional) |
| `app/front/.env` | `VITE_API_URL` (padrão: `http://localhost:8000`) |

Nunca commite arquivos `.env` com segredos reais.

---

## Fluxo de trabalho (Git)

1. **Abra ou escolha uma issue** no [GitHub Issues](https://github.com/WillPontes/Taggy-Ecoscore/issues) antes de implementar mudanças significativas.
2. **Crie uma branch** a partir de `main`:
   ```bash
   git checkout -b feat/nome-curto-da-feature
   # ou: fix/descricao-do-bug
   ```
3. **Implemente** seguindo as convenções (seção abaixo).
4. **Valide** localmente (checklist por camada).
5. **Abra um Pull Request** com descrição clara: o quê, por quê e como testar.

### Mensagens de commit

Use [Conventional Commits](https://www.conventionalcommits.org/) em inglês, alinhado ao histórico do repositório:

```
feat: add vehicle category filter to fleet list
fix: show duplicate plate error on vehicle create
docs: update contributing guide for migrations
refactor: extract dashboard query keys to api layer
```

- Uma preocupação por commit quando possível.
- Corpo opcional para explicar o *porquê* quando não for óbvio.

### Pull Requests

- Mantenha PRs focados — preferir PRs menores e revisáveis.
- Referencie a issue relacionada (`Closes #28`, `Refs #29`).
- Descreva passos de teste manual (rotas, payloads, roles de usuário).
- Se alterar schema do banco, inclua a migration e instruções de `alembic upgrade head`.

---

## Contribuindo no front-end

Stack: **React 19**, **Vite 6**, **TanStack Router**, **TanStack Query**, **Tailwind CSS 4**, **Zod**, **react-hook-form**.

### Onde colocar código

| Tipo | Local |
| :--- | :---- |
| Página / fluxo de domínio | `app/front/src/features/<feature>/` |
| Rota (só wiring) | `app/front/src/routes/` — **sem lógica de negócio** |
| Componentes compartilhados | `app/front/src/components/` |
| UI base (shadcn) | `app/front/src/components/ui/` |
| HTTP client, utils | `app/front/src/lib/` |

Organização **feature-first**: cada feature expõe API pública via `index.ts`.

### Checklist antes do PR (front)

```bash
cd app/front
pnpm typecheck
pnpm build
```

- Ao **adicionar ou alterar rotas**, regenere `src/routeTree.gen.ts` (`pnpm dev` ou `pnpm build`).
- Hooks de dados: use factories em `api/query-keys.ts`; mutations invalidam queries relacionadas.
- Formulários: schema Zod em `schemas/`, tipos inferidos com `z.infer`.
- Imports: alias `@/` → `src/`.

### Nova página (resumo)

1. Criar feature em `src/features/minha-feature/` (pages, hooks, api, schemas).
2. Exportar no `index.ts` da feature.
3. Conectar em `src/routes/minha-rota.tsx` com `createFileRoute`.
4. Usar a feature `home` ou `fleet` como referência.

Detalhes: [app/front/README.md](app/front/README.md) e [docs/tecnico/convencoes.md](docs/tecnico/convencoes.md#frontend).

---

## Contribuindo no back-end

Stack: **FastAPI**, **SQLModel**, **asyncpg**, **Alembic**, **Ruff**, **pytest**.

### Camadas e responsabilidades

```
routes/       → HTTP: validação de entrada, status codes, chama service
services/     → regras de negócio
repositories/ → acesso ao banco (SQL apenas)
models/       → tabelas SQLModel
dto/          → payloads Create/Update/Public (Pydantic)
engine/       → cálculos e orquestração (CalcEngine, etc.)
```

**Regra:** rotas finas; sem lógica de negócio em `routes/`; sem SQL em `services/`.

### Nova rota / recurso (resumo)

1. `models/` — tabela e/ou schemas ORM.
2. `dto/` — contratos de entrada e saída.
3. `repositories/` — queries assíncronas com `AsyncSession`.
4. `services/` — funções `async` que orquestram repositórios e regras.
5. `routes/` — `APIRouter` + registro em `src/routes/__init__.py`.
6. Se o schema mudou → **migration Alembic** (ver abaixo).

Detalhes: [app/back/README.md](app/back/README.md) e [docs/tecnico/convencoes.md](docs/tecnico/convencoes.md#backend).

### Migrações (Alembic)

Alterações de schema **sempre** via migration versionada em `app/back/migrations/versions/`.

```bash
cd app/back
uv run alembic revision -m "descricao_curta"
# editar o arquivo gerado (upgrade / downgrade)
uv run alembic upgrade head
```

Antes de abrir PR:

- Teste `upgrade head` em banco local limpo e em banco com dados existentes.
- Garanta cadeia linear de `down_revision` (sem branches conflitantes).
- Não edite migrations já aplicadas em produção — crie uma migration de reparo.

### Checklist antes do PR (back)

```bash
cd app/back
uv run ruff check src
uv run ruff format src
uv run pytest
```

- Novos endpoints: documentação automática em `/docs`; tipar `response_model`.
- Erros de domínio: mensagens específicas (ver `src/errors/`); evitar `detail` genérico.
- Autenticação: rotas protegidas usam `Depends(get_current_user)` quando aplicável.

---

## Convenções compartilhadas

| Tópico | Front | Back |
| :----- | :---- | :--- |
| Nomenclatura de arquivos | kebab-case (rotas, schemas) | snake_case |
| Nomenclatura de tipos/classes | PascalCase | PascalCase |
| Funções | camelCase | snake_case |
| Constantes | UPPER_SNAKE_CASE | UPPER_SNAKE_CASE |
| Idioma do código | inglês (identificadores, commits) | inglês |
| Texto de UI | português (produto brasileiro) | mensagens de erro em PT quando expostas ao usuário |

Documento completo: [docs/tecnico/convencoes.md](docs/tecnico/convencoes.md).

---

## Reportar bugs

Use o [GitHub Issues](https://github.com/WillPontes/Taggy-Ecoscore/issues) com:

- **Descrição** do comportamento observado vs. esperado
- **Passos para reproduzir**
- **Ambiente** (local, Vercel, Render, branch)
- **Screenshots ou logs** quando relevante

Consulte issues já resolvidas na seção Bugtracker do [README.md](README.md#bugtracker-github-issues) como referência de formato.

---

## Dúvidas

- Backlog e prioridades: [Trello — cesar-projetos-2](https://trello.com/b/alfFb7dV/cesar-projetos-2)
- User stories: [docs/produto/user-stories.md](docs/produto/user-stories.md)
- Tracker de implementação: [docs/tecnico/tracker.md](docs/tecnico/tracker.md)

Este projeto faz parte da disciplina **SI010 — Fundamentos de Desenvolvimento de Software** (CESAR School).
