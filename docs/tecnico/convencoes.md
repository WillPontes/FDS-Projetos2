# Convenções do Projeto Taggy-Ecoscore

Padrões extraídos do código existente para garantir consistência entre colaboradores.

Stack: React 19 + TanStack Router/Query + Zod + react-hook-form (front) | FastAPI + SQLModel + asyncpg (back)

---

## Frontend

### Estrutura de Pastas

```
src/
├── api/                    # hooks/requests globais (cross-feature)
├── components/             # componentes compartilhados
│   ├── ui/                 # primitivos headless (Radix/shadcn) — kebab-case, sem pasta
│   ├── form/               # form-field.tsx, form-actions.tsx
│   ├── layout/             # MainLayout, Header, Sidebar, Footer
│   └── <NomeComponente>/   # componente reutilizável com barrel export
├── constants/              # routes.ts, pagination.ts
├── features/               # módulos por domínio
│   └── <feature>/
│       ├── api/            # query-keys.ts, requests.ts, types.ts
│       ├── hooks/          # um hook por pasta (NomeHook/NomeHook.ts + index.ts)
│       ├── pages/          # um page por pasta (NomePage/NomePage.tsx + index.ts)
│       ├── schemas/        # validação Zod
│       ├── components/     # componentes exclusivos da feature
│       └── constants.ts
├── lib/                    # utils.ts, http-client.ts, query-client.ts
└── routes/                 # TanStack Router file-based routing (kebab-case)
```

---

### Páginas

**Nome:** `PascalCase` + sufixo `Page`  
**Local:** `features/<feature>/pages/<NomePage>/`  
**Estrutura:** pasta com mesmo nome + barrel export

```
FleetListPage/
  ├── FleetListPage.tsx
  └── index.ts     →  export { FleetListPage } from './FleetListPage'
```

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Listagem | `<Entidade>ListPage` | `FleetListPage` |
| Formulário criação | `<Entidade>FormPage` | `FleetFormPage` |
| Formulário edição | `<Entidade>EditPage` | `FleetEditPage` |
| Detalhe | `<Entidade>DetailPage` | `FleetDetailPage` |

---

### Hooks

**Padrão:** `use<Ação><Entidade>` — prefixo `use` obrigatório, ação em inglês  
**Local:** `features/<feature>/hooks/<NomeHook>/`  
**Estrutura:** pasta + barrel export (igual a pages)

| Operação | Padrão | Exemplo |
|----------|--------|---------|
| Buscar lista | `useGet<Entidades>` | `useGetVehicles` |
| Buscar por id | `useGet<Entidade>` | `useGetVehicle` |
| Criar | `useCreate<Entidade>` | `useCreateVehicle` |
| Atualizar | `useUpdate<Entidade>` | `useUpdateVehicle` |
| Deletar | `useDelete<Entidade>` | `useDeleteVehicle` |

Regras:
- Query hooks retornam `useQuery({...})` — sem estado local extra
- Mutation hooks retornam `useMutation({...})` + `onSuccess` invalida queries relevantes
- Query keys sempre via factory em `query-keys.ts`

```typescript
// features/fleet/api/query-keys.ts
export const vehicleKeys = {
  all: () => ["vehicles"] as const,
  lists: () => [...vehicleKeys.all(), "list"] as const,
  list: (params: GetVehiclesParams) => [...vehicleKeys.lists(), params] as const,
  detail: (id: number) => [...vehicleKeys.all(), "detail", id] as const,
}
```

---

### Funções / Utilitários

**Nomenclatura:** `camelCase`, verbo + substantivo

| Onde | Arquivo | Padrão |
|------|---------|--------|
| Requisições HTTP por feature | `features/<feature>/api/requests.ts` | `getVehicles`, `createVehicle` |
| Utilitários gerais | `lib/utils.ts` | `cn`, `formatDate` |
| HTTP client | `lib/http-client.ts` | exporta instância `api` (ky) |

API requests seguem o padrão: `get<Entidades>()` / `get<Entidade>(id)` / `create<Entidade>(data)` / `update<Entidade>(id, data)` / `delete<Entidade>(id)`

Sem funções inline longas em componentes — extrair para `requests.ts` ou `lib/`.

---

### Forms / Schemas

