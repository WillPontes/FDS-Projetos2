# Tracker de Histórias e Atividades — Taggy-Ecoscore

> Status baseado no código real do repositório (não no Trello).
> IDs originais do Trello preservados. Novos IDs criados sequencialmente.
> Tasks de front = funcionalidades de UI (página, formulário, componente). Tasks de back = endpoint, service, model.

**Legenda:**
- ✅ Concluído
- 🔄 Em andamento / parcialmente implementado
- 👀 Em revisão
- ⬜ Pendente

---

## Sprint 0 — Fundação Técnica (pré-requisitos transversais)

> Tasks estruturais sem história de usuário direta. Bloqueiam múltiplas US se ausentes.

---

### TE01 — Autenticação Completa (Auth)
**Pré-requisito de:** toda rota protegida, US12 roles, US13 admin

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-TE01 | Senha no modelo User | Back | ⬜ | Adicionar campo `hashed_password: str` ao model `User` + migration; usar `passlib[bcrypt]` para hash |
| AT02-TE01 | Endpoint de registro | Back | ⬜ | `POST /api/auth/register` — recebe `{name, email, password, role?, organization_id?}`; valida unicidade de email; salva hash; retorna JWT |
| AT03-TE01 | Endpoint de login | Back | ⬜ | `POST /api/auth/login` — recebe `{email, password}`; valida hash com passlib; gera JWT com `{sub: user_id, role, organization_id, exp}`; retorna `{access_token, token_type}` |
| AT04-TE01 | Endpoint de refresh | Back | ⬜ | `POST /api/auth/refresh` — recebe token válido não expirado; emite novo JWT com TTL renovado |
| AT05-TE01 | Proteger rotas existentes | Back | ⬜ | Adicionar `Depends(get_current_user)` nas rotas que precisam de auth (`/vehicles`, `/transactions/process`, `/dashboard`, `/users/{id}/*`); `/health` e `/auth/*` ficam públicos |
| AT06-TE01 | Auth store no frontend | Front | ⬜ | Store (Zustand ou Context) com `{token, user, login(), logout()}`; persiste token em `localStorage`; expõe `isAuthenticated`, `userRole` |
| AT07-TE01 | Token injection no HTTP client | Front | ⬜ | `app/front/src/lib/http-client.ts` — adicionar `beforeRequest` hook no `ky` que injeta `Authorization: Bearer <token>` se token presente; redireciona para `/login` em 401 |
| AT08-TE01 | Página de Login | Front | ⬜ | Página `/login` com form email + senha; submit chama `POST /api/auth/login`; salva token no store; redireciona para home |
| AT09-TE01 | Protected route wrapper | Front | ⬜ | HOC ou layout no TanStack Router que verifica `isAuthenticated`; redireciona não-autenticados para `/login`; verifica role para rotas admin (`/admin/*`) |

---

### TE02 — Qualidade e Observabilidade
**Pré-requisito de:** produção, debugging, auditoria ESG

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-TE02 | Formato de erro padronizado | Back | ⬜ | Todos os `HTTPException` retornam `{error: {code, message, detail?}}`; adicionar exception handler global no `main.py` para erros não tratados retornarem 500 com mesmo formato |
| AT02-TE02 | Logging de requests | Back | ⬜ | Middleware de logging (stdlib `logging`) registrando `method`, `path`, `status_code`, `duration_ms`, `user_id` (se autenticado) — sem logar bodies completos |
| AT03-TE02 | Variáveis de ambiente documentadas | Back | ⬜ | Atualizar `app/back/.env.example` com todas as vars necessárias: `DATABASE_URL`, `JWT_SECRET`, `JWT_TTL_HOURS`, `GOOGLE_APPLICATION_CREDENTIALS`, `CLIMATIQ_API_KEY` (futuro), `API_PORT` |

---

## Sprint 1 · Deadline 10/05/2026

---

### US12 — Fundação: Organização, Transações e Roles
**Sprint 1 · Prioridade Alta · Épico 1 - Infraestrutura · Dificuldade: Difícil**

