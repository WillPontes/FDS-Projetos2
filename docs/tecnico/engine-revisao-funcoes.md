# Revisão das funções da engine

Tabela para acompanhamento de responsabilidade e revisão de cada função/método do motor de cálculo.

**Como usar:**

- **Responsável:** dev principal que implementou ou conhece o método.
- **Revisado por:** ao revisar, adicione seu nome como `[NomeDev]`. Múltiplos revisores são bem-vindos.

Código de referência completo: [engine-calculo.md §6](engine-calculo.md#6-código-de-referência-python). Roteiro de revisão: [guia-desenvolvedor.md — Como revisar a engine](guia-desenvolvedor.md#como-revisar-a-engine--roteiro-para-dev-iniciante).

---

## `CalcEngine` — [Bloco 1](engine-calculo.md#bloco-1--calcengine)

| Função / Método                       | Resumo                                                                                                                                      | Responsável | Revisado por |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------ |
| `convert_to_co2`                      | Normaliza qualquer entrada (litros, tickets, água) para kg CO₂e (pivô de conversão).                                                        | Afonso      | —            |
| `convert_from_co2`                    | Converte kg CO₂e para unidade simbólica: árvores, km, hambúrgueres etc. (pivô inverso).                                                     | Afonso      | —            |
| `calculate_emissions_from_fuel`       | `liters × emission_factors[fuel_type]` → kg CO₂e. Fallback 2.15 se tipo desconhecido.                                                       | Afonso      | —            |
| `calculate_avoided_idle_fuel`         | `time_saved_sec × idle_rates[category]` → litros não queimados em marcha lenta.                                                             | Afonso      | —            |
| `calculate_avoided_acceleration_fuel` | Retorna `accel_surge[category]` — volume fixo evitado ao não fazer parada na cabine.                                                        | —           | —            |
| `calculate_paper_and_water_savings`   | Se `is_digital=True`: retorna CO₂e, água e tickets evitados por um ticket digital. Se `False`: zeros.                                       | —           | —            |
| `resolve_fuel_price_brl_per_liter`    | Resolve R$/L por UF com 4 níveis de fallback. Retorna `(preço, uf_aplicada)`.                                                               | —           | —            |
| `calculate_financial_savings`         | Soma `idle_brl + accel_brl + brake_brl + maint` → economia financeira detalhada em R$.                                                      | —           | —            |
| `build_comparison`                    | Compara custo sem tag (baseline completo + parada) vs. com tag (tempo real, sem parada) e calcula deltas.                                   | —           | —            |
| `get_ludic_metrics`                   | Métricas legado (retrocompatível): árvores, cargas de celular, filtros de café a partir de `ludic_factors`.                                 | —           | —            |
| `get_ludic_metrics_by_axis`           | Gera ≥ 3 metáforas por eixo (carbon / water / paper) a partir de `specs["ludic_metaphors"]`.                                                | —           | —            |
| `calculate_payback_snapshot`          | `net_brl = accumulated - fee × months`; status `"tag_paga"` ou `"em_payback"`. `@staticmethod`.                                             | —           | —            |
| `process_transaction`                 | Orquestra todos os cálculos acima e monta o payload final (environmental, financial, comparison, storytelling, metadata, payback opcional). | —           | —            |
| `_default_ludic_metaphors`            | Função standalone. Retorna metáforas padrão por eixo quando `specs["ludic_metaphors"]` está ausente.                                        | —           | —            |

---

## `VehicleDatabase` — [Bloco 2](engine-calculo.md#bloco-2--vehicledatabase)

| Função / Método             | Resumo                                                                                                                  | Responsável | Revisado por |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------- | ------------ |
| `get_complete_vehicle_data` | Banco de dados interno → API Senatran → perfil genérico de fallback. Retorna `plate`, `category`, `fuel_type`, `model`. | Lucas       | —            |
| `_map_external_to_internal` | Traduz o JSON da API Senatran para o contrato interno da engine. Flex e GNV caem em `gasolina_c` por segurança.         | Lucas       | —            |

---

## `OfficialSourceProvider` e `_fallback_technical_specs` — [Bloco 3](engine-calculo.md#bloco-3--officialsourceprovider-e-_fallback_technical_specs)

| Função / Método             | Resumo                                                                                                                  | Responsável | Revisado por |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------- | ------------ |
| `_fallback_technical_specs` | Função standalone. Retorna o dicionário completo de specs quando o banco de dados ainda está vazio (primeira execução). | Jean        | —            |
| `sync_all_sources`          | Dispara `_sync_fuel_prices_from_bq` e `_sync_ghg_factors_mcti` (job agendado, não por passagem).                        | Jean        | —            |
| `_sync_fuel_prices_from_bq` | Consulta a tabela ANP no BigQuery, agrega por UF e persiste `fuel_prices_by_uf` + `fuel_prices_meta`.                   | Jean        | —            |
| `_sync_ghg_factors_mcti`    | Sincroniza e persiste os fatores oficiais de emissão GHG do MCTI.                                                       | Jean        | —            |
| `get_all_specs`             | Lê `technical_specs` do banco de dados; se vazio, retorna `_fallback_technical_specs()`.                                | Jean        | —            |

---

## `TransactionOrchestrator` — [Bloco 4](engine-calculo.md#bloco-4--transactionorchestrator)

| Função / Método    | Resumo                                                                                                             | Responsável | Revisado por |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ | ----------- | ------------ |
| `handle_tag_event` | Recebe o webhook, resolve veículo, carrega specs e delega para `CalcEngine.process_transaction`. Não faz cálculos. | —           | —            |

---

## Devs do projeto

| Nome            | GitHub                                               |
| --------------- | ---------------------------------------------------- |
| Igor Phillipe   | [@IgrPhillipe](https://github.com/IgrPhillipe)       |
| Williams Pontes | [@WillPontes](https://github.com/WillPontes)         |
| Jean Augusto    | [@jeanaugustox](https://github.com/jeanaugustox)     |
| Lucas Gabriel   | [@lucasgabrielcs](https://github.com/lucasgabrielcs) |
| Kellwen Costa   | [@kellwencosta](https://github.com/kellwencosta)     |
| Afonso Araujo   | [@araujo1901mx](https://github.com/araujo1901mx)     |
