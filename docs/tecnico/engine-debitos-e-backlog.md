# Motor de cálculo — débitos, revisão e backlog

Este ficheiro agrega **notas de revisão de produto**, **itens em aberto** no código de referência da [secção 6 de engine-calculo.md](engine-calculo.md#6-código-de-referência-python) e **melhorias já identificadas** no spec. A especificação normativa do motor continua em [engine-calculo.md](engine-calculo.md); limitações formais em [§7 Limitações](engine-calculo.md#7-limitações).

---

## Conclusão da revisão: faz sentido para o que desenvolvemos?

O desenho cobre o **núcleo ESG + valor financeiro + orquestração** de evento. É um **modelo simplificado e transparente por transação**, adequado a MVP; constantes devem ser **versionadas** e inputs **logados** para auditoria (sensibilidade e planilha replicável são complementares, conforme [Premissas do desafio](../negocio/premissas-desafio.md)).

| Área | Cobertura | Notas |
|------|-----------|--------|
| US03 Combustível → CO₂e | Forte | Fatores por combustível, marcha lenta e consumo extra após paragem (modelado por categoria). |
| US04 Papel / água | Forte | Ticket térmico evitado → CO₂ e litros de água (proxy do ciclo de vida). |
| US02 Metáforas lúdicas | Forte | `ludic_metaphors` com **≥3** metáforas por eixo (água, papel, carbono), todas em `specs`. |
| US05 Com vs. sem tag | Forte | Objeto `comparison` + desgaste por paragem na cabine de pedágio (`brake_wear_brl`) + combustível repartido (marcha lenta / pós-paragem). |
| US06 Frota | Forte | `VehicleDatabase` (interno + API + fallback). |
| US07 Tempo de vida | Apoio | `metadata.time_saved_sec` para agregar horas/dias na app. |
| US09 Notificações | Apoio | Payload com `storytelling` por eixo e totais por passagem. |
| US11 Payback | Coberto | `payback` opcional com mensalidade e acumulado (cálculo na app ou pass-through). |
| US08 / US10 | Fora do motor | Não incluídos aqui. |

**Riscos e premissas (documentar sempre):**

- **`calculate_avoided_acceleration_fuel`** devolve um volume **fixo por passagem** (modelo: **uma paragem na cabine de pedágio seguida de arranque** evitada), **independente** do tempo poupado na fila — coerente com um único “consumo extra ao reacelerar” evitado, mas pode superestimar se a passagem for anómala.
- **`is_digital`** deve ser parâmetro quando houver ticket físico em estacionamento.
- **`convert_to_co2` / `convert_from_co2`** são o **pivo CO₂e**: normalizam qualquer unidade de entrada ou saída sem alterar a lógica de cálculo. Para adicionar uma nova metáfora, basta acrescentar em `specs['benchmarks']` e num branch de `convert_from_co2`.

---

## TODOs no código de referência (§6)

Localização: [engine-calculo.md — Bloco 1 `CakcEngine`](engine-calculo.md#bloco-1--calcengine), nas funções `get_ludic_metrics`, `get_ludic_metrics_by_axis` , `calculate_payback_snapshot` , `process_transaction` e `_default_ludic_metaphors`.

| Item | Descrição |
|------|-----------|
| get_ludic_metrics | Ajustar as métricas conforme os wireframes, ajustar a interação com o dicionário, divisão por 0 e fallbacks mais robustos. |
| get_ludic_metrics_by_axis | Refatorar a busca dos itens de dicionários buscando Fallbacks mais robustos. |
| calculate_payback_snapshot | Assegurar que em accumulated_savings_br1 e monthly_tag_fee_brl sejam em float e não tenham valores negativos. billing_months não poderá receber 0, no return, colocar o .round em monthly_tag_fee_br1 |
| process_transaction | Em vehicle_data, context e payback, confirmar o uso de .get() para evitar falhas por chaves inexistentes, garantir que stops_avoided não seja fixado em 1 quando o context for estacionamento(não podemos focar exclusivamente nos pedágios) e assegurar que is_digital sofra conversão explícita para não aceitar strings como booleanos verdadeiros. |
| _default_ludic_metaphors | Em "paper", "notebook" Trocar quantidade de folhas de caderno "50" pra "96" (média de páginas de um caderno). 
---

Localização: [engine-calculo.md — Bloco 2 `VehicleDatabase`](engine-calculo.md#bloco-2--vehicledatabase), no método `get_complete_vehicle_data` e em `_map_external_to_internal`.

| Item | Descrição |
|------|-----------|
| Headers Serpro | `headers={}` placeholder — preencher **Authorization** e cabeçalhos exigidos pelo estaleiro Serpro quando integrar de verdade. |
| OpenAPI | Alinhar nomes de campos ao schema oficial (`consultarVeiculoPorPlaca`): peso → categoria, campo de combustível, etc. |
| VehicleDatabase | Ajeitar a função `get_complete_vehicle_data`, pois, no final está retornando um veiculo que não existe. A função deve retornar uma `informação verdadeira` ou `Error`. |
| Remover fallbacks| Dados ausentes ou inválidos devem gerar erro, nunca valores inferidos.
---

## Melhorias possíveis (já documentadas no spec)

Bullets derivados de [§7 Limitações](engine-calculo.md#7-limitações) e do texto acima; não constituem roadmap fechado.

- Afinar **`_map_external_to_internal`** quando o OpenAPI estiver fixo; alargar **`emission_factors`** para GNV, elétrico e híbridos quando o modelo evoluir.
- Rever o modelo **`accel_surge` fixo** por passagem se houver dados para múltiplas paragens ou contextos atípicos.
- Garantir **`is_digital`** explícito em todos os fluxos com ticket físico em estacionamento.