> Como time de desenvolvimento, precisamos estabelecer a fundação de multi-tenancy (Organization), persistência de transações e controle de acesso por role antes de desenvolver features que dependem dessas estruturas.

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-US12 | Model Organization | Back | ⬜ | `models/organization.py` com tabela `organizations` (id, name, cnpj nullable unique, created_at); `OrganizationRepository` com `get_by_id`, `get_all`, `create` |
| AT02-US12 | Atualizar User (role + org) | Back | ⬜ | Adicionar `role: Literal["motorista","gestor_frota","admin"]` (default: motorista) e `organization_id: int \| None` (FK → organizations) ao model `User`; nova migration |
| AT03-US12 | Atualizar Vehicle (org + driver) | Back | ⬜ | Adicionar `organization_id: int \| None` (FK → organizations) e `assigned_driver_id: int \| None` (FK → users) ao model `Vehicle`; nova migration |
| AT04-US12 | require_role() dependency | Back | ⬜ | `middleware/auth.py` — `require_role(*roles)` FastAPI dependency que lê `user.role` do JWT e retorna 403 se role não permitida; integrar em todas as rotas com restrição |
| AT05-US12 | Model Transaction | Back | ⬜ | `models/transaction.py` com tabela `transactions` (id, user_id FK nullable, vehicle_id FK nullable, organization_id FK nullable, plate, context, uf, elapsed_time_sec, is_digital, co2_avoided_kg, fuel_saved_liters, time_saved_sec, financial_savings_brl, water_saved_liters, parameters_snapshot JSONB, created_at); `TransactionRepository` |
| AT06-US12 | Persistir Transaction no /process | Back | ⬜ | Após `orchestrator.handle_tag_event()` em `routes/transactions.py`, salvar Transaction no banco via `TransactionRepository.create()`; incluir `parameters_snapshot` com emission factors e pricing_snapshot usados |
| AT07-US12 | Model UserStats | Back | ⬜ | `models/user_stats.py` com tabela `user_stats` (user_id FK unique, total_time_saved_sec, co2_total_kg, fuel_total_liters, water_total_liters, financial_total_brl, transactions_count, updated_at); upsert automático a cada transação processada via `UserStatsRepository.upsert_by_user()` |

---

### US05 — Gestão de Inventário de Frota
**Sprint 1 · Prioridade Alta · Épico 3 - Operações e Valor · Dificuldade: Difícil**

> Como gestor de frota, quero cadastrar meus veículos vinculando placa, modelo, tipo de combustível e ID da Tag para que o sistema processe os dados de economia corretamente. O sistema deve permitir edição e exclusão de veículos.

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-US05 | CRUD de Veículos | Back | ✅ | Rotas `GET /POST /PATCH /DELETE /api/vehicles` com `VehicleRepository` e `VehicleService` |
| AT02-US05 | Formulário de Cadastro de Veículo | Front | ✅ | Página `/frota/adicionar` com form validado (placa, modelo, combustível, tag ID) e submit para a API |
| AT03-US05 | Validação de Duplicidade de Tag/Placa | Back | ✅ | Verificação de placa e tag_id únicos no service antes do `create`; retorna erro 409 |
| AT04-US05 | Formulário de Edição de Veículo | Front | ⬜ | Página `/frota/editar/$id` com form pré-populado com os dados do veículo; submit faz `PATCH`; mesma estrutura visual do cadastro |
| AT05-US05 | Exclusão de Veículo com Confirmação | Front | ⬜ | Botão "Excluir" na tabela da lista de frota abre `AlertDialog` de confirmação antes de deletar; feedback de sucesso/erro |
| AT06-US05 | Ações de Editar/Excluir na Tabela | Front | ⬜ | Coluna "Ações" na `FleetListPage` com botão editar (navega para `/frota/editar/$id`) e botão excluir (abre dialog) |

---

### US02 — Conversor de Combustível em Carbono
**Sprint 1 · Prioridade Alta · Épico 2 - Sustentabilidade · Dificuldade: Médio**

