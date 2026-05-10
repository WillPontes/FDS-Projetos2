# User stories (CCC)

Numeração **US01–US11** alinhada ao [README](../../README.md) (prioridades, mapa de mockups e diagramas). Os cartões no Trello podem usar rótulos antigos; o link aponta para o mesmo requisito.

## Prioridade alta

### **ID: US01 – Configuração do repositório**

- **Épico / Sprint:** Fundação · antes das entregas de produto
- **Card Trello:** _(cartão dedicado no quadro, se existir)_
- **Descrição:** Garantir boilerplate, qualidade de código e documentação mínima para onboarding da equipa.
- **Card:** Como membro da equipa, quero um repositório configurado com front/back, lint, testes e CI básicos para começar a desenvolver sem retrabalho de setup.
- **Conversation:** O README deve explicar como instalar, rodar e contribuir; branches e convenções devem estar definidas.
- **Confirmation:** Repositório inicial com build verde, documentação de onboarding e padrões acordados pela equipa.

### **ID: US02 – Tradução Lúdica de Impacto**

- **Épico / Sprint:** Épico 2 – Sustentabilidade · Sprint 2
- **Card Trello:** [Tradução Lúdica](https://trello.com/c/9Z5E87c6)
- **Descrição:** Transforma dados técnicos de sustentabilidade em metáforas visuais compreensíveis para o dia a dia.
- **Card:** Como usuário, quero ver meu impacto ambiental traduzido em exemplos cotidianos (ex.: árvores, campos de futebol) para que minha contribuição seja tangível e fácil de compartilhar.
- **Conversation:** A interface deve converter kg de $CO_2$ em unidades como "filtros de café evitados" ou "km rodados de graça".
- **Confirmation:** Oferecer ao menos 3 variações de metáforas configuráveis para Água; ao menos 3 para Papel; ao menos 3 para Carbono.

### **ID: US03 – Conversor de Combustível em Carbono**

- **Épico / Sprint:** Épico 2 – Sustentabilidade · Sprint 1
- **Card Trello:** [Conversor de Combustível](https://trello.com/c/nH3dezRT)
- **Descrição:** O motor de cálculo que sustenta o pilar ESG, garantindo precisão nos dados de emissão.
- **Card:** Como gestora de sustentabilidade (Mariana), quero converter o combustível economizado em emissões de $CO_2$ evitadas para gerar relatórios ESG precisos e auditáveis.
- **Conversation:** Utilizar os fatores de emissão do GHG Protocol, diferenciando o cálculo para veículos leves (flex) e pesados (diesel).
- **Confirmation:** O dashboard exibe o cálculo em kg de $CO_2$; disponibilizar opção de exportar dados brutos (logs) para auditoria externa; validar diferenciação de cálculo entre veículos leves e pesados.

### **ID: US04 – Cálculo de Economia de Papel Térmico**

- **Épico / Sprint:** Épico 2 – Sustentabilidade · Sprint 1
- **Card Trello:** [Papel Térmico](https://trello.com/c/Kup8T53N)
- **Descrição:** Foca na redução de resíduos físicos e na digitalização do processo de pedágio/estacionamento.
- **Card:** Como gestor de operações (Ricardo), quero visualizar o impacto ambiental e operacional de não utilizar recibos físicos para eliminar resíduos e burocracia de conferência manual.
- **Conversation:** Quantificar o papel térmico (BPA) evitado por transação e converter em litros de água poupados na produção desse papel.
- **Confirmation:** Contabilizar cada passagem sem parada como um ticket evitado; exibir o total acumulado de "árvores preservadas"; converter papel evitado em litros de água poupados.

### **ID: US05 – Dashboard Comparativo "Com vs. Sem Taggy"**

- **Épico / Sprint:** Épico 3 – Operações e Valor · Sprint 2
- **Card Trello:** [Dashboard Comparativo](https://trello.com/c/Y4BV0pKS)
- **Descrição:** Ferramenta de análise financeira e operacional para provar o valor do produto.
- **Card:** Como gerente de operações, quero comparar meu gasto real contra o prejuízo estimado de um cenário sem tag para validar o retorno sobre o investimento (ROI).
- **Conversation:** O gráfico deve mostrar o "Custo da Ineficiência" (combustível em marcha lenta + desgaste de freios em filas) vs. a fluidez da Taggy.
- **Confirmation:** Apresentar delta de economia em R$; apresentar delta de economia em litros; implementar filtros por veículo, placa ou período.

### **ID: US06 – Gestão de Inventário de Frota**

- **Épico / Sprint:** Épico 3 – Operações e Valor · Sprint 1
- **Card Trello:** [Inventário de Frota](https://trello.com/c/AJeGJJyM)
- **Descrição:** Centraliza o cadastro de veículos e suas respectivas Tags para viabilizar os cálculos do sistema.
- **Card:** Como gestor de frota, quero cadastrar meus veículos vinculando placa, modelo, tipo de combustível e ID da Tag para que o sistema processe os dados de economia corretamente.
- **Conversation:** O sistema deve permitir a edição e exclusão de veículos. É essencial o upload em lote (CSV/Excel) para frotas grandes.
- **Confirmation:** Validar se uma Tag já está vinculada a outra placa no momento do cadastro; permitir o upload de dados em lote via arquivo (CSV/Excel); campos obrigatórios para Placa, Modelo, Combustível e ID da Tag; garantir edição e exclusão de veículos cadastrados.

---

## Prioridade média

### **ID: US07 – Placar de "Tempo de Vida"**

- **Épico / Sprint:** Épico 4 – Jornada do Usuário · Sprint 3
- **Card Trello:** [Placar Tempo de Vida](https://trello.com/c/84CcQXtS)
- **Descrição:** Valoriza o ativo mais precioso do motorista: o tempo.
- **Card:** Como motorista (Tiago), quero ver o acumulado de horas economizadas por não parar em filas para valorizar meu tempo produtivo ou de descanso.
- **Conversation:** O cálculo baseia-se na diferença entre o tempo médio de espera em cabines manuais e o tempo de passagem pela Tag.
- **Confirmation:** Atualizar o placar em tempo real após transação confirmada; exibir dados no formato de "Horas/Dias Ganhos".

### **ID: US08 – Roteirizador de Fluxo Sustentável**

- **Épico / Sprint:** Épico 4 – Jornada do Usuário · Sprint 3
- **Card Trello:** [Mapa e rotas / roteirização](https://trello.com/c/lhEPxiOI) (subtarefas de mapa e motor no mesmo cartão)
- **Descrição:** Combina visualização de **rotas verdes** no mapa com o **motor de roteirização** que sugere trajetos com menor impacto.
- **Card:** Como motorista, quero ver no mapa corredores com maior fluidez e receber uma rota sugerida com estimativa de $CO_2$ evitado antes de iniciar o trajeto.
- **Conversation:** Integração com API de mapas; sinalizar "Rotas Verdes"; comparar rotas padrão vs. alta fluidez e estimar emissões e desgaste.
- **Confirmation:** Rotas verdes visíveis no mapa; exibir estimativa de $CO_2$ evitado antes de iniciar; sugestão de rota baseada em eficiência de emissões.

### **ID: US09 – Notificações "Passagem Limpa"**

- **Épico / Sprint:** Épico 4 – Jornada do Usuário · Sprint 3
- **Card Trello:** [Passagem Limpa](https://trello.com/c/dNk1M69w)
- **Descrição:** Reforço positivo imediato para engajar o motorista após o uso.
- **Card:** Como motorista, quero receber um push logo após passar pelo pedágio informando o impacto positivo imediato daquela ação específica.
- **Conversation:** Mensagens devem refletir a transação processada e reforçar economia e carbono evitado naquele momento.
- **Confirmation:** Disparar notificação em até 3 minutos após o processamento da transação; incluir dados variáveis de economia de combustível e $CO_2$ no texto do push.

---

## Prioridade baixa

### **ID: US10 – Barra de Progresso de Metas Semanais**

- **Épico / Sprint:** Épico 4 – Jornada do Usuário · Sprint 4
- **Card Trello:** [Metas Semanais](https://trello.com/c/Jlrq3Nj3)
- **Descrição:** Elemento de gamificação para manter o uso recorrente do serviço.
- **Card:** Como Product Lead (Jéssica), quero implementar metas de economia semanais para aumentar o engajamento e a retenção do usuário.
- **Conversation:** Interface visual onde o usuário acompanha quanto falta para bater sua meta de eficiência verde (ex.: completar 10 passagens sem fila).
- **Confirmation:** Barra de progresso funcional na interface; permitir personalização de metas por frota ou perfil individual.

### **ID: US11 – Calculadora de Payback Operacional**

- **Épico / Sprint:** Épico 3 – Operações e Valor · Sprint 4
- **Card Trello:** [Payback Operacional](https://trello.com/c/tjykXgcs)
- **Descrição:** Demonstra transparência financeira sobre o custo do serviço.
- **Card:** Como proprietário de veículo, quero comparar o custo da mensalidade da tag com a economia gerada para saber quando o serviço se torna "lucro".
- **Conversation:** Relatório simplificado: (Economia de combustível + Manutenção) − Mensalidade = Saldo real.
- **Confirmation:** Destacar status "Tag Paga" quando a economia superar a mensalidade; exibir o cálculo de saldo real de forma clara.
# User stories (CCC)

Numeração **US01–US11** alinhada ao [README](../README.md) (prioridades, mapa de mockups e diagramas). Os cartões no Trello podem usar rótulos antigos; o link aponta para o mesmo requisito.

## Prioridade alta

### **ID: US01 – Tradução Lúdica de Impacto**

- **Épico / Sprint:** Épico 2 – Sustentabilidade · Sprint 2
- **Card Trello:** [Tradução Lúdica](https://trello.com/c/9Z5E87c6)
- **Descrição:** Transforma dados técnicos de sustentabilidade em metáforas visuais compreensíveis para o dia a dia.
- **Card:** Como usuário, quero ver meu impacto ambiental traduzido em exemplos cotidianos (ex.: árvores, campos de futebol) para que minha contribuição seja tangível e fácil de compartilhar.
- **Conversation:** A interface deve converter kg de $CO_2$ em unidades como "filtros de café evitados" ou "km rodados de graça".
- **Confirmation:** Oferecer ao menos 3 variações de metáforas configuráveis para Carbono; ao menos 3 para Água; ao menos 3 para Papel.

### **ID: US02 – Conversor de Combustível em Carbono**

- **Épico / Sprint:** Épico 2 – Sustentabilidade · Sprint 1
- **Card Trello:** [Conversor de Combustível](https://trello.com/c/nH3dezRT)
- **Descrição:** O motor de cálculo que sustenta o pilar ESG, garantindo precisão nos dados de emissão.
- **Card:** Como gestora de sustentabilidade (Mariana), quero converter o combustível economizado em emissões de $CO_2$ evitadas para gerar relatórios ESG precisos e auditáveis.
- **Conversation:** Utilizar os fatores de emissão do GHG Protocol, diferenciando o cálculo para veículos leves (flex) e pesados (diesel).
- **Confirmation:** O dashboard exibe o cálculo em kg de $CO_2$; disponibilizar opção de exportar dados brutos (logs) para auditoria externa; validar diferenciação de cálculo entre veículos leves e pesados.

### **ID: US03 – Cálculo de Economia de Papel Térmico**

- **Épico / Sprint:** Épico 2 – Sustentabilidade · Sprint 1
- **Card Trello:** [Papel Térmico](https://trello.com/c/Kup8T53N)
- **Descrição:** Foca na redução de resíduos físicos e na digitalização do processo de pedágio/estacionamento.
- **Card:** Como gestor de operações (Ricardo), quero visualizar o impacto ambiental e operacional de não utilizar recibos físicos para eliminar resíduos e burocracia de conferência manual.
- **Conversation:** Quantificar o papel térmico (BPA) evitado por transação e converter em litros de água poupados na produção desse papel.
- **Confirmation:** Contabilizar cada passagem sem parada como um ticket evitado; exibir o total acumulado de "árvores preservadas"; converter papel evitado em litros de água poupados.

### **ID: US04 – Dashboard Comparativo "Com vs. Sem Taggy"**

- **Épico / Sprint:** Épico 3 – Operações e Valor · Sprint 2
- **Card Trello:** [Dashboard Comparativo](https://trello.com/c/Y4BV0pKS)
- **Descrição:** Ferramenta de análise financeira e operacional para provar o valor do produto.
- **Card:** Como gerente de operações, quero comparar meu gasto real contra o prejuízo estimado de um cenário sem tag para validar o retorno sobre o investimento (ROI).
- **Conversation:** O gráfico deve mostrar o "Custo da Ineficiência" (combustível em marcha lenta + desgaste de freios em filas) vs. a fluidez da Taggy.
- **Confirmation:** Apresentar delta de economia em R$; apresentar delta de economia em litros; implementar filtros por veículo, placa ou período.

### **ID: US05 – Gestão de Inventário de Frota**

- **Épico / Sprint:** Épico 3 – Operações e Valor · Sprint 1
- **Card Trello:** [Inventário de Frota](https://trello.com/c/AJeGJJyM)
- **Descrição:** Centraliza o cadastro de veículos e suas respectivas Tags para viabilizar os cálculos do sistema.
- **Card:** Como gestor de frota, quero cadastrar meus veículos vinculando placa, modelo, tipo de combustível e ID da Tag para que o sistema processe os dados de economia corretamente.
- **Conversation:** O sistema deve permitir a edição e exclusão de veículos. É essencial capturar o tipo de combustível para alimentar o motor de cálculo de CO2.
- **Confirmation:** Validar se uma Tag já está vinculada a outra placa no momento do cadastro; permitir o upload de dados em lote via arquivo (CSV/Excel); campos obrigatórios para Placa, Modelo, Combustível e ID da Tag; garantir edição e exclusão de veículos cadastrados.

---

## Prioridade média

### **ID: US06 – Placar de "Tempo de Vida"**

- **Épico / Sprint:** Épico 4 – Jornada do Usuário · Sprint 3
- **Card Trello:** [Placar Tempo de Vida](https://trello.com/c/84CcQXtS)
- **Descrição:** Valoriza o ativo mais precioso do motorista: o tempo.
- **Card:** Como motorista (Tiago), quero ver o acumulado de horas economizadas por não parar em filas para valorizar meu tempo produtivo ou de descanso.
- **Conversation:** O cálculo baseia-se na diferença entre o tempo médio de espera em cabines manuais e o tempo de passagem pela Tag.
- **Confirmation:** Atualizar o placar em tempo real após transação confirmada; exibir dados no formato de "Horas/Dias Ganhos".

### **ID: US07 – Visualização de Mapas e Rotas Verdes**

- **Épico / Sprint:** Épico 4 – Jornada do Usuário · Sprint 3
- **Card Trello:** [Mapa e rotas](https://trello.com/c/lhEPxiOI)
- **Descrição:** Interface visual para identificação de corredores logísticos sustentáveis.
- **Card:** Como motorista, quero visualizar no mapa quais rotas possuem maior fluidez de tags integradas para planejar meu trajeto visualmente.
- **Conversation:** O mapa deve sinalizar "Rotas Verdes" onde o histórico de fluxo de tags integradas garante menos paradas.
- **Confirmation:** Integração com API de mapas (Google/Mapbox); sinalizar visualmente as "Rotas Verdes" no mapa com base no histórico de fluidez.

### **ID: US08 – Motor de Roteirização Sustentável**

- **Épico / Sprint:** Épico 4 – Jornada do Usuário · Sprint 3
- **Card Trello:** [Roteirização](https://trello.com/c/lTG89UyQ)
- **Descrição:** Algoritmo de decisão logística para redução de pegada de carbono.
- **Card:** Como usuário, quero que o sistema sugira a melhor rota com base no menor impacto ambiental e menor desgaste do veículo. / Implementar a lógica de cálculo que compara rotas padrão vs. rotas de alta fluidez, estimando a redução de CO2.
- **Conversation:** Não tem.
- **Confirmation:** Exibir estimativa de CO2 evitado antes de iniciar o trajeto; calcular sugestão de rota baseada em eficiência de emissões.

### **ID: US09 – Notificações "Passagem Limpa"**

- **Épico / Sprint:** Épico 4 – Jornada do Usuário · Sprint 3
- **Card Trello:** [Passagem Limpa](https://trello.com/c/dNk1M69w)
- **Descrição:** Reforço positivo imediato para engajar o motorista após o uso.
- **Card:** Como motorista, quero receber um push logo após passar pelo pedágio informando o impacto positivo imediato daquela ação específica.
- **Conversation:** Mensagens devem refletir a transação processada e reforçar economia e carbono evitado naquele momento.
- **Confirmation:** Disparar notificação em até 3 minutos após o processamento da transação; incluir dados variáveis de economia de combustível e $CO_2$ no texto do push.

---

## Prioridade baixa

### **ID: US10 – Barra de Progresso de Metas Semanais**

- **Épico / Sprint:** Épico 4 – Jornada do Usuário · Sprint 4
- **Card Trello:** [Metas Semanais](https://trello.com/c/Jlrq3Nj3)
- **Descrição:** Elemento de gamificação para manter o uso recorrente do serviço.
- **Card:** Como Product Lead (Jéssica), quero implementar metas de economia semanais para aumentar o engajamento e a retenção do usuário no aplicativo.
- **Conversation:** Interface visual onde o usuário acompanha quanto falta para bater sua meta de eficiência verde (ex.: completar 10 passagens sem fila).
- **Confirmation:** Barra de progresso funcional na interface; permitir personalização de metas por frota ou perfil individual.

### **ID: US11 – Calculadora de Payback Operacional**

- **Épico / Sprint:** Épico 3 – Operações e Valor · Sprint 4
- **Card Trello:** [Payback Operacional](https://trello.com/c/tjykXgcs)
- **Descrição:** Demonstra transparência financeira sobre o custo do serviço.
- **Card:** Como proprietário de veículo, quero comparar o custo da mensalidade da tag com a economia gerada para saber quando o serviço se torna "lucro".
- **Conversation:** Relatório simplificado: (Economia de combustível + Manutenção) − Mensalidade = Saldo real.
- **Confirmation:** Destacar status "Tag Paga" quando a economia superar a mensalidade; exibir o cálculo de saldo real de forma clara.
