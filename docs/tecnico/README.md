# Documentação técnica — motor de cálculo

O **motor de impacto por passagem** estima CO₂e, água, papel, R$ e storytelling a partir do webhook (placa, tempo, UF, contexto) e retorna o payload JSON consumido pela app e relatórios.

## Como ler (ordem sugerida)

1. **[engine-visao-geral.md](engine-visao-geral.md)** — fluxo em texto, diagramas Mermaid, assinaturas das classes.
2. **[engine-calculo.md](engine-calculo.md)** — fluxo de dados, dicionário `technical_specs`, código Python de referência (§6), limitações (§7).
   Premissas de negócio: [Premissas do desafio](../negocio/premissas-desafio.md). User stories: [user-stories.md](../produto/user-stories.md).

## Índice dos arquivos

| Arquivo                                                    | Abrir quando                                                                     |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [engine-visao-geral.md](engine-visao-geral.md)             | Entender quem chama quem e a sequência até o payload.                            |
| [engine-calculo.md](engine-calculo.md)                     | Implementar ou auditar fórmulas, specs e código de referência.                   |
| [engine-debitos-e-backlog.md](engine-debitos-e-backlog.md) | Revisão de cobertura das user stories, TODOs do código §6, melhorias conhecidas. |

Em caso de divergência entre a visão geral e o spec, prevalece **engine-calculo.md** até alinhamento explícito.