> Como gestora de sustentabilidade, quero converter o combustível economizado em emissões de CO2 evitadas para gerar relatórios ESG precisos e auditáveis. Utilizar fatores GHG Protocol, diferenciando veículos leves (flex) e pesados (diesel).

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-US02 | Engine de Cálculo de CO2 | Back | ✅ | `CalcEngine.calculate_emissions_from_fuel()` com coeficientes GHG Protocol — diferencia flex e diesel |
| AT02-US02 | Tela de Resultado de Impacto | Front | ⬜ | Página ou seção após processar uma transação exibindo: CO2 evitado (kg), combustível economizado (litros), tipo de veículo — consome `POST /api/transactions/process` |

---

### US03 — Cálculo de Economia de Papel Térmico
**Sprint 1 · Prioridade Alta · Épico 2 - Sustentabilidade · Dificuldade: Difícil**

> Como gestor de operações, quero visualizar o impacto de não utilizar recibos físicos — quantificar papel térmico (BPA) evitado por transação e converter em litros de água poupados.

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-US03 | Contador de Transações Digitais | Back | 🔄 | `calculate_paper_and_water_savings(is_digital)` implementado no `CalcEngine`; resultado exposto em `TransactionResultDTO.paper_savings` |
| AT02-US03 | Painel de Economia de Papel e Água | Front | ⬜ | Seção na tela de resultado (AT02-US02) com cards: tickets físicos evitados e litros d'água poupados — dados vêm do mesmo response de transação |

---

## Sprint 2 · Deadline 17/05/2026

---

### US01 — Tradução Lúdica de Impacto
**Sprint 2 · Prioridade Alta · Épico 2 - Sustentabilidade · Dificuldade: Fácil**

> Como usuário, quero ver meu impacto ambiental traduzido em exemplos cotidianos (ex: árvores, campos de futebol) para que minha contribuição seja tangível e fácil de compartilhar.

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-US01 | Utilitário de Metáforas Visuais | Back | 🔄 | `CalcEngine.get_ludic_metrics()` retorna `trees_saved`, `smartphone_charges`, `coffee_filters` — `constants/ludic_metaphors.py` com os fatores |
| AT02-US01 | Galeria de Cards de Impacto Lúdico | Front | ⬜ | Seção na tela de resultado (AT02-US02) com cards visuais: ícone + número + descrição por metáfora (ex: "🌳 2,3 árvores salvas") — dados de `ludic_metrics` no response |

---

### US04 — Dashboard Comparativo "Com vs. Sem Taggy"
**Sprint 2 · Prioridade Alta · Épico 3 - Operações e Valor · Dificuldade: Médio**

> Como gerente de operações, quero comparar meu gasto real contra o prejuízo estimado sem tag para validar o ROI. O gráfico deve mostrar "Custo da Ineficiência" vs. fluidez da Taggy.

> **Depende de:** AT05-US12, AT06-US12 (Transaction persistida)

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-US04 | Endpoint de Comparação ROI | Back | ⬜ | `GET /api/dashboard/comparison?vehicle_id=&period_days=` — agrega Transactions reais por vehicle_id + período, retorna `{without_tag: {cost, fuel, time}, with_tag: {cost, fuel, time}, delta}` usando baselines de `technical_specs`; role: gestor_frota, admin |
| AT02-US04 | Dashboard de Performance Econômica | Front | ⬜ | Página `/dashboard` com: cards de totais (economia R$, litros, horas) + gráfico de barras comparativo "Com Taggy" vs. "Sem Taggy" por período — usar Recharts |

---

## Sprint 3 · Deadline 31/05/2026

---

### US06 — Placar de "Tempo de Vida"
**Sprint 3 · Prioridade Média · Épico 4 - Jornada do Usuário · Dificuldade: Médio**

> Como motorista, quero ver o acumulado de horas economizadas por não parar em filas. Cálculo baseado na diferença entre tempo médio de cabines manuais e tempo de passagem pela Tag.

