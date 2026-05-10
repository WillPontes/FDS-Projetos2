# Projeto Taggy

O _Taggy_ é uma solução de pagamento automático (Tag) que vai além da conveniência. Nosso objetivo é transformar cada passagem por pedágios e estacionamentos em dados acionáveis de sustentabilidade (ESG), economia de combustível e eficiência operacional.

---

## Visão Geral

O sistema utiliza a inteligência de dados para calcular o impacto ambiental positivo gerado pela fluidez no trânsito. Focamos em três pilares:

1. _Inteligência:_ Cálculos baseados no GHG Protocol para CO₂ e economia de diesel.
2. _Engajamento:_ Linguagem lúdica para aproximar o usuário da causa ambiental.
3. _Gestão:_ Dashboards robustos para frotas que buscam certificados ESG.

## Público-Alvo (Personas)

- _Mariana Costa (Sustentabilidade):_ Precisa de dados auditáveis para relatórios anuais.
- _Ricardo Almeida (Operações):_ Focado em redução de custos de combustível e manutenção.
- _Tiago Mendes (Motorista):_ Valoriza praticidade, status e o "tempo ganho".
- _Jéssica Castro (Product Lead):_ Busca métricas de engajamento e diferenciais competitivos.

## Estrutura do Projeto

O projeto está dividido em 5 pilares estratégicos:

- _Pilar 1:_ O Cálculo (Inteligência de Dados)
- _Pilar 2:_ Os Painéis (Visualização)
- _Pilar 3:_ Incentivos e Avisos (Gamificação)
- _Pilar 4:_ Conexão e Linguagem (UX Writing)
- _Pilar 5:_ Vantagens de Negócio (Certificações)

---

## User Stories