**Validação:** Zod  
**Form state:** react-hook-form  
**Resolver:** `@hookform/resolvers/zod`  
**Local:** `features/<feature>/schemas/<entidade>-schema.ts`

```typescript
// features/fleet/schemas/vehicle-schema.ts
export const vehicleCreateSchema = z.object({ ... })
export const vehicleUpdateSchema = vehicleCreateSchema.partial()
export const vehicleSchema = vehicleCreateSchema.extend({ id: z.number() })

// tipos sempre inferidos do Zod — nunca interface separada para dados de form
export type Vehicle = z.infer<typeof vehicleSchema>
export type VehicleFormData = z.infer<typeof vehicleCreateSchema>
```

- Componentes controlled: usar `ControlledInput` / `ControlledSelect` existentes
- Formulários em pages: `useForm<T>({ resolver: zodResolver(schema) })`

---

### Componentes

**Nome:** `PascalCase`, pasta com mesmo nome + barrel export  
**Exceção:** componentes `ui/` usam kebab-case sem pasta (shadcn pattern)

```
// Shared
components/DataTable/
  ├── DataTable.tsx
  └── index.ts

// Feature-scoped
features/fleet/components/VehicleStatusBadge/
  ├── VehicleStatusBadge.tsx
  └── index.ts
```

- Props: tipo nomeado `<NomeComponente>Props` no mesmo arquivo
- Generics aceitos quando necessário: `DataTable<TData, TValue>`

---

### Nomenclatura Geral (Front)

| Contexto | Padrão | Exemplo |
|----------|--------|---------|
| Componentes / Pages | PascalCase | `FleetListPage`, `DataTable` |
| Hooks | camelCase + `use` prefix | `useGetVehicles` |
| Funções utilitárias | camelCase, verbo+substantivo | `createVehicle`, `formatDate` |
| Variáveis | camelCase | `pageCount`, `isLoading` |
| Constantes | UPPER_SNAKE_CASE | `PAGE_SIZE`, `API_URL` |
| Arquivos de schema | kebab-case + `-schema.ts` | `vehicle-schema.ts` |
| Arquivos de query-keys | `query-keys.ts` | — |
| Arquivos de rotas | kebab-case | `adicionar.tsx`, `index.tsx` |
| Types / Interfaces | PascalCase | `VehicleFormData`, `GetVehiclesParams` |
| Enums | PascalCase | `VehicleStatus` |

---

---

## Backend

### Estrutura de Pastas

```
src/
├── constants/          # constantes globais
├── database/           # engine, session, get_db()
├── dto/                # Data Transfer Objects (Pydantic BaseModel)
├── engine/             # lógica de cálculo (CalcEngine, Orchestrator)
├── middleware/         # auth.py, etc.
├── models/             # SQLModel ORM tables
├── providers/          # integrações externas (OfficialSourceProvider)
├── repositories/       # acesso ao banco de dados
├── routes/             # FastAPI routers
├── services/           # lógica de negócio
└── main.py             # app setup + lifespan
```

---

### Models

**ORM:** SQLModel (`table=True`)  
**Arquivo:** `models/<entidade>.py` (snake_case)

```python
# models/fuel_prices.py
class FuelPriceByUF(SQLModel, table=True):
    __tablename__ = "fuel_prices_by_uf"   # snake_case, plural
    id: int | None = Field(default=None, primary_key=True)
    uf: str = Field(...)
    updated_at: datetime = Field(default_factory=utc_now)
```

| Aspecto | Regra |
|---------|-------|
| Nome da classe | PascalCase, singular |
| `__tablename__` | snake_case, plural |
| PK | sempre `id: int \| None` |
| Timestamps | `created_at` / `updated_at` quando relevante |
| Response DTO | `<Entidade>Public` ou via `dto/` |

---

### Repositories

**Nome:** `<Entidade>Repository`  
**Arquivo:** `repositories/<entidade>_repository.py`  
**Constructor:** recebe `AsyncSession`  
**Todos os métodos são `async`**