> **Depende de:** AT07-US12 (UserStats model e upsert automático)

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-US06 | Endpoint de Lifetime Savings | Back | ⬜ | `GET /api/users/{id}/lifetime-savings` — lê tabela `user_stats`; motorista só acessa o próprio; gestor_frota acessa usuários da sua org; admin acessa todos; retorna `{total_time_saved_sec, co2_total_kg, fuel_total_liters, water_total_liters, financial_total_brl, transactions_count}` |
| AT02-US06 | Widget de Tempo de Vida Economizado | Front | ⬜ | Componente/seção (no dashboard ou perfil) exibindo total acumulado formatado em "X dias, Y horas, Z min" e CO2 total evitado na vida do usuário |

---

### US07 — Visualização de Mapa e Rotas Verdes
**Sprint 3 · Prioridade Média · Épico 4 - Jornada do Usuário · Dificuldade: Médio**

> Como motorista, quero visualizar no mapa regiões com maior concentração de pedágios integrados e calcular o impacto de CO2 de uma rota.

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-US07 | Dados estáticos de cancelas | Back | ⬜ | Seed com localização das principais praças de pedágio no Brasil (lat, lng, nome, UF) como JSON estático servido por `GET /api/routes/toll-locations`; sem model persistido — dados raramente mudam |
| AT02-US07 | Mapa Interativo de Rotas Verdes | Front | ⬜ | Página `/mapa` com mapa (Leaflet ou Mapbox) mostrando marcadores das cancelas Taggy; popup com nome e UF ao clicar; ponto de partida para US08 |

---

### US08 — Motor de Roteirização Sustentável
**Sprint 3 · Prioridade Média · Épico 4 - Jornada do Usuário · Dificuldade: Difícil**

> Como usuário, quero que o sistema calcule o impacto ambiental de uma rota com base na distância e no meu veículo, comparando com o benchmark de um carro médio a gasolina.

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-US08 | Algoritmo de Estimativa de CO2 por Rota | Back | ⬜ | `services/route_optimizer.py` + `POST /api/routes/suggest` recebendo `{origin, destination, distance_km, vehicle_id}` — calcula CO2 do veículo real via `emission_factor[fuel_type]` vs. benchmark `kg_co2_per_km_car`; retorna `{vehicle_co2_kg, benchmark_co2_kg, delta_kg, delta_pct}` |
| AT02-US08 | Formulário de Busca de Rota Sustentável | Front | ⬜ | Página ou modal em `/mapa` com inputs de origem, destino, distância (km) e seleção de veículo; após submit exibe comparativo "Carro Médio (X kg CO2)" vs. "Seu Veículo (Y kg CO2)" com percentual de redução |

---

### US09 — Notificações "Passagem Limpa"
**Sprint 3 · Prioridade Média · Épico 4 - Jornada do Usuário · Dificuldade: Médio**

> Como motorista, quero receber notificação após passar pelo pedágio informando o impacto positivo imediato. Ex: "Boa! Você economizou 150ml de diesel e evitou Xg de CO2 agora".

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-US09 | Gerador de Mensagens de Impacto | Back | ⬜ | `services/notification_builder.py` com `build_message(result)` montando frase personalizada; campo `notification_message: str` adicionado ao `TransactionResultDTO` |
| AT02-US09 | Notificação Visual Pós-Passagem | Front | ⬜ | Toast (Sonner — já instalado) disparado após processar transação com sucesso; exibe `notification_message` do response com ícone verde, duração 5s |

---

## Sprint 4 · Deadline 07/06/2026

---

### US10 — Barra de Progresso de Metas Semanais
**Sprint 4 · Prioridade Baixa · Épico 4 - Jornada do Usuário · Dificuldade: Fácil**

> Como Product Lead, quero implementar metas de economia semanais para aumentar engajamento. Interface onde o usuário acompanha quanto falta para bater a meta de eficiência verde.

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-US10 | Gerenciamento de Metas Semanais | Back | ⬜ | Model `WeeklyGoal` (user_id FK, week_start date, target_transactions, current_transactions, target_co2_kg nullable, current_co2_kg, is_completed) + migration + `GET /api/goals/current`, `POST /api/goals`, `PATCH /api/goals/{id}/progress`; roles: motorista, gestor_frota |
| AT02-US10 | Barra de Progresso de Metas | Front | ⬜ | Componente/seção (no dashboard ou home) com barra visual mostrando "X de Y passagens"; largura proporcional ao progresso; fica verde ao completar; label com percentual |

