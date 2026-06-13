# Taggy — API (back-end)

API **FastAPI** com **SQLModel**, **asyncpg** e **Alembic** (para migrações formais quando o modelo de dados estabilizar). O Swagger/OpenAPI é servido automaticamente pelo FastAPI.

## Requisitos

- Python 3.12+
- [uv](https://docs.astral.sh/uv/) (recomendado) ou outro gestor à sua escolha
- Docker e Docker Compose (recomendado para Postgres + API)

## Como executar

### 1. Configurar variáveis de ambiente

```bash
cd app/back
cp .env.example .env
```

Edite o `.env` conforme a tabela abaixo. Para Docker Compose, inclua também `POSTGRES_USER`, `POSTGRES_PASSWORD` e `POSTGRES_DB` (ex.: `postgres`, `postgres`, `taggy`).

### 2. Docker Compose (recomendado)

Sobe **Postgres** (`db`) e **API** (`api`):

```bash
docker compose up --build
```

- API: [http://localhost:8000](http://localhost:8000)
- Swagger: [http://localhost:8000/docs](http://localhost:8000/docs)

O compose define `DATABASE_URL` com host `db` na rede interna; o `.env` fornece as restantes chaves (ex.: `JWT_SECRET`). No arranque, as migrações Alembic correm automaticamente (`uv run alembic upgrade head`).

Para popular `technical_specs` id=1 (após Postgres e API saudáveis):

```bash
docker compose exec api uv run python scripts/seed_technical_specs.py
```

Dentro do container use sempre `uv run`. `python` ou `pip` soltos não veem o `.venv` do projeto.

### 3. Só Postgres no Docker, API local

```bash
docker compose up db
```

No `.env`, defina `DATABASE_URL` com `localhost` e a porta mapeada (padrão `5432`, ou `POSTGRES_PORT` se alterar no compose):

```bash
uv sync
uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Tudo local (sem Docker)

Garanta um Postgres acessível e configure `DATABASE_URL` no `.env`:

```bash
uv sync
uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
| :------- | :---------- | :-------- |
| `DATABASE_URL` | Sim | URL PostgreSQL (ex.: `postgresql+asyncpg://postgres:postgres@localhost:5432/taggy`). URLs `postgresql://` ou `postgres://` (como as do Render) são convertidas automaticamente para `postgresql+asyncpg://`. No Render, liga a base ao Web Service e usa um utilizador com permissão de login — não um role só de grupo (erro `is not permitted to log in`). |
| `JWT_SECRET` | Sim | Segredo HS256 para emissão e validação de tokens JWT nas rotas com `Depends(get_current_user)`. |
| `API_PORT` | Não | Porta exposta da API no Docker (padrão: `8000`). |
| `POSTGRES_USER` | Docker | Utilizador do Postgres no `docker compose`. |
| `POSTGRES_PASSWORD` | Docker | Password do Postgres no `docker compose`. |
| `POSTGRES_DB` | Docker | Nome da base de dados (ex.: `taggy`). |
| `POSTGRES_PORT` | Não | Porta mapeada do Postgres (padrão: `5432`). |
| `GOOGLE_CREDENTIALS_JSON` | Não | JSON da service account Google Cloud (uma linha) para sync ANP via BigQuery. Em dev local, pode omitir e usar `gcloud auth application-default login`. |
| `MCTI_EMISSION_FACTORS_URL` | Não | Fonte dos fatores de emissão MCTI — ficheiro local (`file:///app/data/ghg_protocol.xlsx`) ou URL HTTP. |
| `APIBRASIL_TOKEN` | Não | Token Bearer da [apibrasil.io](https://app.apibrasil.io) para lookup placa → veículo (DETRAN + FIPE). |
| `MAPBOX_ACCESS_TOKEN` | Não | Token Mapbox para cálculo de rotas e geocoding no back-end. |

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

## Documentação

Motor de cálculo e fórmulas GHG: [docs/tecnico/engine.md](../../docs/tecnico/engine.md) e [docs/tecnico/engine-calculo.md](../../docs/tecnico/engine-calculo.md).
