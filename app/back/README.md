# Taggy — API (back-end)

API **FastAPI** com **SQLModel**, **asyncpg** e **Alembic** (para migrações formais quando o modelo de dados estabilizar). O Swagger/OpenAPI é servido automaticamente pelo FastAPI.

## Requisitos

- Python 3.12+
- [uv](https://docs.astral.sh/uv/) (recomendado) ou outro gestor à sua escolha

## Variáveis de ambiente

Copie o exemplo e ajuste:

```bash
cd app/back
cp .env.example .env
```

- **`DATABASE_URL`**: URL assíncrona SQLAlchemy, por exemplo `postgresql+asyncpg://postgres:postgres@localhost:5432/taggy` para desenvolvimento contra Postgres local.
- **`JWT_SECRET`**: segredo HS256 para validar tokens nas rotas que usem `Depends(get_current_user)` (substituir o Supabase por JWT emitido pela vossa camada de autenticação).
- **`CORS_ORIGINS`**: opcional; lista separada por vírgulas (predefinido: `http://localhost:5173`).

## Postgres e API com Docker Compose

Na pasta `app/back`:

```bash
docker compose up --build
```

Isto sobe o **Postgres** (`db`) e a **API** (`api`). O compose define `DATABASE_URL` com host `db` na rede interna; o ficheiro `.env` pode conter outras chaves (ex.: `JWT_SECRET`).

No arranque do serviço `api`, as migrações Alembic correm automaticamente (`uv run alembic upgrade head`). As dependências Python são instaladas no **build** da imagem (`uv sync` no Dockerfile), não em cada `exec`.

Para popular `technical_specs` id=1 (após Postgres e API saudáveis):

```bash
docker compose exec api uv run python scripts/seed_technical_specs.py
```

Dentro do container use sempre `uv run` (como no Dockerfile e no compose). `python` ou `pip` soltos não veem o `.venv` do projeto.

Para só levantar a base (e correr a API na máquina com `uv run`):

```bash
docker compose up db
```

Depois use no `.env` uma `DATABASE_URL` com `localhost` e a porta mapeada (predefinida `5432`, ou `POSTGRES_PORT` se alterar no compose).

## Desenvolvimento local (sem Docker na API)

```bash
cd app/back
uv sync
uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Garanta que `DATABASE_URL` aponta para um Postgres acessível.

## Swagger e OpenAPI

Com a API em execução:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- Esquema OpenAPI JSON: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

## Qualidade de código

```bash
uv run ruff check src
uv run ruff format src
uv run pytest
```

## Estrutura

| Caminho           | Responsabilidade            |
| ----------------- | --------------------------- |
| `src/models/`     | Modelos e schemas           |
| `src/services/`   | Lógica de negócio           |
| `src/routes/`     | Endpoints HTTP              |
| `src/middleware/` | Cross-cutting (auth, etc.)  |
| `src/lib/`        | Infraestrutura (db, sessão) |

- Rotas: validação de entrada e chamada de `services`
- Sem lógica de negócio em `routes`
- Lógica centralizada em `services`
- Acesso ao banco via `AsyncSession`

O agregador `APIRouter` principal está em `src/routes/__init__.py`; routers por domínio (ex.: `health.py`) são incluídos ali.

## Como criar uma nova rota

1. **`models/`** — Defina tabelas SQLModel e/ou schemas de pedido/resposta.
2. **`services/`** — Implemente funções assíncronas que recebem `AsyncSession` e executam a lógica (queries, validações transversais).
3. **`routes/`** — Crie um `APIRouter` com os endpoints; injete `AsyncSession` com `Depends(get_session)` (quando existir dependência de sessão no router) e chame o service.
4. **Registo** — Inclua o novo router em `src/routes/__init__.py` com `router.include_router(...)`.

No arranque, `create_db_and_tables()` cria tabelas em modo desenvolvimento; para produção prefira **migrações Alembic** em vez de `create_all` implícito.