---

### US11 — Calculadora de Payback Operacional
**Sprint 4 · Prioridade Baixa · Épico 3 - Operações e Valor · Dificuldade: Fácil**

> Como proprietário de veículo, quero comparar o custo da mensalidade com a economia gerada para saber quando o serviço se torna "lucro". Fórmula: (Diesel + Manutenção) - Mensalidade = Saldo Real.

> **Depende de:** AT05-US12, AT06-US12 (Transaction persistida para somar savings reais)

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-US11 | Lógica de Ponto de Equilíbrio (Break-even) | Back | ⬜ | `POST /api/analytics/break-even` recebendo `{vehicle_id, subscription_cost_brl, period_days}` — soma `financial_savings_brl` das Transactions reais do período; retorna `{total_savings, fees_total, net_brl, is_profitable, break_even_days}`; usa `CalcEngine.calculate_payback_snapshot()`; roles: gestor_frota, admin |
| AT02-US11 | Calculadora de Payback da Tag | Front | ⬜ | Página `/payback` com form (mensalidade R$, período) + resultado mostrando saldo real e badge "Tag Paga ✓" (verde) ou "Em Progresso" (amarelo) usando `Badge` do shadcn/ui |

---

### US13 — Módulo Administrativo
**Sprint 4 · Prioridade Média · Épico 1 - Infraestrutura · Dificuldade: Médio**

> Como admin, quero gerenciar usuários e organizações, visualizar métricas ESG globais do sistema e atualizar parâmetros de cálculo (emission factors MCTI) sem necessidade de deploy.

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-US13 | Listagem e Gestão de Usuários | Back | ⬜ | `GET /api/admin/users?role=&organization_id=` — lista todos usuários com filtros; role: admin |
| AT02-US13 | Alteração de Role de Usuário | Back | ⬜ | `PATCH /api/admin/users/{id}/role` com body `{role: "motorista"\|"gestor_frota"\|"admin"}`; role: admin |
| AT03-US13 | Listagem de Organizações | Back | ⬜ | `GET /api/admin/organizations` — lista todas orgs com count de usuários e veículos; role: admin |
| AT04-US13 | Resumo ESG Global | Back | ⬜ | `GET /api/admin/esg/summary` — agrega CO2 total, combustível total, água total, transações totais de todas as orgs; role: admin |
| AT05-US13 | Update de Emission Factors via API | Back | ⬜ | `POST /api/technical-specs/update` — admin atualiza fatores MCTI/GHG Protocol sem deploy; valida com `validate_engine_specs()` antes de salvar; role: admin |
| AT06-US13 | Scheduler Automático ANP | Back | ⬜ | APScheduler no startup do FastAPI executando `sync_fuel_prices()` 1x/semana; sem endpoint — automático; log de execução e timestamp de última sync |
| AT07-US13 | Painel Admin | Front | ⬜ | Página `/admin` com tabs: "Usuários" (tabela com filtros + alterar role), "Organizações" (listagem), "ESG Global" (cards de totais do sistema); acesso restrito a role admin |

---

## Resumo por Sprint

| Sprint | US/TE | Total AT | ✅ | 🔄 | ⬜ |
|--------|-------|----------|----|----|----|
| Sprint 0 (fundação) | TE01, TE02 | 12 | 0 | 0 | 12 |
| Sprint 1 | US12, US05, US02, US03 | 17 | 4 | 1 | 12 |
| Sprint 2 | US01, US04 | 4 | 0 | 1 | 3 |
| Sprint 3 | US06, US07, US08, US09 | 8 | 0 | 0 | 8 |
| Sprint 4 | US10, US11, US13 | 11 | 0 | 0 | 11 |
| **Total** | **15** | **52** | **4** | **2** | **46** |
