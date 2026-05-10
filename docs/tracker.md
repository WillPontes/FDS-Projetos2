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

## Sprint 1 · Deadline 10/05/2026

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

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-US04 | Endpoint de Comparação ROI | Back | ⬜ | `GET /api/dashboard/comparison?vehicle_id=&period_days=` — retorna `{without_tag: {cost, fuel, time}, with_tag: {cost, fuel, time}, delta}` usando `CalcEngine.build_comparison()` |
| AT02-US04 | Dashboard de Performance Econômica | Front | ⬜ | Página `/dashboard` com: cards de totais (economia R$, litros, horas) + gráfico de barras comparativo "Com Taggy" vs. "Sem Taggy" por período — usar Recharts |

---

## Sprint 3 · Deadline 31/05/2026

---

### US06 — Placar de "Tempo de Vida"
**Sprint 3 · Prioridade Média · Épico 4 - Jornada do Usuário · Dificuldade: Médio**

> Como motorista, quero ver o acumulado de horas economizadas por não parar em filas. Cálculo baseado na diferença entre tempo médio de cabines manuais e tempo de passagem pela Tag.

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-US06 | Acumulador de Tempo e Emissões | Back | ⬜ | Tabela `user_stats` com `total_time_saved_sec`, `co2_total_kg`, `fuel_total_liters` por usuário; incrementar a cada transação processada; endpoint `GET /api/users/{id}/lifetime-savings` |
| AT02-US06 | Widget de Tempo de Vida Economizado | Front | ⬜ | Componente/seção (no dashboard ou perfil) exibindo total acumulado formatado em "X dias, Y horas, Z min" e CO2 total evitado na vida do usuário |

---

### US07 — Visualização de Mapa e Rotas Verdes
**Sprint 3 · Prioridade Média · Épico 4 - Jornada do Usuário · Dificuldade: Médio**

> Como motorista, quero visualizar no mapa quais rotas possuem maior fluidez de tags integradas para planejar meu trajeto visualmente.

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-US07 | Endpoint de Localizações das Cancelas | Back | ⬜ | `GET /api/routes/toll-locations` retornando `[{id, name, lat, lng, avg_flow_score}]` — score determina se a rota é "verde" |
| AT02-US07 | Mapa Interativo de Rotas Verdes | Front | ⬜ | Página `/mapa` com mapa (Leaflet ou Mapbox) mostrando marcadores das cancelas; marcadores coloridos por score de fluxo (verde = alta fluidez); popup com nome e score ao clicar |

---

### US08 — Motor de Roteirização Sustentável
**Sprint 3 · Prioridade Média · Épico 4 - Jornada do Usuário · Dificuldade: Difícil**

> Como usuário, quero que o sistema sugira a melhor rota com base no menor impacto ambiental e menor desgaste do veículo. Comparar rotas padrão vs. rotas de alta fluidez.

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-US08 | Algoritmo de Sugestão de Rotas Verdes | Back | ⬜ | `services/route_optimizer.py` + `POST /api/routes/suggest` recebendo `{origin, destination, vehicle_id}` — retorna rota sugerida com delta de CO2 vs. rota padrão |
| AT02-US08 | Formulário de Busca de Rota Sustentável | Front | ⬜ | Página ou modal em `/mapa` com inputs de origem e destino + seleção de veículo; após submit exibe comparativo "Rota Padrão (X kg CO2)" vs. "Rota Verde (Y kg CO2)" com percentual de redução |

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
| AT01-US10 | Gerenciamento de Metas Semanais | Back | ⬜ | Model `WeeklyGoal` + migration + `GET /api/goals/current`, `POST /api/goals`, `PATCH /api/goals/{id}/progress` — controla target e progresso atual por usuário/semana |
| AT02-US10 | Barra de Progresso de Metas | Front | ⬜ | Componente/seção (no dashboard ou home) com barra visual mostrando "X de Y passagens"; largura proporcional ao progresso; fica verde ao completar; label com percentual |

---

### US11 — Calculadora de Payback Operacional
**Sprint 4 · Prioridade Baixa · Épico 3 - Operações e Valor · Dificuldade: Fácil**

> Como proprietário de veículo, quero comparar o custo da mensalidade com a economia gerada para saber quando o serviço se torna "lucro". Fórmula: (Diesel + Manutenção) - Mensalidade = Saldo Real.

| ID | Atividade | Tipo | Status | O que fazer |
|----|-----------|------|--------|-------------|
| AT01-US11 | Lógica de Ponto de Equilíbrio (Break-even) | Back | ⬜ | `POST /api/analytics/break-even` recebendo `{vehicle_id, subscription_cost_brl, period_days}` — retorna `{total_savings, balance, is_profitable, break_even_days}` |
| AT02-US11 | Calculadora de Payback da Tag | Front | ⬜ | Página `/payback` com form (mensalidade R$, período) + resultado mostrando saldo real e badge "Tag Paga ✓" (verde) ou "Em Progresso" (amarelo) usando `Badge` do shadcn/ui |

---

## Resumo por Sprint

| Sprint | US | Total AT | ✅ | 🔄 | ⬜ |
|--------|----|----------|----|----|----|
| Sprint 1 | US02, US03, US05 | 11 | 5 | 2 | 4 |
| Sprint 2 | US01, US04 | 4 | 0 | 1 | 3 |
| Sprint 3 | US06, US07, US08, US09 | 9 | 0 | 0 | 9 |
| Sprint 4 | US10, US11 | 4 | 0 | 0 | 4 |
| **Total** | **11** | **28** | **5** | **3** | **20** |
