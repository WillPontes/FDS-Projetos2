# Racional do Desafio – Cálculo de Emissões Evitadas pelo Uso de Tags de Pagamento

## 1. Contextualização: por que este tema importa?

A transição para uma economia de baixo carbono exige reduzir emissões em toda a cadeia de deslocamentos — desde o transporte de cargas até o tráfego urbano cotidiano. Embora se fale muito em combustíveis renováveis e veículos elétricos, existe um grande potencial de redução de emissões em algo simples e cotidiano: o modo como as pessoas interagem com sistemas de pagamento de mobilidade.

Tags de pagamento automático como as utilizadas em pedágios, estacionamentos e acessos controlados permitem que o motorista passe sem parar, evitando:

- filas
- frenagens bruscas
- acelerações intensas após a cabine
- emissão de tickets de papel
- desperdício de tempo e combustível

Essas microeficiências, repetidas milhões de vezes por dia, representam uma redução real e mensurável de emissões de Gases de Efeito Estufa (GEE).
O desafio proposto busca quantificar esse impacto.

## 2. O Desafio: O que queremos calcular

Os estudantes deverão estimar quanto de CO₂e é evitado quando um usuário utiliza uma tag de pagamento automático, em comparação a um cenário sem tag.

Ou seja:
**Emissões evitadas = Emissões no cenário “sem tag” – Emissões no cenário “com tag”**

## 3. Principais fontes de emissão a considerar

A seguir, estão as premissas que podem compor o modelo — mas os alunos poderão aprimorá-las ou sugerir novas variáveis.

### 3.1. Frenagem e Aceleração em Praças de Pedágio

No cenário “sem tag”, o veículo precisa:

- reduzir velocidade
- parar
- realizar o pagamento manual
- acelerar novamente

Esses ciclos de frenagem + aceleração geram picos de consumo de combustível, aumentando emissões.

**Parâmetros recomendados:**

- consumo adicional por aceleração (l/100km ou ml por evento)
- fatores de emissão de combustíveis
- tempo médio de espera em cabine manual

### 3.2. Filas e Marcha Lenta

A marcha lenta em filas de pedágio gera emissões contínuas.

**Parâmetros:**

- tempo típico em fila (minutos)
- consumo médio em marcha lenta (l/h)
- fatores de emissão por tipo de veículo

### 3.3. Emissão de Ticket em Estacionamentos

O uso de tag dispensa o ticket de papel.

**Parâmetros:**

- peso do ticket e composição
- emissões do ciclo de vida do papel
- emissões da cadeia logística (impressão, transporte etc.)

### 3.4. Congestionamentos e Paradas em Acessos Controlados

Estacionamentos com cancelas manuais geram:

- micro congestionamentos
- espera para emissão/validação de ticket
- novo ciclo de aceleração

### 3.5. Adicional: Emissões Evitadas por Digitalização (caso viável)

Processos automatizados substituem:

- impressão de recibos físicos
- uso de máquinas POS
- consumo elétrico adicional por interação manual prolongada

## 4. O que deve ser desenvolvido pelos estudantes

Assim como no documento que você enviou, o desafio possui etapas bem definidas.

### Etapa 1 — Construção dos Cenários (Com Tag vs. Sem Tag)

Os alunos devem modelar o comportamento de um motorista nos dois cenários, definindo:

- tempo gasto
- distâncias adicionais ou velocidade média
- número de eventos de frenagem e aceleração
- tempo em marcha lenta
- geração de tickets e resíduos

A solução deve ser transparente: todas as premissas claras e justificadas.

### Etapa 2 — Cálculo das Emissões pelo Método Comparativo

Os estudantes devem calcular:

- **Emissões por combustível**
  - Combustão em marcha lenta
  - Consumo adicional por aceleração
  - Consumo por permanência extra na via
- **Emissões de resíduos (p. ex. papel)**
  - Ciclo de vida
  - Descarte
- **Outras emissões identificadas pelos estudantes (caso mapeadas)**
  - (ex.: energia consumida por operações manuais prolongadas)

O resultado deve ser expresso em kg de CO₂e por passagem, podendo ser escalado para:

- mês
- ano
- território nacional

### Etapa 3 — Comparação, Impacto Final e Visualizações

Os alunos devem apresentar:

- Planilha de cálculo replicável, contendo as emissões por passagem de cada um dos cenários e a estimativa total de emissões evitadas pela adoção de tags
- Tabela de premissas do modelo, contendo as fontes utilizadas para cálculo das emissões
- Sensibilidade do cálculo (como o resultado muda caso as premissas variem)

## 5. Objetivo Final do Desafio

Ao final, a universidade entregará:

- um modelo robusto, replicável e auditável
- capaz de estimar a redução real de CO₂e causada pelo uso de tags
- que poderá ser utilizado em:
  - relatórios de sustentabilidade
  - inventário de emissões
  - comunicações ESG
  - cálculo de impacto positivo para clientes
  - estudos comparativos de mobilidade e eficiência operacional

O resultado permitirá que a empresa:

- quantifique seu benefício ambiental,
- comunique com precisão seu impacto,
- melhore sua estratégia de sustentabilidade,
- apoie políticas públicas de mobilidade inteligente.
