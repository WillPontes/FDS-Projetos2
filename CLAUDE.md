# Taggy-Ecoscore — Contexto para Claude Code

## Stack

**Front:** React 19, TanStack Router (file-based), TanStack Query, Zod, react-hook-form, Tailwind 4, ky  
**Back:** FastAPI, SQLModel (SQLAlchemy), asyncpg (PostgreSQL), Alembic, PyJWT  
**Monorepo:** `app/front/` e `app/back/`

---

## Frontend

### Estrutura

```
src/
├── features/<feature>/
│   ├── api/          # query-keys.ts, requests.ts, types.ts
│   ├── hooks/        # useGet<Entidade>/, useCreate<Entidade>/
│   ├── pages/        # <Entidade>ListPage/, <Entidade>FormPage/
│   ├── schemas/      # <entidade>-schema.ts
│   └── components/
├── components/
│   ├── ui/           # shadcn — kebab-case, sem pasta
│   ├── form/         # form-field.tsx, form-actions.tsx
│   └── layout/
└── lib/              # utils.ts, http-client.ts, query-client.ts
```

### Nomenclatura

| Contexto | Padrão | Exemplo |
|----------|--------|---------|
| Componentes / Pages | PascalCase | `FleetListPage` |
| Hooks | `use<Ação><Entidade>` | `useGetVehicles`, `useCreateVehicle` |
| API requests | `<verbo><Entidade>` | `getVehicles`, `createVehicle` |
| Variáveis | camelCase | `pageCount` |
| Constantes | UPPER_SNAKE_CASE | `PAGE_SIZE` |
| Arquivos schema | kebab-case + `-schema.ts` | `vehicle-schema.ts` |
| Types | PascalCase, inferidos do Zod | `type Vehicle = z.infer<typeof vehicleSchema>` |

### Padrões críticos

- Toda pasta de componente/hook/page tem `index.ts` com barrel export
- Hooks de query: `useQuery({...})` — sem useState extra
- Hooks de mutation: `useMutation({...})` + `onSuccess` invalida `queryClient`
- Query keys via factory em `query-keys.ts` (ver `vehicleKeys` como referência)
- Forms: Zod schema + zodResolver + `ControlledInput`/`ControlledSelect`
- Tipos de form inferidos do schema Zod — nunca interface manual

---

## Backend

### Estrutura

```
src/
├── models/        # SQLModel table=True — PascalCase singular
├── repositories/  # <Entidade>Repository — async, só SQL
├── services/      # funções async — lógica de negócio
├── routes/        # FastAPI routers — funções finas
├── dto/           # Pydantic BaseModel — payloads de entrada/saída
├── engine/        # CalcEngine, Orchestrator — cálculos
└── providers/     # OfficialSourceProvider — integrações externas
```

### Nomenclatura

| Contexto | Padrão | Exemplo |
|----------|--------|---------|
| Classes | PascalCase | `FuelPricesRepository` |
| Funções | snake_case, verbo+substantivo | `list_users`, `get_by_uf` |
| Arquivos | snake_case | `fuel_prices_repository.py` |
| Tabelas SQL | snake_case, plural | `fuel_prices_by_uf` |
| Rotas URL | kebab-case | `/fuel-prices` |

### Métodos de repository (padrão)

`get_by_id` / `get_by_<campo>` / `get_all` / `create` / `update` / `delete` / `upsert_by_<campo>`

### Padrões críticos

- Repositories: só SQL, sem lógica de negócio, sem `commit()` manual
- Services: recebem `AsyncSession`, instanciam repositórios internamente
- Routes: finas — delegam para service, `response_model=` sempre tipado
- Todos os métodos de repository e service são `async`
- Erros: `raise HTTPException(status_code=..., detail="...")`
- Auth: JWT bearer via `get_current_user()` middleware

---

## Convenções completas

Ver [`docs/tecnico/convencoes.md`](docs/tecnico/convencoes.md) para referência detalhada com exemplos de código.