| Operação | Nome do método | Retorno |
|----------|---------------|---------|
| Buscar por id | `get_by_id(id)` | `Optional[Entidade]` |
| Buscar por campo | `get_by_<campo>(valor)` | `Optional[Entidade]` |
| Buscar todos | `get_all()` | `List[Entidade]` |
| Buscar com filtro | `get_all_by_<campo>(valor)` | `List[Entidade]` |
| Criar | `create(data)` | `Entidade` |
| Atualizar | `update(id, data)` | `Optional[Entidade]` |
| Deletar | `delete(id)` | `bool` |
| Criar ou atualizar | `upsert_by_<campo>(...)` | `Entidade` |

```python
class FuelPricesRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_uf(self, uf: str) -> Optional[FuelPriceByUF]:
        result = await self.session.execute(
            select(FuelPriceByUF).where(FuelPriceByUF.uf == uf.upper())
        )
        return result.scalar_one_or_none()

    async def get_all(self) -> List[FuelPriceByUF]:
        result = await self.session.execute(select(FuelPriceByUF))
        return list(result.scalars().all())
```

Regras:
- Repositories só SQL — zero lógica de negócio
- Sem `commit()` manual — deixar para service/route

---

### Services

**Arquivo:** `services/<entidade>.py`  
**Padrão:** funções `async` — não classes, exceto quando há estado  
**Nome:** `<verbo>_<entidade(s)>` (snake_case)

| Operação | Padrão | Exemplo |
|----------|--------|---------|
| Listar | `list_<entidades>` | `list_users` |
| Buscar | `get_<entidade>` | `get_user` |
| Criar | `create_<entidade>` | `create_vehicle` |
| Atualizar | `update_<entidade>` | `update_vehicle` |
| Deletar | `delete_<entidade>` | `delete_vehicle` |
| Ação específica | `<verbo>_<contexto>` | `sync_fuel_prices` |

```python
# services/users.py
async def list_users(session: AsyncSession) -> Sequence[User]:
    return await UserRepository(session).get_all()
```

- Services recebem `AsyncSession` como parâmetro e instanciam repositórios internamente
- Lógica complexa (cálculos, integrações) vai em `engine/` ou `providers/`

---

### Routes / Controllers

**Arquivo:** `routes/<recurso>.py`  
**Router:** `APIRouter(prefix="/<recurso>", tags=["<Recurso>"])`  
**Função:** `<verbo>_<recurso>` (snake_case)  
**Agregação:** `routes/__init__.py` inclui todos os routers

| HTTP | Uso | Exemplo de função |
|------|-----|-------------------|
| GET | leitura | `get_vehicles`, `get_vehicle_by_id` |
| POST | criar / ação | `create_vehicle`, `process_transaction` |
| PUT | substituir completo | `update_vehicle` |
| PATCH | atualizar parcial | `patch_vehicle` |
| DELETE | deletar | `delete_vehicle` |

```python
# routes/vehicles.py
router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

@router.get("/", response_model=list[VehiclePublic])
async def get_vehicles(db: AsyncSession = Depends(get_db)) -> list[VehiclePublic]:
    return await list_vehicles(db)

@router.post("/", response_model=VehiclePublic, status_code=201)
async def create_vehicle_route(body: VehicleCreate, db: AsyncSession = Depends(get_db)):
    return await create_vehicle(db, body)
```

Regras:
- Route functions finas — delegam tudo para service
- Response models sempre tipados (`response_model=`)
- Erros via `raise HTTPException(status_code=..., detail="...")`

---

### DTOs

**Local:** `dto/<entidade>.py`

| Sufixo | Uso |
|--------|-----|
| `<Entidade>Create` | payload de criação |
| `<Entidade>Update` | payload de atualização (campos opcionais) |
| `<Entidade>Public` | response (pode estar em `models/`) |
| `<Entidade>DTO` | outros casos |

---

### Nomenclatura Geral (Back)

| Contexto | Padrão | Exemplo |
|----------|--------|---------|
| Classes | PascalCase | `FuelPricesRepository` |
| Funções / métodos | snake_case, verbo+substantivo | `get_by_uf`, `list_users` |
| Variáveis | snake_case | `fuel_price`, `session` |
| Constantes | UPPER_SNAKE_CASE | `DATABASE_URL` |
| Arquivos | snake_case | `fuel_prices_repository.py` |
| Tabelas SQL | snake_case, plural | `fuel_prices_by_uf` |
| Rotas URL | kebab-case | `/fuel-prices`, `/technical-specs` |
| Campos de model | snake_case | `price_diesel_s10`, `updated_at` |