O detalhe **Card / Conversation / Confirmation (CCC)**, épicos e links para cartões no Trello estão em **[docs/produto/user-stories.md](docs/produto/user-stories.md)**. Quadro: [cesar-projetos-2](https://trello.com/b/alfFb7dV/cesar-projetos-2). Diagramas de atividades: [`docs/diagramas/specs/`](docs/diagramas/specs/) (PlantUML e draw.io) e exportações PNG em [`docs/diagramas/`](docs/diagramas/); visão agregada opcional no [Google Drive](https://drive.google.com/file/d/1XGv4y-BJ-yUia8EKnrTdb78NESRhesFB/view?usp=drive_link).

| US | Prioridade | Título | Print UML (PNG no repositório) |
| :- | :--------- | :----- | :------------------------------ |
| US01 | Alta | Tradução Lúdica de Impacto | [US01.png](docs/diagramas/US01.png) |
| US02 | Alta | Conversor de Combustível em Carbono | [US02.png](docs/diagramas/US02.png) |
| US03 | Alta | Cálculo de Economia de Papel Térmico | [US03.png](docs/diagramas/US03.png) |
| US04 | Alta | Dashboard Comparativo "Com vs. Sem Taggy" | [US04.png](docs/diagramas/US04.png) |
| US05 | Alta | Gestão de Inventário de Frota | [US05.png](docs/diagramas/US05.png) |
| US06 | Alta | Placar de "Tempo de Vida" | [US06.png](docs/diagramas/US06.png) |
| US07 | Média | Visualização de Mapa e Rotas Verdes | [US07.png](docs/diagramas/US07.png) |
| US08 | Média | Motor de Roteirização Sustentável | [US08.png](docs/diagramas/US08.png) |
| US09 | Média | Notificações "Passagem Limpa" | [US09.png](docs/diagramas/US09.png) |
| US10 | Baixa | Barra de Progresso de Metas Semanais | [US10.png](docs/diagramas/US10.png) |
| US11 | Baixa | Calculadora de Payback Operacional | [US11.png](docs/diagramas/US11.png) |

<a id="screencast-do-prototipo"></a>

## Screencast do protótipo

Este screencast percorre o protótipo do Taggy: principais telas e fluxos e como eles se conectam às user stories e funcionalidades documentadas neste repositório.

**Assistir no YouTube:** [Screencast do protótipo Taggy](https://www.youtube.com/watch?v=7lFrXswsO0k)

[![Screencast do protótipo Taggy — clique para abrir no YouTube](docs/images/thumb.jpeg)](https://www.youtube.com/watch?v=7lFrXswsO0k)

---

## Sketches e storyboards do protótipo

Esta seção documenta os **sketches e storyboards** do produto. Existem **12 telas** em [`docs/images/mockup/`](docs/images/mockup/) (`01.png` … `12.png`). Na coluna **Arquivo**, cada nome de arquivo é um **link** para o PNG no repositório. Cada tela pode ilustrar **várias user stories** ao mesmo tempo: na tabela abaixo indicamos as **US principais** e as **relacionadas**.

Em conjunto, as 12 imagens cobrem **as 11 user stories**.

### Mapa telas ↔ user stories

| Tela | Arquivo                             | Descrição breve                                                                | US principais | US relacionadas         |
| :--- | :---------------------------------- | :----------------------------------------------------------------------------- | :------------ | :---------------------- |
| 01   | [01.png](docs/images/mockup/01.png) | Dashboard mobile — aba Carbono (impacto lúdico + valor técnico em kg CO₂)      | US01, US02    | US03, US02              |
| 02   | [02.png](docs/images/mockup/02.png) | Mesmo dashboard — aba Água (litros poupados)                                   | US01, US03    | US01                    |
| 03   | [03.png](docs/images/mockup/03.png) | Mesmo dashboard — aba Papel (metragem evitada)                                 | US01, US03    | US01                    |
| 04   | [04.png](docs/images/mockup/04.png) | Resumo e lista das últimas passagens (CO₂, combustível, tempo por passagem)    | US02          | US01,US09,US07,Us02     |
| 05   | [05.png](docs/images/mockup/05.png) | Notificação push na tela de bloqueio (praça, g CO₂, ml diesel, min ganhos)     | US09          | US06, US02              |
| 06   | [06.png](docs/images/mockup/06.png) | Perfil motorista (frota, placa, combustível; atalhos histórico / notificações) | US11          | US09                    |
| 07   | [07.png](docs/images/mockup/07.png) | Mapa — inserir destino / pesquisar (início da jornada de rota)                 | US07, US08    | US09                    |
| 08   | [08.png](docs/images/mockup/08.png) | Rota Verde no mapa + painel Eco-estimativa (CO₂ evitado, tempo parado)         | US07, US08    | US09                    |
| 09   | [09.png](docs/images/mockup/09.png) | Dashboard web operacional (KPIs, filtros, exportar ESG, heatmap, top 5)        | US04          | US03 , US02, US01       |
| 10   | [10.png](docs/images/mockup/10.png) | Registro de frota (tag, placa, modelo, combustível; CSV; editar / excluir)     | US05,US11     | US10, US06, US04        |
| 11   | [11.png](docs/images/mockup/11.png) | Configurações — conta e calibração operacional (parâmetros de ROI)             | US05          | US11                    |
| 12   | [12.png](docs/images/mockup/12.png) | Gerar relatórios com filtros e área de resultado                               | US05          | US10,US01,US02,US03,US04|

### Galeria de mockups

Seleção das telas mais representativas; as demais permanecem na tabela acima e em [`docs/images/mockup/`](docs/images/mockup/).

<table>
  <tr>
    <td align="center" valign="top" width="50%">
      <p><strong>Tela 01</strong> — Dashboard, aba Carbono</p>
      <img src="docs/images/mockup/01.png" alt="Mockup: dashboard mobile com placar de tempo, impacto lúdico na aba Carbono e meta semanal" width="340" />
    </td>
    <td align="center" valign="top" width="50%">
      <p><strong>Tela 04</strong> — Resumo e últimas passagens</p>
      <img src="docs/images/mockup/04.png" alt="Mockup: resumo total de passagens CO2 e horas e lista de últimas passagens com métricas por praça" width="340" />
    </td>
  </tr>
  <tr>
    <td align="center" valign="top">
      <p><strong>Tela 05</strong> — Notificação push</p>
      <img src="docs/images/mockup/05.png" alt="Mockup: tela de bloqueio com notificação de passagem limpa CO2 diesel e minutos ganhos" width="340" />
    </td>
    <td align="center" valign="top">
      <p><strong>Tela 08</strong> — Rota Verde e eco-estimativa</p>
      <img src="docs/images/mockup/08.png" alt="Mockup: mapa com rota verde rotulada e painel com CO2 evitado e tempo poupado antes de iniciar rota" width="340" />
    </td>
  </tr>
  <tr>
    <td align="center" valign="top">
      <p><strong>Tela 09</strong> — Dashboard web operacional</p>
      <img src="docs/images/mockup/09.png" alt="Mockup: dashboard web com KPIs CO2 combustível ROI taggys filtros exportar ESG e tabela top 5" width="440" />
    </td>
    <td align="center" valign="top">
      <p><strong>Tela 10</strong> — Registro de frota</p>
      <img src="docs/images/mockup/10.png" alt="Mockup: tabela de registro de frota com tag placa modelo combustível importar CSV e ações editar excluir" width="440" />
    </td>
  </tr>
</table>

<a id="diagramas-de-atividades-user-stories"></a>

## Diagramas de atividades (user stories)

Cada user story **US01–US11** tem fluxo em **PlantUML** (`us01.puml` … `us11.puml`) e **draw.io** (`us01.drawio` … `us11.drawio`) em [`docs/diagramas/specs/`](docs/diagramas/specs/). A **US08** inclui ainda uma vista complementar só de mapa em [`us08-mapa.drawio`](docs/diagramas/specs/us08-mapa.drawio). As figuras abaixo são exportações geradas a partir dos `.puml` para [`docs/diagramas/US01.png`](docs/diagramas/US01.png) … [`US11.png`](docs/diagramas/US11.png).

**[Abrir diagramas no draw.io — Google Drive](https://drive.google.com/file/d/1XGv4y-BJ-yUia8EKnrTdb78NESRhesFB/view?usp=drive_link)** (pode estar desatualizado em relação à pasta `specs/` — preferir os ficheiros do repositório.)

### Galeria de diagramas (exportados)

Seleção das **US de prioridade alta** mais representativas para leitura rápida; as restantes (**US06–US11**) estão nos ficheiros PNG na mesma pasta.

<table>
  <tr>
    <td align="center" valign="top" width="50%">
      <p><strong>US01</strong> — Tradução Lúdica de Impacto</p>
      <img src="docs/diagramas/US01.png" alt="Diagrama de atividades US01 Tradução Lúdica de Impacto" width="440" />
    </td>
    <td align="center" valign="top" width="50%">
      <p><strong>US02</strong> — Conversor de Combustível em Carbono</p>
      <img src="docs/diagramas/US02.png" alt="Diagrama de atividades US02 Conversor de Combustível em Carbono" width="440" />
    </td>
  </tr>
  <tr>
    <td align="center" valign="top">
      <p><strong>US03</strong> — Cálculo de Economia de Papel Térmico</p>
      <img src="docs/diagramas/US03.png" alt="Diagrama de atividades US03 Cálculo de Economia de Papel Térmico" width="440" />
    </td>
    <td align="center" valign="top">
      <p><strong>US04</strong> — Dashboard Comparativo "Com vs. Sem Taggy"</p>
      <img src="docs/diagramas/US04.png" alt="Diagrama de atividades US04 Dashboard Comparativo Com vs. Sem Taggy" width="440" />
    </td>
  </tr>
  <tr>
    <td align="center" valign="top">
      <p><strong>US05</strong> — Gestão de Inventário de Frota"</p>
      <img src="docs/diagramas/US05.png" alt="Diagrama de atividades US05 Gestão de Inventário de Frota" width="440" />
    </td>
  </tr>
</table>

---

## Backlog (Trello)

O backlog do projeto está organizado no quadro da equipe na disciplina, com cartões alinhados às user stories e prioridades. Acompanhe o estado das tarefas em: [Trello – cesar-projetos-2](https://trello.com/b/alfFb7dV/cesar-projetos-2).

### Sprint 1

Coluna _Backlog (Sprint)_ no Trello: **US05**, **US02**, **US03**.

<img src="docs/images/sprint-01.png" alt="Backlog Sprint 1 — coluna Backlog (Sprint) com US05, US02, US03" width="440" />

### Sprint 2

Coluna _Backlog (Sprint)_ no Trello: **US01**, **US04**.

<img src="docs/images/sprint-02.png" alt="Backlog Sprint 2 — coluna Backlog (Sprint) com US01, US04" width="440" />

### Sprint 3

Coluna _Backlog (Sprint)_ no Trello: **US06**, **US07**, **US08**, **US09**.

<img src="docs/images/sprint-03.png" alt="Backlog Sprint 3 — coluna Backlog (Sprint) com US06, US07, US08, US09" width="440" />

### Sprint 4

Coluna _Backlog (Sprint)_ no Trello: **US10**, **US11**.

<img src="docs/images/sprint-04.png" alt="Backlog Sprint 4 — coluna Backlog (Sprint) com US10, US11" width="440" />

---

## Links importantes

Referências usadas no dia a dia do projeto — código, desenho da solução, modelagem e acompanhamento do backlog.

| Área                    | Link                                                                                                        |
| :---------------------- | :---------------------------------------------------------------------------------------------------------- |
| Código                  | [GitHub](https://github.com/WillPontes/FDS-Projetos2)                                                       |
| Backlog e Sprints       | [Trello](https://trello.com/b/alfFb7dV/cesar-projetos-2)                                                    |
| Wireframes              | [Figma](https://www.figma.com/design/ME63dOBQJ943GhMTh00W4g/Wireframe?node-id=0-1&p=f&t=KS4WtIegdrdhUasH-0) |
| Screencast              | [YouTube](https://www.youtube.com/watch?v=7lFrXswsO0k)                                                      |
| Diagramas de Atividades | [Google Drive](https://drive.google.com/file/d/1XGv4y-BJ-yUia8EKnrTdb78NESRhesFB/view?usp=drive_link)       |

---

## Equipe e Papéis

| Nome              | Papel                   | E-mail             | LinkedIn                                                         | GitHub                                      |
| :---------------- | :---------------------- | :----------------- | :--------------------------------------------------------------- | :------------------------------------------ |
| _Afonso Araujo_   | Engenheiro de Dados  | ahma@cesar.school  | [LinkedIn](https://www.linkedin.com/in/afonso-araujo-8ab810369/) | [GitHub](https://github.com/araujo1901mx)   |
| _Igor Phillipe_   | Tech Lead & Desenvolvedor FullStack               | ipara@cesar.school | [LinkedIn](https://www.linkedin.com/in/igrphillipe/)             | [GitHub](https://github.com/IgrPhillipe)    |
| _Williams Pontes_ | Product Owner & Desenvolvedor Back-End  | jwlp@cesar.school  | [LinkedIn](https://www.linkedin.com/in/williams-pontes/)         | [GitHub](https://github.com/WillPontes)     |
| _Jean Augusto_    | Desenvolvedor FullStack  | jasm2@cesar.school | [LinkedIn](https://www.linkedin.com/in/jean-augusto-0562953b4/)  | [GitHub](https://github.com/jeanaugustox)   |
| _Lucas Gabriel_   | Desenvolvedor FullStack | lgcs2@cesar.school | [LinkedIn](https://www.linkedin.com/in/lucasgabrielcs/)          | [GitHub](https://github.com/lucasgabrielcs) |
| _Kellwen Costa_   | Desenvolvedor Back-End  | kilc@cesar.school  | [LinkedIn](https://www.linkedin.com/in/kellwencosta/)            | [GitHub](https://github.com/kellwencosta)   |

---

Este projeto faz parte da disciplina de SI010 - Fundamentos de Desenvolvimento de Software.
