# API Route Audit

> Gerado em: 2026-05-30

Auditoria de sincronismo entre rotas do backend (FastAPI) e chamadas do frontend (React).

---

## ✅ Em Sync — Prontas e Conectadas

| Rota Backend | Método | Chamada Frontend | Feature |
|---|---|---|---|
| `/users/` | GET | `/api/users/` | `users/api/requests.ts` |
| `/vehicles/` | GET | `/api/vehicles/` | `users/api/raw-vehicles.ts` |
| `/technical-specs/` | GET | `/api/technical-specs/` | `settings/api/requests.ts` |
| `/technical-specs/update` | POST | `/api/technical-specs/update` | `settings/api/requests.ts` |
| `/fuel-prices/` | GET | `/api/fuel-prices/` | `settings/api/requests.ts` |
| `/fuel-prices/sync` | POST | `/api/fuel-prices/sync` | `settings/api/requests.ts` |

---

## ⚠️ Path Mismatch — Rota existe no backend mas com caminho diferente

| Chamada Frontend | Método | Rota Backend Real | Ajuste Necessário |
|---|---|---|---|
| `/api/fleet/vehicles` | GET, POST | `/api/vehicles/` | Trocar prefix `/fleet` no frontend OU criar router `/fleet/vehicles` no backend |
| `/api/fleet/vehicles/{id}` | GET, PATCH | `/api/vehicles/{id}` | Mesma correção acima |

**Arquivo frontend afetado:** `app/front/src/features/fleet/api/requests.ts`

---

## ❌ Faltam no Backend — Frontend chama rota que não existe

| Chamada Frontend | Método | Params Enviados | Response Esperada | Feature |
|---|---|---|---|---|
| `routes/suggest` | POST | `{ destination: string }` | `RouteEstimate` (distanceKm, durationMin, carbonEstimateKg, etc.) | `routing/api/requests.ts` |
| `impact/metrics` | GET | — | `ImpactMetrics` (daysSavedWithoutQueues, treeSaved, totalCarbon, totalWaterSaved, paperSaved) | `sustainability/api/requests.ts` |
| `goals/current` | GET | — | `{ weeklyGoal, weeklyPercentage }` | `sustainability/api/requests.ts` |
| `passages/summary` | GET | — | `{ totalPassages, totalCarbon, hoursSaved }` | `sustainability/api/requests.ts` |
| `passages` | GET | `page, page_size` | `{ totalResults, page, lastPassages: Passage[] }` | `sustainability/api/requests.ts` |

> **Nota:** Backend tem `GET /goals/current/{user_id}` mas frontend chama `goals/current` sem `user_id`. Além do path errado, falta o param obrigatório.

---

## 🔵 Backend Pronto mas Não Usado pelo Frontend

Rotas implementadas no backend sem nenhuma chamada correspondente no frontend.

| Rota | Método | Arquivo Backend | Tela que deveria usar |
|---|---|---|---|
| `/health` | GET | `health.py` | — (healthcheck interno) |
| `/users/` | POST | `user.py` | Criação de usuário (não implementada no front) |
| `/vehicles/{id}` | DELETE | `vehicles.py` | FleetListPage (sem botão de delete) |
| `/transactions/` | GET, POST | `transactions.py` | Nenhuma tela consome transações diretamente |
| `/transactions/{id}` | GET, PATCH, DELETE | `transactions.py` | — |
| `/transactions/process` | POST | `transactions.py` | — (core do negócio, sem tela conectada) |
| `/goals/` | GET, POST | `goals.py` | — |
| `/goals/{id}` | GET, PATCH | `goals.py` | — |
| `/goals/current/{user_id}` | GET | `goals.py` | ImpactDashboardPage (mas chamada errada) |
| `/goals/{id}/progress` | PATCH | `goals.py` | — |
| `/organizations` | GET, POST | `organization.py` | Nenhuma tela de organizações |
| `/organizations/{id}` | GET | `organization.py` | — |
| `/fuel-prices/{uf}` | GET | `fuel_prices.py` | — |
| `/user-stats/` | GET | `user_stats.py` | DashboardPage (usa dados hardcoded) |
| `/user-stats/{user_id}` | GET | `user_stats.py` | — |
| `/notifications/ws` | WEBSOCKET | `notifications.py` | Nenhuma tela ouve notificações |

---

## 🟡 Telas com Dados Hardcoded ou Mock — Precisam de API Real

| Tela | Rota | Situação |
|---|---|---|
| `DashboardPage` | `/dashboard` | Todas métricas (CO2, combustível, economia, tags) são hardcoded. Backend tem `/user-stats/` pronto. |
| `NotificationSettingsPage` | `/perfil/notificacoes` | Usa `localStorage`. Sem API de preferências de notificação. |
| `HelpSupportPage` | `/ajuda` | Conteúdo estático. OK se for intencional. |

**Mock functions no frontend** (não fazem chamada real):
- `updateUserMock()` em `users/api/requests.ts:35` — salva localmente, não persiste no backend
- `deleteUserMock()` em `users/api/requests.ts:49` — idem

---

## 📋 Resumo Executivo

| Status | Qtd | Descrição |
|---|---|---|
| ✅ Em sync | 6 | Rota existe e frontend chama corretamente |
| ⚠️ Path mismatch | 2 | Backend existe, path do frontend errado (`/fleet/vehicles`) |
| ❌ Falta backend | 5 | Frontend chama rota inexistente no backend |
| 🔵 Backend sem uso | 15 | Backend pronto, frontend não consome |
| 🟡 Hardcoded/Mock | 3 telas | Telas sem integração real |

### Prioridades sugeridas

1. **Corrigir path mismatch** (`/fleet/vehicles`) — 1 linha de config ou novo router
2. **Criar rotas faltantes** — `routes/suggest`, `impact/metrics`, `passages`, `passages/summary`, `goals/current`
3. **Conectar DashboardPage** ao `/user-stats/` — dados já existem no backend
4. **Substituir mocks** de user update/delete por chamadas reais ao `/users/{id}`
5. **Conectar `/transactions/process`** — é o core do negócio, sem tela ainda
