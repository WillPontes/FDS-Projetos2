# Alinhamento Técnico: Integração Taggy

1. Quais dados específicos do veículo a Taggy armazena e disponibiliza (ex: Placa, RENAVAM, Modelo, Categoria)? Podemos contar com esses dados?
2. Existe uma API ou fonte de dados oficial (confiável e atualizada) para consulta de todos os pontos de aceitação (pedágios e estacionamentos) com endereço ou coordenadas?
3. Para o registro de passagens, é possível que o sistema da Taggy envie notificações via Webhook para a nossa API em tempo real?
4. Caso não utilizem Webhooks, como podemos esperar a conexão com o sistema da Taggy? Idealmente precisariamos receber a informação assim que o motorista passar pelo pedágio/estacionamento
5. Como o sistema de vocês gerencia a hierarquia de organizações? 
  Nossa estrutura atual é baseada em:
    * `Organização` ➔ `Veículo`
    * `Organização` ➔ `Usuário (Gestor)`
  Esse modelo é compatível com a forma que vocês estruturam frotas e clientes corporativos?
6. Vocês possuem alguma base ou estudo com o tempo médio que um veículo gasta no pedágio com a tag e sem a tag? Precisamos dessa estimativa de tempo para conseguir calcular o 'tempo salvo' e o 'CO2 evitado' que vamos mostrar nos gráficos.
7. Disponibilizar algum schema ou contrato de dados para importar alguns valores antigos, para conseguir ter uma visão de valores de sustentabilidade nos ultimos tempos.
